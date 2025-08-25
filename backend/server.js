import express from "express"
import cors from "cors"
import multer from "multer"
import fs from "fs"
import path from "path"
import os from "os"
import dotenv from "dotenv"
import {
  insertUser,
  insertSession,
  getUserByEmail,
  supabase,
} from "./supabase.js"
import OpenAI from "openai"
import vision from "@google-cloud/vision"
import mime from "mime-types"

dotenv.config()

const app = express()
app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(",") ?? "*" }))
app.use(express.json())

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(os.tmpdir(), "aluma")
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      // Preserve original file extension
      const ext = path.extname(file.originalname)
      const name = path.basename(file.originalname, ext)
      cb(null, `${name}-${Date.now()}${ext}`)
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // Increased to 100MB for larger video files
  fileFilter: (req, file, cb) => {
    const isImg = file.mimetype.startsWith("image/")
    const isAud = file.mimetype.startsWith("audio/")
    const isVid = file.mimetype.startsWith("video/")
    const isText =
      file.mimetype === "text/plain" ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    if (!isImg && !isAud && !isVid && !isText)
      return cb(
        new Error(
          "Only image/*, audio/*, video/*, or document files are supported"
        )
      )
    cb(null, true)
  },
})

let openai
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
} else {
  openai = null
}

let visionClient = null
if (process.env.GCP_CREDENTIALS_B64) {
  try {
    visionClient = new vision.ImageAnnotatorClient({
      credentials: JSON.parse(
        Buffer.from(process.env.GCP_CREDENTIALS_B64, "base64").toString("utf8")
      ),
    })
  } catch (error) {
    console.warn(
      "⚠️ Failed to initialize Google Cloud Vision client:",
      error.message
    )
    visionClient = null
  }
} else {
  console.warn(
    "⚠️ GCP_CREDENTIALS_B64 not set. Image processing will be disabled."
  )
}

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
  })
})

app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file?.path
  const mimeType = req.file?.mimetype
  if (!filePath || !mimeType) return res.status(400).json({ error: "No file" })

  let text = ""
  let kind = mimeType.split("/")[0]

  try {
    if (kind === "image") {
      if (!visionClient) {
        throw new Error(
          "Google Cloud Vision not configured. Image processing is disabled."
        )
      }
      const [result] = await visionClient.textDetection(filePath)
      text =
        result?.textAnnotations?.[0]?.description?.trim() || "No text found."
    } else if (kind === "audio" || kind === "video") {
      if (!openai) throw new Error("OPENAI_API_KEY not configured")
      const resp = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
      })
      text = resp?.text?.trim() || "No transcript."
    } else if (mimeType === "text/plain") {
      // Read text file directly
      text = fs.readFileSync(filePath, "utf8").trim()
    } else if (
      mimeType === "application/pdf" ||
      mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // For now, return a placeholder for document processing
      // In a full implementation, you'd use libraries like pdf-parse, mammoth, etc.
      text =
        "Document processing not yet implemented. Please use text files, images, audio, or video files."
    }

    const meta = {
      filename: req.file.originalname,
      mimetype: mimeType,
      size: req.file.size,
      timestamp: new Date().toISOString(),
    }

    // Save session data to Supabase for analytics and user history
    // Note: userId will be null for demo purposes, but can be linked when user auth is implemented
    try {
      await insertSession({
        userId: req.body.userId || null, // Optional: link to user if available
        filename: req.file.originalname,
        fileType: mimeType,
        fileSize: req.file.size,
        extractedText: text,
      })
    } catch (sessionError) {
      console.error("Failed to save session data:", sessionError)
      // Don't fail the upload if session saving fails
    }

    res.json({ text, meta })
  } catch (err) {
    console.error("Upload processing error:", err)
    res.status(500).json({
      error: "Processing failed.",
      details: err.message,
    })
  } finally {
    try {
      fs.unlinkSync(filePath)
    } catch {}
  }
})

// Endpoint to save user onboarding data to Supabase
// This supports AI prompt personalization and demo analytics
app.post("/onboarding", async (req, res) => {
  const userData = req.body

  if (!userData.name || !userData.email || !userData.isCareerCoach) {
    return res
      .status(400)
      .json({ error: "Name, email, and career coach status are required" })
  }

  try {
    // Save user data to Supabase for AI personalization and analytics
    const newUser = await insertUser(userData)

    res.json({
      success: true,
      userId: newUser.id,
      message: "User data saved successfully",
    })
  } catch (error) {
    console.error("Onboarding error:", error)
    res.status(500).json({ error: "Failed to save user data" })
  }
})

// Endpoint to update beta waitlist consent
app.post("/beta-consent", async (req, res) => {
  const { email, consent } = req.body

  if (!email || consent === undefined) {
    return res.status(400).json({ error: "Email and consent are required" })
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ beta_waitlist_consent: consent })
      .eq("email", email)
      .select()

    if (error) {
      console.error("Error updating beta consent:", error)
      return res.status(500).json({ error: "Failed to update consent" })
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      success: true,
      message: consent
        ? "Added to beta waitlist!"
        : "Removed from beta waitlist",
      user: data[0],
    })
  } catch (error) {
    console.error("Beta consent error:", error)
    res.status(500).json({ error: "Failed to update beta consent" })
  }
})

app.post("/generate", async (req, res) => {
  const { content, formats, userContext, userEmail, userId } = req.body

  console.log("Generate endpoint called with:", {
    content: content?.substring(0, 100),
    formats,
    userContext: !!userContext,
    userEmail,
    userId,
  })

  if (!content || !formats || !Array.isArray(formats) || formats.length === 0) {
    console.log("Invalid request data:", {
      content: !!content,
      formats,
      isArray: Array.isArray(formats),
      length: formats?.length,
    })
    return res.status(400).json({ error: "Content and formats are required" })
  }

  if (!openai) {
    console.log("OpenAI not configured")
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" })
  }

  try {
    const generatedContent = {}

    // Build user context string for personalization
    // Try to get user data from Supabase first, fallback to provided context
    let userContextString = ""
    let userData = userContext

    // If userEmail is provided, try to get user data from Supabase
    if (userEmail) {
      try {
        const dbUser = await getUserByEmail(userEmail)
        if (dbUser) {
          userData = {
            name: dbUser.name,
            businessName: dbUser.business_name,
            isCareerCoach: dbUser.is_career_coach ? "Yes" : "No",
            coachingExpertise: dbUser.coaching_expertise,
            profession: dbUser.profession,
            yearsOfExperience: dbUser.years_of_experience?.toString(),
            additionalContext: dbUser.additional_context,
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data from Supabase:", error)
        // Fallback to provided userContext
      }
    }

    if (userData) {
      const {
        name,
        businessName,
        isCareerCoach,
        coachingExpertise,
        otherExpertise,
        profession,
        yearsOfExperience,
        additionalContext,
      } = userData

      userContextString = `User Context:
- Name: ${name || "N/A"}
- Business: ${businessName || "N/A"}
- Career Coach: ${isCareerCoach || "N/A"}`

      if (isCareerCoach === "Yes") {
        userContextString += `
- Coaching Expertise: ${
          coachingExpertise === "other"
            ? otherExpertise
            : coachingExpertise || "N/A"
        }`
      } else if (isCareerCoach === "No") {
        userContextString += `
- Profession: ${profession || "N/A"}`
      }

      if (yearsOfExperience) {
        userContextString += `
- Years of Experience: ${yearsOfExperience}`
      }

      if (additionalContext) {
        userContextString += `
- Additional Context: ${additionalContext}`
      }

      userContextString += "\n\n"
    }

    for (const format of formats) {
      let prompt = ""

      switch (format) {
        case "linkedin":
          prompt = `${userContextString}Create an engaging LinkedIn post based on this content. Consider the user's background, expertise, and business when crafting the message. The post should be:
- Professional yet conversational
- Include relevant hashtags (3-5)
- Optimized for LinkedIn's algorithm
- Include a compelling hook
- Be between 100-200 words
- End with a call-to-action
- Reflect the user's professional perspective and expertise
- Mention their business/organization when appropriate and relevant

Content: ${content}

LinkedIn Post:`
          break

        case "newsletter":
          prompt = `${userContextString}Create a professional email newsletter based on this content. Tailor the language and focus to match the user's professional background, expertise, and business. Include:
- An attention-grabbing subject line
- A compelling opening paragraph
- Key insights and takeaways
- Professional tone appropriate to the user's field
- Clear call-to-action
- Professional closing
- Content that reflects the user's perspective and expertise
- Reference their business/organization when appropriate

Content: ${content}

Newsletter:`
          break

        case "summary":
          prompt = `${userContextString}Create a concise summary and synthesis of this content. Frame the insights from the user's professional perspective and expertise. Include:
- Key points and insights
- Actionable takeaways relevant to the user's field
- Main themes
- Important data or statistics mentioned
- Recommendations or next steps that align with the user's background
- Professional insights that leverage the user's expertise

Content: ${content}

Summary:`
          break

        case "clientFollowUp":
          prompt = `${userContextString}Create a professional client follow-up email template based on this content. Adapt the tone and content to reflect the user's professional expertise, role, and business. Include:
- Personalized greeting
- Reference to the content/discussion
- Key points and next steps appropriate to the user's expertise
- Professional tone that matches the user's field
- Clear action items
- Professional closing
- Content that demonstrates the user's professional knowledge and perspective
- Reference their business/organization when appropriate

Content: ${content}

Client Follow-up Email:`
          break

        default:
          continue
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional content creator and business communication expert. Create high-quality, engaging content that is ready to use.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      })

      generatedContent[format] = completion.choices[0].message.content.trim()
    }

    // Save session data for content generation (only if userId is provided)
    if (userId) {
      try {
        await insertSession({
          userId: userId,
          filename: `generated-content-${Date.now()}`,
          fileType: "text/generated",
          fileSize: JSON.stringify(generatedContent).length,
          extractedText: content, // Store the original content that was used for generation
        })
        console.log("Session data saved for content generation")
      } catch (sessionError) {
        console.error(
          "Failed to save session data for generation:",
          sessionError
        )
        // Don't fail the generation if session saving fails
      }
    } else {
      console.log(
        "No userId provided, skipping session tracking for generation"
      )
    }

    res.json({ content: generatedContent })
  } catch (err) {
    console.error("Generation error:", err)
    res.status(500).json({ error: "Content generation failed" })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 25MB." })
    }
    return res.status(400).json({ error: "File upload error: " + err.message })
  }

  res.status(500).json({ error: "Internal server error" })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API listening on :${PORT}`))
