import React, { useState } from "react"

function App() {
  const [currentStep, setCurrentStep] = useState(0) // Start with onboarding
  const [inputMethod, setInputMethod] = useState("text")
  const [inputContent, setInputContent] = useState("")

  // Onboarding form state
  const [onboardingData, setOnboardingData] = useState({
    name: "",
    email: "",
    businessName: "",
    isCareerCoach: "",
    coachingExpertise: "",
    otherExpertise: "",
    profession: "",
    yearsOfExperience: "",
    consent: true,
    additionalContext: "",
  })
  const [onboardingErrors, setOnboardingErrors] = useState({})
  const [selectedFormats, setSelectedFormats] = useState({
    linkedin: true,
    newsletter: true,
    summary: false,
    clientFollowUp: true,
  })
  const [generatedContent, setGeneratedContent] = useState({})
  const [uploadLoading, setUploadLoading] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [selectedContent, setSelectedContent] = useState("")

  // Generation progress tracking
  const [generationProgress, setGenerationProgress] = useState({})
  const [completedFormats, setCompletedFormats] = useState({})

  // Cache for generated content to avoid re-generation
  const [contentCache, setContentCache] = useState({})

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioChunks, setAudioChunks] = useState([])

  const steps = [
    {
      id: 0,
      title: "Welcome",
      description: "Tell us about yourself",
    },
    {
      id: 1,
      title: "Input Content",
      description: "Upload or enter your content",
    },
    { id: 2, title: "Select Formats", description: "Choose output formats" },
    { id: 3, title: "Generated Content", description: "View your results" },
  ]

  const handleFormatToggle = (format) => {
    setSelectedFormats((prev) => ({
      ...prev,
      [format]: !prev[format],
    }))
  }

  const handleFileUpload = async (file) => {
    setUploadLoading(true)
    setError("")
    setInputContent("")
    setUploadProgress(0)

    // Clear cache when new file is uploaded
    setContentCache({})
    setGeneratedContent({})
    setCompletedFormats({})
    setGenerationProgress({})

    const form = new FormData()
    form.append("file", file)

    // Get user ID for session tracking
    const userId = localStorage.getItem("alumaUserId")
    if (userId) {
      form.append("userId", userId)
    }

    try {
      console.log("Uploading file:", file.name, file.type)

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 500)

      const res = await fetch(import.meta.env.VITE_API_BASE_URL, {
        method: "POST",
        body: form,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await res.json()
      console.log("Upload response:", data)

      if (!res.ok) throw new Error(data?.error || "Upload failed")

      if (data.text) {
        setInputContent(data.text)
        console.log("Content set:", data.text.substring(0, 100) + "...")
      } else {
        setError("No text content extracted from file")
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError(err.message)
    } finally {
      setUploadLoading(false)
      setUploadProgress(0)
    }
  }

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        setAudioChunks(chunks)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      setAudioChunks([])

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      recorder.onstop = () => {
        clearInterval(timer)
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        setAudioChunks(chunks)
        stream.getTracks().forEach((track) => track.stop())
      }
    } catch (err) {
      console.error("Error starting recording:", err)
      setError("Could not access microphone. Please check permissions.")
    }
  }

  const pauseRecording = () => {
    if (mediaRecorder && isRecording && !isPaused) {
      mediaRecorder.pause()
      setIsPaused(true)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorder && isRecording && isPaused) {
      mediaRecorder.resume()
      setIsPaused(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  const handleAudioUpload = async () => {
    if (!audioBlob) {
      setError("No audio recorded. Please record some audio first.")
      return
    }

    setUploadLoading(true)
    setError("")
    setInputContent("")
    setUploadProgress(0)

    // Clear cache when new audio is uploaded
    setContentCache({})
    setGeneratedContent({})
    setCompletedFormats({})
    setGenerationProgress({})

    try {
      const form = new FormData()
      form.append("file", audioBlob, "recording.wav")

      // Get user ID for session tracking
      const userId = localStorage.getItem("alumaUserId")
      if (userId) {
        form.append("userId", userId)
      }

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 500)

      const res = await fetch(import.meta.env.VITE_API_BASE_URL, {
        method: "POST",
        body: form,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await res.json()

      if (!res.ok) throw new Error(data?.error || "Upload failed")

      if (data.text) {
        setInputContent(data.text)
      } else {
        setError("No text content extracted from audio")
      }
    } catch (err) {
      console.error("Audio upload error:", err)
      setError(err.message)
    } finally {
      setUploadLoading(false)
      setUploadProgress(0)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const handleGenerate = async () => {
    if (!inputContent.trim()) {
      setError("Please provide some content first.")
      return
    }

    const activeFormats = Object.keys(selectedFormats).filter(
      (key) => selectedFormats[key]
    )
    if (activeFormats.length === 0) {
      setError("Please select at least one output format.")
      return
    }

    // Check if we have cached content for the current input and formats
    const cacheKey = `${inputContent.trim()}-${activeFormats.sort().join(",")}`
    const cachedContent = contentCache[cacheKey]

    if (cachedContent) {
      // Use cached content - no need to regenerate
      setGeneratedContent(cachedContent)
      setCompletedFormats(
        Object.keys(cachedContent).reduce((acc, format) => {
          acc[format] = true
          return acc
        }, {})
      )
      setGenerationProgress(
        Object.keys(cachedContent).reduce((acc, format) => {
          acc[format] = { status: "completed", progress: 100 }
          return acc
        }, {})
      )

      // Select the first format
      if (Object.keys(cachedContent).length > 0) {
        setSelectedContent(Object.keys(cachedContent)[0])
      }

      setCurrentStep(3)
      return
    }

    // Reset states and go to loading screen immediately
    setGenerateLoading(true)
    setError("")
    setGeneratedContent({})
    setCompletedFormats({})
    setCurrentStep(3) // Go to loading screen immediately

    // Initialize progress tracking
    const initialProgress = {}
    activeFormats.forEach((format) => {
      initialProgress[format] = { status: "waiting", progress: 0 }
    })
    setGenerationProgress(initialProgress)

    // Select the first format to show loading
    if (activeFormats.length > 0) {
      setSelectedContent(activeFormats[0])
    }

    try {
      // Generate content for each format progressively
      const newGeneratedContent = {}

      for (let i = 0; i < activeFormats.length; i++) {
        const format = activeFormats[i]

        // Update status to generating
        setGenerationProgress((prev) => ({
          ...prev,
          [format]: { status: "generating", progress: 0 },
        }))

        // Simulate progress during generation
        const progressInterval = setInterval(() => {
          setGenerationProgress((prev) => ({
            ...prev,
            [format]: {
              status: "generating",
              progress: Math.min(
                prev[format]?.progress + Math.random() * 20,
                90
              ),
            },
          }))
        }, 500)

        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL.replace(
              "/upload",
              ""
            )}/generate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: inputContent,
                formats: [format], // Generate one format at a time
                userContext: onboardingData,
                userEmail: onboardingData.email, // For Supabase user lookup
              }),
            }
          )

          clearInterval(progressInterval)
          const data = await res.json()

          if (!res.ok) throw new Error(data?.error || "Generation failed")

          // Update with completed content
          newGeneratedContent[format] = data.content[format]

          setGeneratedContent((prev) => ({
            ...prev,
            [format]: data.content[format],
          }))

          setGenerationProgress((prev) => ({
            ...prev,
            [format]: { status: "completed", progress: 100 },
          }))

          setCompletedFormats((prev) => ({
            ...prev,
            [format]: true,
          }))

          // Set first completed format as selected
          if (i === 0) {
            setSelectedContent(format)
          }
        } catch (formatError) {
          clearInterval(progressInterval)
          setGenerationProgress((prev) => ({
            ...prev,
            [format]: { status: "error", progress: 0 },
          }))
          console.error(`Error generating ${format}:`, formatError)
        }
      }

      // Cache the generated content
      setContentCache((prev) => ({
        ...prev,
        [cacheKey]: newGeneratedContent,
      }))
    } catch (err) {
      console.error("Generation error:", err)
      setError(err.message)
    } finally {
      setGenerateLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return inputContent.trim().length > 0
      case 2:
        return Object.values(selectedFormats).some(Boolean)
      default:
        return false
    }
  }

  // Clear cache when input content changes
  const handleInputContentChange = (newContent) => {
    setInputContent(newContent)
    // Clear cache when input changes to ensure fresh content generation
    setContentCache({})
    setGeneratedContent({})
    setCompletedFormats({})
    setGenerationProgress({})
  }

  // Onboarding form validation
  const validateOnboarding = () => {
    const errors = {}

    if (!onboardingData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!onboardingData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(onboardingData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!onboardingData.isCareerCoach) {
      errors.isCareerCoach = "Please select whether you are a career coach"
    }

    if (
      onboardingData.coachingExpertise === "other" &&
      !onboardingData.otherExpertise.trim()
    ) {
      errors.otherExpertise = "Please specify your coaching expertise"
    }

    if (
      onboardingData.isCareerCoach === "No" &&
      !onboardingData.profession.trim()
    ) {
      errors.profession = "Please specify your profession or expertise"
    }

    setOnboardingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleOnboardingSubmit = async () => {
    if (validateOnboarding()) {
      try {
        // Save user data to Supabase for AI personalization and analytics
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL.replace(
            "/upload",
            ""
          )}/onboarding`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(onboardingData),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || "Failed to save user data")
        }

        // Store the user ID for session tracking
        localStorage.setItem("alumaUserId", data.userId)

        setCurrentStep(1)
      } catch (error) {
        console.error("Failed to save onboarding data:", error)
        // Continue to demo even if saving fails
        setCurrentStep(1)
      }
    }
  }

  const handleOnboardingChange = (field, value) => {
    setOnboardingData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      }

      // Clear coaching-related fields when switching to "No"
      if (field === "isCareerCoach") {
        if (value === "No") {
          newData.coachingExpertise = ""
          newData.otherExpertise = ""
        } else if (value === "Yes") {
          newData.profession = ""
        }
      }

      return newData
    })

    // Clear error when user starts typing
    if (onboardingErrors[field]) {
      setOnboardingErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const getContentTitle = (format) => {
    switch (format) {
      case "linkedin":
        return "LinkedIn Post"
      case "newsletter":
        return "Newsletter"
      case "summary":
        return "Summary/Synthesis"
      case "clientFollowUp":
        return "Client Follow-up"
      default:
        return format
    }
  }

  const getContentIcon = (format) => {
    switch (format) {
      case "linkedin":
        return "💼"
      case "newsletter":
        return "📧"
      case "summary":
        return "📋"
      case "clientFollowUp":
        return "🤝"
      default:
        return "📄"
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "20px 0",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#7c3aed",
                margin: 0,
                fontFamily: "'Pacifico', cursive",
              }}
            >
              Aluma
            </h1>
          </div>

          {/* Step Progress */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor:
                        currentStep >= step.id ? "#7c3aed" : "#e2e8f0",
                      color: currentStep >= step.id ? "white" : "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {currentStep > step.id ? "✓" : step.id}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: currentStep >= step.id ? "#1e293b" : "#64748b",
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: "2px",
                      backgroundColor:
                        currentStep > step.id ? "#7c3aed" : "#e2e8f0",
                      margin: "0 16px",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Back Button */}
        {currentStep > 0 && currentStep !== 1 && (
          <div
            style={{
              marginBottom: "24px",
            }}
          >
            <button
              onClick={handleBack}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: "white",
                color: "#374151",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              ← Back
            </button>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              color: "#dc2626",
            }}
          >
            {error}
          </div>
        )}

        {/* Step 0: Onboarding */}
        {currentStep === 0 && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#1e293b",
                  marginBottom: "8px",
                }}
              >
                Welcome to Aluma Demo
              </h1>
              <p style={{ color: "#64748b", fontSize: "16px" }}>
                Let's get to know you better to personalize your experience
              </p>
            </div>

            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              {/* Name */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Name <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  value={onboardingData.name}
                  onChange={(e) =>
                    handleOnboardingChange("name", e.target.value)
                  }
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: onboardingErrors.name
                      ? "2px solid #dc2626"
                      : "2px solid #e2e8f0",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
                {onboardingErrors.name && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {onboardingErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Email <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="email"
                  value={onboardingData.email}
                  onChange={(e) =>
                    handleOnboardingChange("email", e.target.value)
                  }
                  placeholder="Enter your email address"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: onboardingErrors.email
                      ? "2px solid #dc2626"
                      : "2px solid #e2e8f0",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
                {onboardingErrors.email && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {onboardingErrors.email}
                  </p>
                )}
              </div>

              {/* Business Name */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Business Name
                </label>
                <input
                  type="text"
                  value={onboardingData.businessName}
                  onChange={(e) =>
                    handleOnboardingChange("businessName", e.target.value)
                  }
                  placeholder="Enter your business or organization name"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Are you a career coach? */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "12px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Are you a career coach?{" "}
                  <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ display: "flex", gap: "16px" }}>
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="isCareerCoach"
                        value={option}
                        checked={onboardingData.isCareerCoach === option}
                        onChange={(e) =>
                          handleOnboardingChange(
                            "isCareerCoach",
                            e.target.value
                          )
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {onboardingErrors.isCareerCoach && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {onboardingErrors.isCareerCoach}
                  </p>
                )}
              </div>

              {/* Coaching Expertise (only for career coaches) */}
              {onboardingData.isCareerCoach === "Yes" && (
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Coaching Expertise / Niche
                  </label>
                  <select
                    value={onboardingData.coachingExpertise}
                    onChange={(e) =>
                      handleOnboardingChange(
                        "coachingExpertise",
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "2px solid #e2e8f0",
                      fontSize: "16px",
                      outline: "none",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="">Select your expertise</option>
                    <option value="Early Career">Early Career</option>
                    <option value="Executive">Executive</option>
                    <option value="Transition">Transition</option>
                    <option value="Resume">Resume</option>
                    <option value="Interview">Interview</option>
                    <option value="other">Other</option>
                  </select>

                  {onboardingData.coachingExpertise === "other" && (
                    <div style={{ marginTop: "12px" }}>
                      <input
                        type="text"
                        value={onboardingData.otherExpertise}
                        onChange={(e) =>
                          handleOnboardingChange(
                            "otherExpertise",
                            e.target.value
                          )
                        }
                        placeholder="Please specify your coaching expertise"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: onboardingErrors.otherExpertise
                            ? "2px solid #dc2626"
                            : "2px solid #e2e8f0",
                          fontSize: "16px",
                          outline: "none",
                        }}
                      />
                      {onboardingErrors.otherExpertise && (
                        <p
                          style={{
                            color: "#dc2626",
                            fontSize: "14px",
                            marginTop: "4px",
                          }}
                        >
                          {onboardingErrors.otherExpertise}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Profession (for non-career coaches) */}
              {onboardingData.isCareerCoach === "No" && (
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Profession / Expertise
                  </label>
                  <input
                    type="text"
                    value={onboardingData.profession}
                    onChange={(e) =>
                      handleOnboardingChange("profession", e.target.value)
                    }
                    placeholder="What's your profession or area of expertise?"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: onboardingErrors.profession
                        ? "2px solid #dc2626"
                        : "2px solid #e2e8f0",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                  {onboardingErrors.profession && (
                    <p
                      style={{
                        color: "#dc2626",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    >
                      {onboardingErrors.profession}
                    </p>
                  )}
                </div>
              )}

              {/* Years of Experience */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={onboardingData.yearsOfExperience}
                  onChange={(e) =>
                    handleOnboardingChange("yearsOfExperience", e.target.value)
                  }
                  placeholder="Enter years of experience"
                  min="0"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Consent Checkbox */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={onboardingData.consent}
                    onChange={(e) =>
                      handleOnboardingChange("consent", e.target.checked)
                    }
                    style={{ marginTop: "2px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    I consent to receive follow-up emails about Aluma and
                    related content
                  </span>
                </label>
              </div>

              {/* Additional Context */}
              <div style={{ marginBottom: "32px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Any other context or things you're curious about Aluma can
                  help you with
                </label>
                <textarea
                  value={onboardingData.additionalContext}
                  onChange={(e) =>
                    handleOnboardingChange("additionalContext", e.target.value)
                  }
                  placeholder="Tell us more about your needs, challenges, or what you'd like to explore..."
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleOnboardingSubmit}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                🚀 Start Demo
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Input Content */}
        {currentStep === 1 && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "24px",
              }}
            >
              Input Your Content
            </h2>

            {/* Input Method Tabs */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              {[
                { id: "text", label: "Text Input", icon: "✏️" },
                { id: "file", label: "File Upload", icon: "📁" },
                { id: "audio", label: "Audio Recording", icon: "🎤" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setInputMethod(method.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor:
                      inputMethod === method.id ? "#f1f5f9" : "transparent",
                    color: inputMethod === method.id ? "#7c3aed" : "#64748b",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{method.icon}</span>
                  {method.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            {inputMethod === "text" && (
              <textarea
                value={inputContent}
                onChange={(e) => handleInputContentChange(e.target.value)}
                placeholder="Paste your blog post, session notes, or any long-form content here..."
                style={{
                  width: "100%",
                  minHeight: "300px",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            )}

            {inputMethod === "file" && (
              <div>
                <div
                  style={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: "12px",
                    padding: "40px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*,audio/*,video/*,.txt,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) handleFileUpload(file)
                    }}
                    style={{ display: "none" }}
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    style={{
                      cursor: uploadLoading ? "not-allowed" : "pointer",
                      color: uploadLoading ? "#94a3b8" : "#7c3aed",
                      fontWeight: "500",
                    }}
                  >
                    {uploadLoading
                      ? "⏳ Processing..."
                      : "📁 Click to upload a file"}
                  </label>
                  <p style={{ color: "#64748b", marginTop: "8px" }}>
                    Supports images, audio, video, and document files (PDF, DOC,
                    DOCX, TXT)
                  </p>

                  {/* Progress Bar */}
                  {uploadLoading && (
                    <div style={{ marginTop: "16px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          backgroundColor: "#e2e8f0",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${uploadProgress}%`,
                            height: "100%",
                            backgroundColor: "#7c3aed",
                            borderRadius: "4px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          marginTop: "4px",
                          textAlign: "center",
                        }}
                      >
                        {uploadProgress < 100
                          ? "Processing file..."
                          : "Complete!"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Show processed content */}
                {inputContent && (
                  <div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        marginBottom: "12px",
                      }}
                    >
                      📄 Extracted Content
                    </h3>
                    <textarea
                      value={inputContent}
                      onChange={(e) => handleInputContentChange(e.target.value)}
                      placeholder="Content will appear here after file processing..."
                      style={{
                        width: "100%",
                        minHeight: "200px",
                        padding: "16px",
                        borderRadius: "12px",
                        border: "2px solid #e2e8f0",
                        fontSize: "16px",
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        backgroundColor: "#f8fafc",
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {inputMethod === "audio" && (
              <div>
                <div
                  style={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: "12px",
                    padding: "40px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  {!isRecording && !audioBlob && (
                    <div>
                      <div
                        style={{
                          fontSize: "48px",
                          marginBottom: "16px",
                        }}
                      >
                        🎤
                      </div>
                      <button
                        onClick={startRecording}
                        style={{
                          padding: "16px 32px",
                          borderRadius: "12px",
                          border: "none",
                          backgroundColor: "#7c3aed",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          margin: "0 auto",
                        }}
                      >
                        🎙️ Start Recording
                      </button>
                      <p style={{ color: "#64748b", marginTop: "16px" }}>
                        Record your speech, brainstorming session, or braindump
                      </p>
                    </div>
                  )}

                  {isRecording && (
                    <div>
                      <div
                        style={{
                          fontSize: "48px",
                          marginBottom: "16px",
                          animation: isPaused ? "none" : "pulse 1s infinite",
                        }}
                      >
                        {isPaused ? "⏸️" : "🔴"}
                      </div>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "600",
                          color: isPaused ? "#f59e0b" : "#dc2626",
                          marginBottom: "16px",
                        }}
                      >
                        {isPaused ? "Paused" : "Recording"}...{" "}
                        {formatTime(recordingTime)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          justifyContent: "center",
                        }}
                      >
                        {!isPaused ? (
                          <button
                            onClick={pauseRecording}
                            style={{
                              padding: "12px 24px",
                              borderRadius: "8px",
                              border: "none",
                              backgroundColor: "#f59e0b",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            ⏸️ Pause
                          </button>
                        ) : (
                          <button
                            onClick={resumeRecording}
                            style={{
                              padding: "12px 24px",
                              borderRadius: "8px",
                              border: "none",
                              backgroundColor: "#059669",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            ▶️ Continue
                          </button>
                        )}
                        <button
                          onClick={stopRecording}
                          style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#dc2626",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          ⏹️ Stop
                        </button>
                      </div>
                    </div>
                  )}

                  {audioBlob && !isRecording && (
                    <div>
                      <div
                        style={{
                          fontSize: "48px",
                          marginBottom: "16px",
                        }}
                      >
                        ✅
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#059669",
                          marginBottom: "16px",
                        }}
                      >
                        Recording Complete! ({formatTime(recordingTime)})
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={handleAudioUpload}
                          disabled={uploadLoading}
                          style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: uploadLoading
                              ? "#374151"
                              : "#7c3aed",
                            color: "white",
                            cursor: uploadLoading ? "not-allowed" : "pointer",
                            fontSize: "14px",
                            fontWeight: "600",
                            opacity: uploadLoading ? 0.7 : 1,
                          }}
                        >
                          {uploadLoading
                            ? "⏳ Transcribing..."
                            : "🎵 Transcribe Audio"}
                        </button>
                        <button
                          onClick={() => {
                            setAudioBlob(null)
                            setRecordingTime(0)
                            setAudioChunks([])
                          }}
                          style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            backgroundColor: "white",
                            color: "#374151",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          🎤 New Recording
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar for Audio Transcription */}
                  {uploadLoading && (
                    <div style={{ marginTop: "16px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          backgroundColor: "#e2e8f0",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${uploadProgress}%`,
                            height: "100%",
                            backgroundColor: "#7c3aed",
                            borderRadius: "4px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          marginTop: "4px",
                          textAlign: "center",
                        }}
                      >
                        {uploadProgress < 100
                          ? "Transcribing audio..."
                          : "Complete!"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Show transcribed content */}
                {inputContent && (
                  <div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        marginBottom: "12px",
                      }}
                    >
                      📄 Transcribed Content
                    </h3>
                    <textarea
                      value={inputContent}
                      onChange={(e) => handleInputContentChange(e.target.value)}
                      placeholder="Transcribed content will appear here..."
                      style={{
                        width: "100%",
                        minHeight: "200px",
                        padding: "16px",
                        borderRadius: "12px",
                        border: "2px solid #e2e8f0",
                        fontSize: "16px",
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        backgroundColor: "#f8fafc",
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Continue Button for Step 1 */}
            {currentStep === 1 && (
              <div
                style={{
                  marginTop: "32px",
                }}
              >
                <button
                  onClick={handleNext}
                  disabled={inputContent.trim().length === 0}
                  style={{
                    width: "100%",
                    padding: "16px 24px",
                    borderRadius: "12px",
                    border: "none",
                    background:
                      inputContent.trim().length > 0
                        ? "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)"
                        : "#374151",
                    color: "white",
                    cursor:
                      inputContent.trim().length > 0
                        ? "pointer"
                        : "not-allowed",
                    fontSize: "16px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: inputContent.trim().length > 0 ? 1 : 0.7,
                  }}
                >
                  ⭐ Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Output Formats */}
        {currentStep === 2 && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              Select Output Formats
            </h2>
            <p
              style={{
                color: "#64748b",
                marginBottom: "24px",
              }}
            >
              Choose which formats you'd like to generate from your content
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              {[
                {
                  id: "linkedin",
                  title: "LinkedIn Post",
                  description:
                    "Engaging, professional social media content optimized for LinkedIn's algorithm",
                  icon: "💼",
                },
                {
                  id: "newsletter",
                  title: "Newsletter",
                  description:
                    "Ready-to-send email newsletter with compelling subject line and call-to-action",
                  icon: "📧",
                },
                {
                  id: "summary",
                  title: "Summary/Synthesis",
                  description:
                    "Concise key takeaways and actionable insights from your content",
                  icon: "📋",
                },
                {
                  id: "clientFollowUp",
                  title: "Client Follow-up",
                  description:
                    "Personalized email template for client communication and reflection",
                  icon: "🤝",
                },
              ].map((format) => (
                <div
                  key={format.id}
                  onClick={() => handleFormatToggle(format.id)}
                  style={{
                    padding: "20px",
                    borderRadius: "12px",
                    border: `2px solid ${
                      selectedFormats[format.id] ? "#7c3aed" : "#e2e8f0"
                    }`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: selectedFormats[format.id]
                      ? "#f8f7ff"
                      : "white",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: selectedFormats[format.id]
                          ? "#7c3aed"
                          : "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                        fontSize: "12px",
                        color: "white",
                      }}
                    >
                      {selectedFormats[format.id] ? "✓" : ""}
                    </div>
                    <span style={{ fontSize: "18px", marginRight: "8px" }}>
                      {format.icon}
                    </span>
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        fontSize: "16px",
                      }}
                    >
                      {format.title}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      margin: 0,
                      lineHeight: "1.5",
                    }}
                  >
                    {format.description}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={
                generateLoading || !Object.values(selectedFormats).some(Boolean)
              }
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: "12px",
                border: "none",
                background:
                  generateLoading ||
                  !Object.values(selectedFormats).some(Boolean)
                    ? "#374151"
                    : "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                cursor:
                  generateLoading ||
                  !Object.values(selectedFormats).some(Boolean)
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  generateLoading ||
                  !Object.values(selectedFormats).some(Boolean)
                    ? 0.7
                    : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {generateLoading ? "Generating..." : "⭐ Generate Content"}
            </button>
          </div>
        )}

        {/* Step 3: Generated Content */}
        {currentStep === 3 && (
          <div
            style={{
              display: "flex",
              gap: "24px",
              minHeight: "600px",
            }}
          >
            {/* Sidebar */}
            <div
              style={{
                width: "280px",
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                height: "fit-content",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "16px",
                }}
              >
                Generated Content
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {/* Show all selected formats with their progress */}
                {Object.keys(selectedFormats)
                  .filter((key) => selectedFormats[key])
                  .map((format) => {
                    const progress = generationProgress[format]
                    const isCompleted = completedFormats[format]
                    const isGenerating = progress?.status === "generating"
                    const isWaiting = progress?.status === "waiting"
                    const hasError = progress?.status === "error"

                    return (
                      <div key={format} style={{ marginBottom: "4px" }}>
                        <button
                          onClick={() =>
                            isCompleted && setSelectedContent(format)
                          }
                          disabled={!isCompleted}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            border: "none",
                            width: "100%",
                            backgroundColor:
                              selectedContent === format && isCompleted
                                ? "#f1f5f9"
                                : "transparent",
                            color: isCompleted
                              ? selectedContent === format
                                ? "#7c3aed"
                                : "#374151"
                              : "#9ca3af",
                            cursor: isCompleted ? "pointer" : "not-allowed",
                            fontSize: "14px",
                            fontWeight: "500",
                            textAlign: "left",
                            transition: "all 0.2s",
                            opacity: isCompleted ? 1 : 0.7,
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>
                            {hasError
                              ? "❌"
                              : isCompleted
                              ? getContentIcon(format)
                              : isGenerating
                              ? "⏳"
                              : "⏳"}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div>{getContentTitle(format)}</div>
                            {(isGenerating || isWaiting) && (
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#64748b",
                                  marginTop: "2px",
                                }}
                              >
                                {isWaiting
                                  ? "Waiting..."
                                  : `Generating... ${Math.round(
                                      progress?.progress || 0
                                    )}%`}
                              </div>
                            )}
                            {hasError && (
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#dc2626",
                                  marginTop: "2px",
                                }}
                              >
                                Generation failed
                              </div>
                            )}
                          </div>
                          {isCompleted && (
                            <span
                              style={{ fontSize: "12px", color: "#059669" }}
                            >
                              ✓
                            </span>
                          )}
                        </button>

                        {/* Progress bar for generating content */}
                        {isGenerating && (
                          <div
                            style={{
                              width: "100%",
                              height: "3px",
                              backgroundColor: "#e2e8f0",
                              borderRadius: "2px",
                              overflow: "hidden",
                              marginTop: "4px",
                              marginLeft: "16px",
                              marginRight: "16px",
                              width: "calc(100% - 32px)",
                            }}
                          >
                            <div
                              style={{
                                width: `${progress?.progress || 0}%`,
                                height: "100%",
                                backgroundColor: "#7c3aed",
                                borderRadius: "2px",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Content Display */}
            <div
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {selectedContent ? (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "24px",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>
                      {generatedContent[selectedContent]
                        ? getContentIcon(selectedContent)
                        : generationProgress[selectedContent]?.status ===
                          "error"
                        ? "❌"
                        : "⏳"}
                    </span>
                    <h2
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        margin: 0,
                      }}
                    >
                      {getContentTitle(selectedContent)}
                    </h2>
                  </div>

                  {generatedContent[selectedContent] ? (
                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        padding: "24px",
                        borderRadius: "12px",
                        whiteSpace: "pre-wrap",
                        fontSize: "16px",
                        lineHeight: "1.6",
                        color: "#374151",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      {generatedContent[selectedContent]}
                    </div>
                  ) : generationProgress[selectedContent]?.status ===
                    "error" ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: "#dc2626",
                        backgroundColor: "#fef2f2",
                        borderRadius: "12px",
                        border: "1px solid #fecaca",
                      }}
                    >
                      <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                        ❌
                      </div>
                      <p
                        style={{
                          fontSize: "18px",
                          marginBottom: "8px",
                          color: "#dc2626",
                        }}
                      >
                        Generation Failed
                      </p>
                      <p style={{ fontSize: "14px", color: "#991b1b" }}>
                        There was an error generating this content. Please try
                        again.
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: "#64748b",
                        backgroundColor: "#f8fafc",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "48px",
                          marginBottom: "16px",
                          animation: "pulse 2s infinite",
                        }}
                      >
                        ⏳
                      </div>
                      <p
                        style={{
                          fontSize: "18px",
                          marginBottom: "8px",
                          color: "#475569",
                        }}
                      >
                        {generationProgress[selectedContent]?.status ===
                        "waiting"
                          ? "Waiting to generate..."
                          : "Generating content..."}
                      </p>
                      <p style={{ fontSize: "14px" }}>
                        {generationProgress[selectedContent]?.status ===
                        "generating"
                          ? `Progress: ${Math.round(
                              generationProgress[selectedContent]?.progress || 0
                            )}%`
                          : "Please wait while we create your content"}
                      </p>

                      {/* Progress bar */}
                      {generationProgress[selectedContent]?.status ===
                        "generating" && (
                        <div
                          style={{
                            width: "200px",
                            height: "8px",
                            backgroundColor: "#e2e8f0",
                            borderRadius: "4px",
                            overflow: "hidden",
                            margin: "16px auto 0",
                          }}
                        >
                          <div
                            style={{
                              width: `${
                                generationProgress[selectedContent]?.progress ||
                                0
                              }%`,
                              height: "100%",
                              backgroundColor: "#7c3aed",
                              borderRadius: "4px",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#64748b",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    ⭐
                  </div>
                  <p
                    style={{
                      fontSize: "18px",
                      marginBottom: "8px",
                      color: "#475569",
                    }}
                  >
                    Select Content to View
                  </p>
                  <p style={{ fontSize: "14px" }}>
                    Choose a content type from the sidebar to view or monitor
                    progress
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
