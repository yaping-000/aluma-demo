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
  const [showSignup, setShowSignup] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handleGoogleSignup = async () => {
    setIsSigningUp(true)
    try {
      // This would integrate with your Google OAuth flow
      // For now, we'll simulate the process
      console.log("Initiating Google OAuth signup...")

      // In a real implementation, you would:
      // 1. Redirect to Google OAuth
      // 2. Handle the callback
      // 3. Create user account with Google profile
      // 4. Associate existing session data with new account

      setTimeout(() => {
        setIsSigningUp(false)
        setShowSignup(false)
        // Show success message or redirect to dashboard
      }, 2000)
    } catch (error) {
      console.error("Signup error:", error)
      setIsSigningUp(false)
    }
  }

  const handleSkipSignup = () => {
    setShowSignup(false)
  }

  return (
    <div className="demo-step">
      <h2>Your generated content</h2>

      {isGenerating ? (
        <div className="generation-status">
          <div className="loading-spinner"></div>
          <p>AI is creating your content...</p>
          <p className="generation-hint">This may take a few moments</p>
        </div>
      ) : (
        <div className="generated-content">
          {Object.entries(generatedContent).map(([format, content]) => (
            <div key={format} className="content-item">
              <div className="content-header">
                <div className="content-title">
                  <span className="content-icon">{formatIcons[format]}</span>
                  <h3>{formatLabels[format]}</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(content)}
                  className="copy-btn"
                  title="Copy to clipboard"
                >
                  📋 Copy
                </button>
              </div>

              <div className="content-text">{content}</div>
            </div>
          ))}
        </div>
      )}

      <div className="button-group">
        <button onClick={onBack}>Back</button>
        <button onClick={onStartOver}>Start Over</button>
        <button onClick={onUploadAnother} className="primary">
          Upload Another File
        </button>
      </div>

      {!isGenerating && Object.keys(generatedContent).length > 0 && (
        <div className="success-message">
          <div className="success-icon">🎉</div>
          <h3>Content Generated Successfully!</h3>
          <p>
            Your AI-powered content is ready to use. Copy any piece to your
            clipboard and start sharing!
            {isFromCache && (
              <span className="cache-indicator"> (Loaded from cache)</span>
            )}
          </p>
        </div>
      )}

      {/* Account Creation Section */}
      {!isGenerating &&
        Object.keys(generatedContent).length > 0 &&
        !showSignup && (
          <div className="signup-prompt">
            <div className="signup-content">
              <div className="signup-icon">🚀</div>
              <h3>Keep Your Content Organized</h3>
              <p>
                Create a free account to save all your generated content,
                session history, and file uploads in one organized place.
              </p>
              <div className="signup-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">📁</span>
                  <span>Access all your previous sessions</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">💾</span>
                  <span>Save and organize your content</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">📊</span>
                  <span>Track your content performance</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">⚡</span>
                  <span>Faster processing with saved preferences</span>
                </div>
              </div>
              <div className="signup-actions">
                <button
                  onClick={() => setShowSignup(true)}
                  className="signup-btn primary"
                >
                  Create Free Account
                </button>
                <button onClick={handleSkipSignup} className="skip-btn">
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="signup-modal">
          <div className="signup-modal-content">
            <div className="signup-header">
              <h3>Join Aluma</h3>
              <p>Create your free account to unlock all features</p>
            </div>

            <div className="signup-options">
              <button
                onClick={handleGoogleSignup}
                disabled={isSigningUp}
                className="google-signup-btn"
              >
                {isSigningUp ? (
                  <>
                    <div className="loading-spinner small"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="google-icon">🔍</span>
                    Continue with Google
                  </>
                )}
              </button>

              <div className="signup-divider">
                <span>or</span>
              </div>

              <div className="signup-benefits-modal">
                <h4>What you'll get:</h4>
                <ul>
                  <li>✅ Unlimited content generation</li>
                  <li>✅ Save all your sessions and files</li>
                  <li>✅ Access your content from anywhere</li>
                  <li>✅ Personalized AI recommendations</li>
                  <li>✅ Export and share your content</li>
                </ul>
              </div>
            </div>

            <div className="signup-footer">
              <button onClick={() => setShowSignup(false)} className="back-btn">
                ← Back to Results
              </button>
              <p className="signup-note">
                By creating an account, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Results
