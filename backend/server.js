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
  const {
    content,
    formats,
    userContext,
    userEmail,
    userId,
    insights,
    prompt: customPrompt,
  } = req.body

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

    // Use custom prompt if provided, otherwise use default format-specific prompts
    if (customPrompt) {
      // Add user context to the custom prompt for personalization
      const personalizedPrompt = userContextString
        ? `${userContextString}${customPrompt}`
        : customPrompt

      // Generate content for all formats using the custom prompt
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
            content: personalizedPrompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      })

      const generatedText = completion.choices[0].message.content.trim()

      // Split the generated content by format if it contains multiple formats
      if (formats.length === 1) {
        generatedContent[formats[0]] = generatedText
      } else {
        // If multiple formats, try to parse the response
        const formatSections = generatedText.split(
          /(?=LinkedIn Post:|Blog Post:|Newsletter:)/i
        )

        formats.forEach((format) => {
          const section = formatSections.find((section) =>
            section.toLowerCase().includes(format.toLowerCase())
          )
          if (section) {
            generatedContent[format] = section
              .replace(new RegExp(`${format}:`, "i"), "")
              .trim()
          } else {
            // Fallback: use the entire response for each format
            generatedContent[format] = generatedText
          }
        })
      }
    } else {
      // Use default format-specific prompts
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

          case "blog":
            prompt = `${userContextString}Create an engaging blog post based on this content. Consider the user's background, expertise, and business when crafting the message. The post should be:
- In-depth and educational
- Include storytelling elements
- Be between 500-800 words
- Include actionable takeaways
- Professional yet conversational tone
- Reflect the user's professional perspective and expertise
- Include relevant examples and insights

Content: ${content}

Blog Post:`
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

app.post("/extract", async (req, res) => {
  const { content, userId, prompt } = req.body

  console.log("Extract endpoint called with:", {
    content: content?.substring(0, 100),
    userId,
    hasPrompt: !!prompt,
  })

  if (!content) {
    console.log("Invalid request data: missing content")
    return res.status(400).json({ error: "Content is required" })
  }

  if (!openai) {
    console.log("OpenAI not configured")
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an inquisitive, analytical, and strategic writer, business consultant, and social media specialist. Analyze content deeply and provide strategic insights in the exact JSON format requested.",
        },
        {
          role: "user",
          content:
            prompt ||
            `You are an inquisitive coaching consultant analyzing the user's content. Your task is to extract key insights that reveal growth opportunities and provide actionable coaching wisdom.

EXTRACTION GUIDELINES:
- Act as an inquisitive coaching consultant analyzing the content
- Extract deeper insights and patterns that reveal growth opportunities
- Provide actionable coaching wisdom, not just summary of what was said
- Look for underlying themes, challenges, and breakthrough moments
- Offer strategic perspectives that help the person understand their journey better

Please provide your analysis in the following JSON format:
{
  "keyInsights": [
    {
      "id": 1,
      "text": "Coaching insight that synthesizes the content through the lens of an inquisitive consultant - provide actionable wisdom, not just summary",
      "type": "insight"
    }
  ]
}

IMPORTANT: Focus on EXTRACTING SPECIFIC INSIGHTS from the provided content, not generic advice. Every insight should be directly related to what the user has shared. Provide actionable coaching wisdom, not just summary of what was said.

Content to analyze: ${content}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const responseText = completion.choices[0].message.content.trim()

    // Try to parse the JSON response
    let analysis
    try {
      analysis = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse OpenAI response as JSON:", parseError)
      console.log("Raw response:", responseText)

      // Fallback: return enhanced business-focused analysis
      const sentences = content
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 20)
      const wordCount = content.split(/\s+/).length
      const sentenceCount = content.split(/[.!?]+/).length - 1

      analysis = {
        keyInsights: (() => {
          // Generate coaching insights from the content
          const insights = []

          // Analyze the content for coaching insights
          const text = content.toLowerCase()

          // Look for career transition insights
          if (
            text.includes("new role") ||
            text.includes("transition") ||
            text.includes("change")
          ) {
            insights.push({
              id: 1,
              text: "Career transitions require both technical preparation and mindset shifts - focus on building confidence in your new identity",
              type: "insight",
            })
          }

          // Look for leadership insights
          if (
            text.includes("lead") ||
            text.includes("manage") ||
            text.includes("team")
          ) {
            insights.push({
              id: insights.length + 1,
              text: "Leadership is about influence, not just authority - develop your ability to inspire and guide others",
              type: "insight",
            })
          }

          // Look for confidence/mindset insights
          if (
            text.includes("confidence") ||
            text.includes("imposter") ||
            text.includes("doubt")
          ) {
            insights.push({
              id: insights.length + 1,
              text: "Imposter syndrome often signals growth - use it as a compass pointing toward areas where you're expanding your capabilities",
              type: "insight",
            })
          }

          // Look for networking insights
          if (
            text.includes("network") ||
            text.includes("relationship") ||
            text.includes("connect")
          ) {
            insights.push({
              id: insights.length + 1,
              text: "Professional relationships are built on mutual value - focus on how you can help others while building your network",
              type: "insight",
            })
          }

          // Look for skill development insights
          if (
            text.includes("skill") ||
            text.includes("learn") ||
            text.includes("develop")
          ) {
            insights.push({
              id: insights.length + 1,
              text: "Skill development should align with your long-term vision - choose learning that builds toward your desired future",
              type: "insight",
            })
          }

          // Look for communication insights
          if (
            text.includes("communicate") ||
            text.includes("present") ||
            text.includes("speak")
          ) {
            insights.push({
              id: insights.length + 1,
              text: "Effective communication is about connecting with your audience's needs, not just sharing information",
              type: "insight",
            })
          }

          // If no specific insights found, provide general coaching insights
          if (insights.length === 0) {
            insights.push(
              {
                id: 1,
                text: "Your experiences reveal patterns that can guide your future decisions - reflect on what's working and what needs adjustment",
                type: "insight",
              },
              {
                id: 2,
                text: "Professional growth happens at the intersection of challenge and support - seek environments that stretch you while providing resources",
                type: "insight",
              },
              {
                id: 3,
                text: "Success is often about positioning yourself where your strengths meet market opportunities",
                type: "insight",
              }
            )
          }

          return insights.slice(0, 5)
        })(),
      }
    }

    // Save session data if userId is provided
    if (userId) {
      try {
        await insertSession({
          userId,
          sessionType: "extract",
          extractedText: content,
        })
      } catch (error) {
        console.error("Failed to save session data:", error)
        // Continue without saving session data
      }
    }

    res.json(analysis)
  } catch (error) {
    console.error("Extraction error:", error)
    res.status(500).json({ error: "Content extraction failed" })
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
