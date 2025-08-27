import React from "react"

const Generate = ({
  extractedText,
  selectedFormats,
  handleGenerate,
  isGenerating,
  onBack,
  contentCache,
  generateCacheKey,
}) => {
  const formatLabels = {
    linkedin: "LinkedIn Post",
    blog: "Blog Article",
    clientFollowUp: "Client Follow-up",
  }

  const formatIcons = {
    linkedin: "💼",
    blog: "📝",
    clientFollowUp: "🤝",
  }

  return (
    <div className="demo-step">
      <h2>Generate Content</h2>
      <p className="step-description">
        Creating polished content in your selected formats
      </p>

      {/* Selected Formats Display */}
      <div className="selected-formats">
        <h3>Generating content for:</h3>
        <div className="formats-list">
          {selectedFormats.map((format) => (
            <div key={format} className="format-item">
              <span className="format-icon">{formatIcons[format]}</span>
              <span className="format-label">{formatLabels[format]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Preview */}
      <div className="content-preview">
        <h3>Source Content:</h3>
        <div className="extracted-text-preview">
          {extractedText ? (
            <p>{extractedText.substring(0, 200)}...</p>
          ) : (
            <p>No content available</p>
          )}
        </div>
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <div className="generation-status">
          <div className="loading-spinner"></div>
          <p>Aluma is creating your content in your authentic voice...</p>
          <p className="generation-hint">This may take a few moments</p>
        </div>
      )}

      {/* Cache Notice */}
      {contentCache &&
        generateCacheKey &&
        selectedFormats.length > 0 &&
        contentCache[generateCacheKey(extractedText, selectedFormats)] && (
          <div className="cache-notice">
            <p>💡 Cached content available - will load instantly!</p>
          </div>
        )}

      {/* Button Group */}
      <div className="button-group">
        <button onClick={onBack} className="secondary">
          Back to Preview
        </button>
        <button
          onClick={handleGenerate}
          disabled={selectedFormats.length === 0 || isGenerating}
          className="primary"
        >
          {contentCache &&
          generateCacheKey &&
          selectedFormats.length > 0 &&
          contentCache[generateCacheKey(extractedText, selectedFormats)]
            ? "Load Cached Content"
            : "Generate Content"}
        </button>
      </div>
    </div>
  )
}

export default Generate
