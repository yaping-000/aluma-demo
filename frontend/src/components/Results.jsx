import React, { useState } from "react"

const Results = ({
  generatedContent,
  onStartOver,
  onUploadAnother,
  onBack,
  isGenerating,
  isFromCache,
  formData,
}) => {
  const [betaConsentStatus, setBetaConsentStatus] = useState(null)
  const [isUpdatingConsent, setIsUpdatingConsent] = useState(false)
  const [copiedStates, setCopiedStates] = useState({})
  const [editableContent, setEditableContent] = useState({})
  const [editStates, setEditStates] = useState({})
  const formatLabels = {
    linkedin: "LinkedIn Post",
    newsletter: "Email Newsletter",
    summary: "Content Summary",
    clientFollowUp: "Client Follow-up",
  }

  const formatIcons = {
    linkedin: "💼",
    newsletter: "📧",
    summary: "📋",
    clientFollowUp: "🤝",
  }

  const copyToClipboard = (text, format) => {
    navigator.clipboard.writeText(text)
    // Update the copied state for this specific format
    setCopiedStates((prev) => ({ ...prev, [format]: true }))

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [format]: false }))
    }, 2000)
  }

  const startEditing = (format, content) => {
    setEditableContent((prev) => ({ ...prev, [format]: content }))
    setEditStates((prev) => ({ ...prev, [format]: true }))
  }

  const saveEdit = (format) => {
    setEditStates((prev) => ({ ...prev, [format]: false }))
    // Here you could also save the edited content to a backend if needed
  }

  const cancelEdit = (format) => {
    setEditStates((prev) => ({ ...prev, [format]: false }))
    setEditableContent((prev) => ({
      ...prev,
      [format]: generatedContent[format],
    }))
  }

  const handleContentChange = (format, newContent) => {
    setEditableContent((prev) => ({ ...prev, [format]: newContent }))
  }

  const handleBetaConsent = async (consent) => {
    if (!formData.email) {
      console.error("No email available for beta consent")
      return
    }

    setIsUpdatingConsent(true)
    try {
      const response = await fetch("http://localhost:3000/beta-consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          consent: consent,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update beta consent")
      }

      const data = await response.json()
      setBetaConsentStatus(consent ? "joined" : "declined")
      console.log("Beta consent updated:", data.message)
    } catch (error) {
      console.error("Error updating beta consent:", error)
      setBetaConsentStatus("error")
    } finally {
      setIsUpdatingConsent(false)
    }
  }

  return (
    <div className="demo-step">
      <h2>Your generated content</h2>

      {isGenerating ? (
        <div className="generation-status">
          <div className="loading-spinner"></div>
          <p>Aluma is creating your content in your authentic voice...</p>
          <p className="generation-hint">This may take a few moments</p>
        </div>
      ) : (
        <>
          {Object.keys(generatedContent).length > 0 && (
            <div className="success-message">
              <div className="success-icon">🎉</div>
              <h3>All Set! Your Content is Ready!</h3>
              <p>
                Copy it, post it, impress your audience. 😎
                {isFromCache && (
                  <span className="cache-indicator"> (Loaded from cache)</span>
                )}
              </p>

              {/* Beta Waitlist Section - Only show if user initially selected "No" */}
              {formData.email && formData.betaWaitlistConsent === "No" && (
                <div className="beta-waitlist-section">
                  <p className="beta-prompt">
                    Want to shape the future of Aluma? Drop your feedback and
                    join the beta waitlist!
                  </p>

                  {betaConsentStatus === null && (
                    <div className="beta-actions">
                      <button
                        onClick={() => handleBetaConsent(true)}
                        disabled={isUpdatingConsent}
                        className="beta-join-btn primary"
                      >
                        {isUpdatingConsent
                          ? "Joining..."
                          : "Join Beta Waitlist"}
                      </button>
                      <button
                        onClick={() => handleBetaConsent(false)}
                        disabled={isUpdatingConsent}
                        className="beta-decline-btn"
                      >
                        Maybe Later
                      </button>
                    </div>
                  )}

                  {betaConsentStatus === "joined" && (
                    <div className="beta-success">
                      <span className="beta-success-icon">✅</span>
                      <span>
                        Thanks! You're on the beta waitlist. We'll be in touch!
                      </span>
                    </div>
                  )}

                  {betaConsentStatus === "declined" && (
                    <div className="beta-declined">
                      <span>
                        No worries! You can always change your mind later.
                      </span>
                    </div>
                  )}

                  {betaConsentStatus === "error" && (
                    <div className="beta-error">
                      <span className="beta-error-icon">⚠️</span>
                      <span>Something went wrong. Please try again.</span>
                      <button
                        onClick={() => {
                          setBetaConsentStatus(null)
                          handleBetaConsent(true)
                        }}
                        className="beta-retry-btn"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="generated-content">
            {Object.entries(generatedContent).map(([format, content]) => (
              <div key={format} className="content-item">
                <div className="content-header">
                  <div className="content-title">
                    <span className="content-icon">{formatIcons[format]}</span>
                    <h3>{formatLabels[format]}</h3>
                  </div>
                  <div className="content-actions">
                    {editStates[format] ? (
                      <>
                        <button
                          onClick={() => saveEdit(format)}
                          className="save-btn"
                          title="Save changes"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={() => cancelEdit(format)}
                          className="cancel-btn"
                          title="Cancel editing"
                        >
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(format, content)}
                          className="edit-btn"
                          title="Edit content"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => copyToClipboard(content, format)}
                          className="copy-btn"
                          title="Copy to clipboard"
                        >
                          {copiedStates[format] ? "✅ Copied!" : "📋 Copy"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editStates[format] ? (
                  <textarea
                    value={editableContent[format] || content}
                    onChange={(e) =>
                      handleContentChange(format, e.target.value)
                    }
                    className="content-textarea"
                    placeholder="Edit your content here..."
                  />
                ) : (
                  <div className="content-text">{content}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="button-group">
        <button onClick={onBack}>Back</button>
        <button onClick={onStartOver}>Start Over</button>
        <button onClick={onUploadAnother} className="primary">
          Upload Another File
        </button>
      </div>
    </div>
  )
}

export default Results
