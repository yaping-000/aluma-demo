import React from "react"

const Results = ({ generatedContent, onStartOver, onUploadAnother }) => {
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

  return (
    <div className="demo-step">
      <h2>Your generated content</h2>

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

      <div className="button-group">
        <button onClick={onStartOver}>Start Over</button>
        <button onClick={onUploadAnother} className="primary">
          Upload Another File
        </button>
      </div>

      <div className="success-message">
        <div className="success-icon">🎉</div>
        <h3>Content Generated Successfully!</h3>
        <p>
          Your AI-powered content is ready to use. Copy any piece to your
          clipboard and start sharing!
        </p>
      </div>
    </div>
  )
}

export default Results
