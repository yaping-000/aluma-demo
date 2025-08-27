import React, { useState } from "react"
import Onboarding from "./Onboarding"
import FileUpload from "./FileUpload"
import Preview from "./Preview"
import Results from "./Results"
import { getApiBaseUrl } from "../lib/api"

const Demo = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    isCareerCoach: "",
    coachingNiche: "",
    profession: "",
    idealClient: "",
    goals: "",
    emailContact: "Yes",
    betaWaitlistConsent: "No",
  })
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [extractedText, setExtractedText] = useState("")
  const [generatedContent, setGeneratedContent] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFormats, setSelectedFormats] = useState([])
  const [userId, setUserId] = useState(null)
  const [contentCache, setContentCache] = useState({})
  const [lastGeneratedKey, setLastGeneratedKey] = useState("")
  const [isFromCache, setIsFromCache] = useState(false)
  const [previewData, setPreviewData] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setExtractedText("")
      setGeneratedContent({})
    }
  }

  const handleUpload = async (uploadFile = null) => {
    const fileToUpload = uploadFile || file
    if (!fileToUpload) {
      console.log("No file to upload")
      return
    }

    console.log(
      "Starting upload for file:",
      fileToUpload.name,
      fileToUpload.type,
      fileToUpload.size
    )
    setIsUploading(true)
    setUploadProgress(0)

    const formDataToSend = new FormData()
    formDataToSend.append("file", fileToUpload)
    if (userId) {
      formDataToSend.append("userId", userId)
    }

    try {
      // Simulate progress for file upload and processing
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const baseUrl = getApiBaseUrl()
      const response = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        body: formDataToSend,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Upload failed:", response.status, errorText)
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setExtractedText(data.text)
      setUploadProgress(100)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Generate a cache key based on content and selected formats
  const generateCacheKey = (content, formats) => {
    const sortedFormats = [...formats].sort()
    return `${content.substring(0, 100)}_${sortedFormats.join("_")}`
  }

  const handleGenerate = async (previewDataFromStep = null) => {
    console.log("handleGenerate called with:", previewDataFromStep)
    const data = previewDataFromStep || previewData
    console.log("Using data:", data)
    console.log("extractedText:", extractedText)

    if (
      !extractedText ||
      !data ||
      !data.selectedFormats ||
      data.selectedFormats.length === 0
    ) {
      console.log("Early return - missing data")
      return
    }

    const cacheKey = generateCacheKey(extractedText, data.selectedFormats)

    // Check if we have cached content for this combination
    if (contentCache[cacheKey]) {
      console.log("Using cached content for:", cacheKey)
      setGeneratedContent(contentCache[cacheKey])
      setLastGeneratedKey(cacheKey)
      setIsFromCache(true)
      setStep(4)
      return
    }

    // Immediately go to results page with loading state
    setStep(4)
    setIsGenerating(true)

    try {
      const baseUrl = getApiBaseUrl()
      console.log("Making fetch request to:", `${baseUrl}/generate`)
      const requestBody = {
        content: extractedText,
        formats: data.selectedFormats,
        insights: data.insights,
        userContext: formData,
        userId: userId,
        prompt: `You are an expert content creator and career coach. Your task is to generate ${data.selectedFormats.join(
          ", "
        )} content that incorporates the user's key insights while maintaining their authentic tone of voice.

CONTENT GENERATION GUIDELINES:
1. Use the provided key insights as the foundation for your content
2. Analyze the original content to capture the user's authentic tone, style, and voice
3. Create engaging, actionable content that reflects their personality and communication style
4. Ensure the content feels personal and authentic to the user's voice
5. Make the content actionable and valuable for their audience
6. Generate ONE piece of content per format (not multiple posts)

KEY INSIGHTS TO INCORPORATE:
${data.insights}

ORIGINAL CONTENT (for tone analysis):
${extractedText}

FORMATS TO GENERATE:
${data.selectedFormats
  .map((format) => {
    switch (format) {
      case "linkedin":
        return "LinkedIn Post: Generate ONE professional, concise post (100-200 words) with clear value proposition, relevant hashtags, and call-to-action"
      case "blog":
        return "Blog Post: Generate ONE in-depth, storytelling piece (500-800 words) with actionable takeaways and educational value"
      case "newsletter":
        return "Newsletter: Generate ONE personal, conversational email with exclusive insights and relationship-building content"
      default:
        return format
    }
  })
  .join("\n")}

IMPORTANT: 
- Generate ONLY ONE piece of content per format (not multiple posts)
- Maintain the user's authentic voice and tone from their original content
- Incorporate the key insights naturally into the content
- Make each piece feel personal and genuine
- Ensure the content provides real value to the audience
- Keep the user's unique perspective and personality intact

Generate the content in the requested formats.`,
      }
      console.log("Request body:", requestBody)

      const response = await fetch(`${baseUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) throw new Error("Generation failed")

      const responseData = await response.json()

      // Cache the generated content
      setContentCache((prev) => ({
        ...prev,
        [cacheKey]: responseData.content,
      }))
      setLastGeneratedKey(cacheKey)
      setGeneratedContent(responseData.content)
      setIsFromCache(false)
    } catch (error) {
      console.error("Generation error:", error)
      alert("Content generation failed. Please try again.")
      // Go back to preview step on error
      setStep(3)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartOver = () => {
    setStep(1)
    setFormData({
      name: "",
      email: "",
      company: "",
      isCareerCoach: "",
      coachingNiche: "",
      profession: "",
      goals: "",
      emailContact: "Yes",
      betaWaitlistConsent: "No",
    })
    setFile(null)
    setExtractedText("")
    setGeneratedContent({})
    setSelectedFormats([])
    setUserId(null)
    setContentCache({})
    setLastGeneratedKey("")
    setIsFromCache(false)
    setPreviewData(null)
  }

  const handleUploadAnother = () => {
    setStep(2)
    setFile(null)
    setExtractedText("")
    setGeneratedContent({})
    setSelectedFormats([])
    // Keep userId and cache for session tracking
    // Cache persists for the same user session
  }

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1>🚀 Aluma Demo</h1>
        <p>Explore one of Aluma's content workflows you could set up</p>
      </div>

      <div className="demo-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
        <div className="progress-steps">
          <div
            className={`step ${step >= 1 ? "active" : ""} ${
              step > 1 ? "completed" : ""
            }`}
          >
            1. Setup
          </div>
          <div
            className={`step ${step >= 2 ? "active" : ""} ${
              step > 2 ? "completed" : ""
            }`}
          >
            2. Upload
          </div>
          <div
            className={`step ${step >= 3 ? "active" : ""} ${
              step > 3 ? "completed" : ""
            }`}
          >
            3. Preview
          </div>
          <div className={`step ${step >= 4 ? "active" : ""}`}>4. Results</div>
        </div>
      </div>

      {step === 1 && (
        <Onboarding
          formData={formData}
          handleInputChange={handleInputChange}
          onNext={() => setStep(2)}
          setUserId={setUserId}
        />
      )}

      {step === 2 && (
        <FileUpload
          file={file}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          extractedText={extractedText}
          setExtractedText={setExtractedText}
          userId={userId}
        />
      )}

      {step === 3 && (
        <Preview
          extractedText={extractedText}
          onNext={(data) => {
            console.log("Preview data received:", data)
            // Store the preview data and trigger generation
            setPreviewData(data)
            handleGenerate(data)
          }}
          onBack={() => setStep(2)}
          userId={userId}
        />
      )}

      {step === 4 && (
        <Results
          generatedContent={generatedContent}
          onStartOver={handleStartOver}
          onUploadAnother={handleUploadAnother}
          onBack={() => setStep(3)}
          isGenerating={isGenerating}
          isFromCache={isFromCache}
          formData={formData}
        />
      )}
    </div>
  )
}

export default Demo
