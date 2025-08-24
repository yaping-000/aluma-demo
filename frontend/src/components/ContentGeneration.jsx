import React from "react"

const ContentGeneration = ({
  extractedText,
  selectedFormats,
  setSelectedFormats,
  handleGenerate,
  isGenerating,
  onBack,
}) => {
  const formatOptions = [
    { value: "linkedin", label: "LinkedIn Post", icon: "💼" },
    { value: "newsletter", label: "Email Newsletter", icon: "📧" },
    { value: "summary", label: "Content Summary", icon: "📋" },
    { value: "clientFollowUp", label: "Client Follow-up", icon: "🤝" },
  ]

  const handleFormatToggle = (format) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter((f) => f !== format))
    } else {
      setSelectedFormats([...selectedFormats, format])
    }
  }

  return (
    <div className="demo-step">
      <h2>Choose content formats</h2>

      <div className="extracted-text">
        <h3>Extracted Content:</h3>
        <div className="content-preview">
          {extractedText || "No content extracted yet..."}
        </div>
      </div>

      <div className="format-selection">
        <h3>Select formats to generate:</h3>
        <div className="format-grid">
          {formatOptions.map((format) => (
            <div
              key={format.value}
              className={`format-option ${
                selectedFormats.includes(format.value) ? "selected" : ""
              }`}
              onClick={() => handleFormatToggle(format.value)}
            >
              <div className="format-icon">{format.icon}</div>
              <div className="format-label">{format.label}</div>
              <input
                type="checkbox"
                checked={selectedFormats.includes(format.value)}
                onChange={() => handleFormatToggle(format.value)}
                className="format-checkbox"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button onClick={onBack}>Back</button>
        <button
          onClick={handleGenerate}
          disabled={selectedFormats.length === 0 || isGenerating}
          className="primary"
        >
          {isGenerating ? "Generating..." : "Generate Content"}
        </button>
      </div>

      {isGenerating && (
        <div className="generation-status">
          <div className="loading-spinner"></div>
          <p>AI is creating your content...</p>
        </div>
      )}
    </div>
  )
}

export default ContentGeneration
