import React, { useState } from "react"
import Onboarding from "./Onboarding"
import FileUpload from "./FileUpload"
import ContentGeneration from "./ContentGeneration"
import Results from "./Results"

const Demo = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    industry: "",
    goals: "",
  })
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [extractedText, setExtractedText] = useState("")
  const [generatedContent, setGeneratedContent] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFormats, setSelectedFormats] = useState([])

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

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    const formDataToSend = new FormData()
    formDataToSend.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setExtractedText(data.text)
      setUploadProgress(100)
      setStep(3)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleGenerate = async () => {
    if (!extractedText || selectedFormats.length === 0) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: extractedText,
          formats: selectedFormats,
          userContext: formData,
        }),
      })

      if (!response.ok) throw new Error("Generation failed")

      const data = await response.json()
      setGeneratedContent(data.content)
      setStep(4)
    } catch (error) {
      console.error("Generation error:", error)
      alert("Content generation failed. Please try again.")
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
      role: "",
      industry: "",
      goals: "",
    })
    setFile(null)
    setExtractedText("")
    setGeneratedContent({})
    setSelectedFormats([])
  }

  const handleUploadAnother = () => {
    setStep(2)
    setFile(null)
    setExtractedText("")
    setGeneratedContent({})
    setSelectedFormats([])
  }

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1>🚀 Aluma Demo</h1>
        <p>Transform your content into professional communications</p>
      </div>

      <div className="demo-progress">
        <div className={`step ${step >= 1 ? "active" : ""}`}>1. Setup</div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>2. Upload</div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>3. Generate</div>
        <div className={`step ${step >= 4 ? "active" : ""}`}>4. Results</div>
      </div>

      {step === 1 && (
        <Onboarding
          formData={formData}
          handleInputChange={handleInputChange}
          onNext={() => setStep(2)}
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
        />
      )}

      {step === 3 && (
        <ContentGeneration
          extractedText={extractedText}
          selectedFormats={selectedFormats}
          setSelectedFormats={setSelectedFormats}
          handleGenerate={handleGenerate}
          isGenerating={isGenerating}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <Results
          generatedContent={generatedContent}
          onStartOver={handleStartOver}
          onUploadAnother={handleUploadAnother}
        />
      )}
    </div>
  )
}

export default Demo
