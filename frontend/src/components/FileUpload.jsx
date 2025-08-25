import React, { useState, useRef, useEffect } from "react"

const FileUpload = ({
  file,
  handleFileChange,
  handleUpload,
  isUploading,
  uploadProgress,
  onBack,
  onNext,
  extractedText,
  setExtractedText,
  userId,
}) => {
  const [inputMethod, setInputMethod] = useState("file") // "file", "text", "audio"
  const [textInput, setTextInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [isEditingContent, setIsEditingContent] = useState(false)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)

  // Timer for recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRecording, isPaused])

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        })
        setAudioBlob(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  // Pause/Resume recording
  const togglePause = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    } else if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  // Process audio transcription
  const processAudio = async () => {
    if (!audioBlob) return

    setIsProcessingAudio(true)
    setAudioProgress(0)

    try {
      // Simulate progress for audio processing
      const progressInterval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 300)

      const formData = new FormData()
      formData.append("file", audioBlob, "recording.wav")
      if (userId) {
        formData.append("userId", userId)
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) throw new Error("Audio processing failed")

      const data = await response.json()
      setExtractedText(data.text)
      setAudioProgress(100)
    } catch (error) {
      console.error("Audio processing error:", error)
      alert("Failed to process audio. Please try again.")
    } finally {
      setIsProcessingAudio(false)
    }
  }

  // Handle text input submission
  const handleTextSubmit = () => {
    if (textInput.trim()) {
      setExtractedText(textInput.trim())
    }
  }

  // Auto-process file when selected
  const handleFileChangeWithAutoProcess = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Check file size (100MB limit)
      const maxSize = 100 * 1024 * 1024 // 100MB
      if (selectedFile.size > maxSize) {
        alert(
          `File is too large. Maximum size is 100MB. Your file is ${(
            selectedFile.size /
            1024 /
            1024
          ).toFixed(2)}MB.`
        )
        return
      }

      // Set the file first, then start upload with the selected file
      handleFileChange(e)

      // Call handleUpload with the selected file directly
      handleUpload(selectedFile)
    }
  }

  // Check if we can continue to next step
  const canContinue = () => {
    if (extractedText && extractedText.trim().length > 0) {
      return true
    }
    if (inputMethod === "text") {
      return textInput.trim().length > 0
    }
    return false
  }

  // Handle continue button
  const handleContinue = () => {
    if (extractedText && extractedText.trim().length > 0) {
      // Continue to next step with the extracted/edited content
      onNext()
    } else if (inputMethod === "text") {
      handleTextSubmit()
      // For text input, set the text and allow user to review
    }
  }

  return (
    <div className="demo-step">
      <h2>Add your content</h2>
      <p className="step-description">
        Choose how you'd like to input your content for processing
      </p>

      {/* Input Method Selection */}
      <div className="input-method-selector">
        <div className="method-options">
          <button
            className={`method-option ${
              inputMethod === "file" ? "active" : ""
            }`}
            onClick={() => setInputMethod("file")}
          >
            📁 Upload File
          </button>
          <button
            className={`method-option ${
              inputMethod === "text" ? "active" : ""
            }`}
            onClick={() => setInputMethod("text")}
          >
            ✏️ Text Input
          </button>
          <button
            className={`method-option ${
              inputMethod === "audio" ? "active" : ""
            }`}
            onClick={() => setInputMethod("audio")}
          >
            🎤 Audio Recording
          </button>
        </div>
      </div>

      {/* File Upload Section */}
      {inputMethod === "file" && (
        <div className="input-section">
          <div className="upload-area">
            <input
              type="file"
              accept="image/*,audio/*,video/*,.txt,.pdf,.doc,.docx"
              onChange={handleFileChangeWithAutoProcess}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="file-label">
              {file
                ? file.name
                : "Choose a file (image, audio, video, or document)"}
            </label>
            <p className="upload-hint">
              Supports images, audio, video, and document files (PDF, DOC, DOCX,
              TXT). Maximum file size: 100MB.
            </p>
          </div>

          {file && !isUploading && !extractedText && (
            <div className="file-info">
              <p>
                <strong>Selected:</strong> {file.name}
              </p>
              <p>
                <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p>
                <strong>Type:</strong> {file.type}
              </p>
            </div>
          )}

          {isUploading && (
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">
                Processing file... {uploadProgress}%
              </p>
            </div>
          )}

          {!isUploading && extractedText && inputMethod === "file" && (
            <div className="success-message">
              <p>
                ✅ File processed successfully! Review the extracted content
                below.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Text Input Section */}
      {inputMethod === "text" && (
        <div className="input-section">
          <div className="text-input-container">
            <label htmlFor="text-input" className="form-label">
              Enter your content
            </label>
            <textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste or type your content here..."
              rows="8"
              className="text-input"
            />
            <p className="text-hint">
              Enter the content you'd like to transform into professional
              communications
            </p>
          </div>
        </div>
      )}

      {/* Audio Recording Section */}
      {inputMethod === "audio" && (
        <div className="input-section">
          <div className="audio-recorder">
            <div className="recorder-controls">
              {!isRecording && !audioBlob && (
                <button onClick={startRecording} className="record-btn start">
                  🎤 Start Recording
                </button>
              )}

              {isRecording && (
                <>
                  <div className="recording-info">
                    <div className="recording-indicator">
                      <span className="pulse"></span>
                      Recording: {formatTime(recordingTime)}
                    </div>
                  </div>
                  <div className="recording-controls">
                    <button onClick={togglePause} className="control-btn pause">
                      {isPaused ? "▶️ Resume" : "⏸️ Pause"}
                    </button>
                    <button
                      onClick={stopRecording}
                      className="control-btn stop"
                    >
                      ⏹️ Stop
                    </button>
                  </div>
                </>
              )}

              {audioBlob && !isProcessingAudio && (
                <div className="audio-preview">
                  <p>✅ Recording completed ({formatTime(recordingTime)})</p>
                  <audio controls src={URL.createObjectURL(audioBlob)} />
                  <button onClick={processAudio} className="process-btn">
                    🎵 Process Audio
                  </button>
                </div>
              )}

              {isProcessingAudio && (
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${audioProgress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    Transcribing audio... {audioProgress}%
                  </p>
                </div>
              )}

              {!isProcessingAudio &&
                extractedText &&
                inputMethod === "audio" && (
                  <div className="success-message">
                    <p>
                      ✅ Audio transcribed successfully! Review the extracted
                      content below.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Extracted Text Display */}
      {extractedText && (
        <div className="extracted-text">
          <div className="content-header">
            <h3>📝 Extracted Content</h3>
            <button
              onClick={() => setIsEditingContent(!isEditingContent)}
              className="edit-btn"
            >
              {isEditingContent ? "Save" : "Edit"}
            </button>
          </div>
          {isEditingContent ? (
            <div className="content-editor">
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="content-textarea"
                rows="8"
                placeholder="Edit the extracted content..."
              />
              <p className="edit-hint">
                Review and edit the extracted content before proceeding
              </p>
            </div>
          ) : (
            <div className="content-preview">
              <p>{extractedText}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="button-group">
        <button onClick={onBack}>Back</button>
        <button
          onClick={handleContinue}
          disabled={!canContinue() || isUploading || isProcessingAudio}
          className="primary"
        >
          {isUploading || isProcessingAudio
            ? "Processing..."
            : extractedText
            ? "Continue to Generate Content"
            : inputMethod === "text"
            ? "Use Text"
            : "Continue"}
        </button>
      </div>
    </div>
  )
}

export default FileUpload
