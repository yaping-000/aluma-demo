import React, { useState, useEffect } from "react"
import "./styles.css"

// Demo component - can be extracted to a separate file
const AlumaDemo = () => {
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

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
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

  const formatOptions = [
    { value: "linkedin", label: "LinkedIn Post" },
    { value: "newsletter", label: "Email Newsletter" },
    { value: "summary", label: "Content Summary" },
    { value: "clientFollowUp", label: "Client Follow-up" },
  ]

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
        <div className="demo-step">
          <h2>Tell us about yourself</h2>
          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="company"
              placeholder="Company/Organization"
              value={formData.company}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="role"
              placeholder="Your role"
              value={formData.role}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="industry"
              placeholder="Industry"
              value={formData.industry}
              onChange={handleInputChange}
            />
            <textarea
              name="goals"
              placeholder="What are your communication goals?"
              value={formData.goals}
              onChange={handleInputChange}
            />
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!formData.name || !formData.email}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="demo-step">
          <h2>Upload your content</h2>
          <div className="upload-area">
            <input
              type="file"
              accept="image/*,audio/*,video/*"
              onChange={handleFileChange}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="file-label">
              {file ? file.name : "Choose a file (image, audio, or video)"}
            </label>
          </div>
          {file && (
            <div className="file-info">
              <p>Selected: {file.name}</p>
              <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
          <div className="button-group">
            <button onClick={() => setStep(1)}>Back</button>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="primary"
            >
              {isUploading
                ? `Uploading... ${uploadProgress}%`
                : "Upload & Process"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="demo-step">
          <h2>Choose content formats</h2>
          <div className="extracted-text">
            <h3>Extracted Content:</h3>
            <p>{extractedText}</p>
          </div>
          <div className="format-selection">
            <h3>Select formats to generate:</h3>
            <div className="format-grid">
              {formatOptions.map((format) => (
                <label key={format.value} className="format-option">
                  <input
                    type="checkbox"
                    value={format.value}
                    checked={selectedFormats.includes(format.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFormats([...selectedFormats, format.value])
                      } else {
                        setSelectedFormats(
                          selectedFormats.filter((f) => f !== format.value)
                        )
                      }
                    }}
                  />
                  {format.label}
                </label>
              ))}
            </div>
          </div>
          <div className="button-group">
            <button onClick={() => setStep(2)}>Back</button>
            <button
              onClick={handleGenerate}
              disabled={selectedFormats.length === 0 || isGenerating}
              className="primary"
            >
              {isGenerating ? "Generating..." : "Generate Content"}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="demo-step">
          <h2>Your generated content</h2>
          <div className="generated-content">
            {Object.entries(generatedContent).map(([format, content]) => (
              <div key={format} className="content-item">
                <h3>{formatOptions.find((f) => f.value === format)?.label}</h3>
                <div className="content-text">{content}</div>
                <button
                  onClick={() => navigator.clipboard.writeText(content)}
                  className="copy-btn"
                >
                  Copy to Clipboard
                </button>
              </div>
            ))}
          </div>
          <div className="button-group">
            <button onClick={() => setStep(1)}>Start Over</button>
            <button onClick={() => setStep(2)} className="primary">
              Upload Another File
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Main App component with routing
const App = () => {
  const [currentRoute, setCurrentRoute] = useState("landing")

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-brand">Aluma</div>
        <div className="nav-links">
          <button
            className={currentRoute === "landing" ? "active" : ""}
            onClick={() => setCurrentRoute("landing")}
          >
            Home
          </button>
          <button
            className={currentRoute === "demo" ? "active" : ""}
            onClick={() => setCurrentRoute("demo")}
          >
            Demo
          </button>
        </div>
      </nav>

      <main className="app-main">
        {currentRoute === "landing" && (
          <div className="landing-page">
            <div className="hero">
              <h1>Welcome to Aluma</h1>
              <p>Transform your content into professional communications</p>
              <button
                onClick={() => setCurrentRoute("demo")}
                className="cta-button"
              >
                Try the Demo
              </button>
            </div>
            <div className="features">
              <div className="feature">
                <h3>AI-Powered</h3>
                <p>Advanced AI processes your content intelligently</p>
              </div>
              <div className="feature">
                <h3>Multiple Formats</h3>
                <p>Generate LinkedIn posts, newsletters, and more</p>
              </div>
              <div className="feature">
                <h3>Professional Quality</h3>
                <p>Tailored to your industry and role</p>
              </div>
            </div>
          </div>
        )}

        {currentRoute === "demo" && <AlumaDemo />}
      </main>
    </div>
  )
}

export default App
