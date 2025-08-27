import React, { useState, useEffect } from "react"

const Preview = ({ extractedText, userId, onNext, onBack }) => {
  const [isExtracting, setIsExtracting] = useState(false)
  const [keyInsights, setKeyInsights] = useState([])

  const [selectedFormats, setSelectedFormats] = useState([])

  useEffect(() => {
    if (extractedText) {
      extractKeyInsights()
    }
  }, [extractedText])

  const extractKeyInsights = async () => {
    setIsExtracting(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const baseUrl = import.meta.env.PROD
        ? (
            import.meta.env.VITE_API_BASE_URL ||
            "https://aluma-backend-production.up.railway.app"
          )
            .replace(/\/upload$/, "")
            .replace(/\/$/, "")
        : "http://localhost:3000"

      const response = await fetch(`${baseUrl}/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: extractedText,
          userId: userId,
          prompt: `You are an inquisitive coaching consultant analyzing the user's content. Your task is to extract key insights that reveal growth opportunities and provide actionable coaching wisdom.

EXTRACTION GUIDELINES:
- Act as an inquisitive coaching consultant analyzing the content
- Extract deeper insights and patterns that reveal growth opportunities
- Provide actionable coaching wisdom, not just summary of what was said
- Look for underlying themes, challenges, and breakthrough moments
- Offer strategic perspectives that help the person understand their journey better

Please provide your analysis in the following JSON format:
{
  "keyInsights": [
    {
      "id": 1,
      "text": "Coaching insight that synthesizes the content through the lens of an inquisitive consultant - provide actionable wisdom, not just summary",
      "type": "insight"
    }
  ]
}

IMPORTANT: Focus on EXTRACTING SPECIFIC INSIGHTS from the provided content, not generic advice. Every insight should be directly related to what the user has shared. Provide actionable coaching wisdom, not just summary of what was said.

Content to analyze: ${extractedText}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to extract insights")
      }

      const data = await response.json()

      setKeyInsights(data.keyInsights || generateFallbackKeyInsights())
    } catch (error) {
      console.error("Error extracting insights:", error)
      setKeyInsights(generateFallbackKeyInsights())
    } finally {
      setIsExtracting(false)
    }
  }

  // Fallback functions for when API fails
  const generateFallbackKeyInsights = () => {
    if (!extractedText) return []

    // Generate coaching insights from the content
    const insights = []

    // Analyze the content for coaching insights
    const text = extractedText.toLowerCase()

    // Look for career transition insights
    if (
      text.includes("new role") ||
      text.includes("transition") ||
      text.includes("change")
    ) {
      insights.push({
        id: 1,
        text: "Career transitions require both technical preparation and mindset shifts - focus on building confidence in your new identity",
        type: "insight",
      })
    }

    // Look for leadership insights
    if (
      text.includes("lead") ||
      text.includes("manage") ||
      text.includes("team")
    ) {
      insights.push({
        id: insights.length + 1,
        text: "Leadership is about influence, not just authority - develop your ability to inspire and guide others",
        type: "insight",
      })
    }

    // Look for confidence/mindset insights
    if (
      text.includes("confidence") ||
      text.includes("imposter") ||
      text.includes("doubt")
    ) {
      insights.push({
        id: insights.length + 1,
        text: "Imposter syndrome often signals growth - use it as a compass pointing toward areas where you're expanding your capabilities",
        type: "insight",
      })
    }

    // Look for networking insights
    if (
      text.includes("network") ||
      text.includes("relationship") ||
      text.includes("connect")
    ) {
      insights.push({
        id: insights.length + 1,
        text: "Professional relationships are built on mutual value - focus on how you can help others while building your network",
        type: "insight",
      })
    }

    // Look for skill development insights
    if (
      text.includes("skill") ||
      text.includes("learn") ||
      text.includes("develop")
    ) {
      insights.push({
        id: insights.length + 1,
        text: "Skill development should align with your long-term vision - choose learning that builds toward your desired future",
        type: "insight",
      })
    }

    // Look for communication insights
    if (
      text.includes("communicate") ||
      text.includes("present") ||
      text.includes("speak")
    ) {
      insights.push({
        id: insights.length + 1,
        text: "Effective communication is about connecting with your audience's needs, not just sharing information",
        type: "insight",
      })
    }

    // If no specific insights found, provide general coaching insights
    if (insights.length === 0) {
      insights.push(
        {
          id: 1,
          text: "Your experiences reveal patterns that can guide your future decisions - reflect on what's working and what needs adjustment",
          type: "insight",
        },
        {
          id: 2,
          text: "Professional growth happens at the intersection of challenge and support - seek environments that stretch you while providing resources",
          type: "insight",
        },
        {
          id: 3,
          text: "Success is often about positioning yourself where your strengths meet market opportunities",
          type: "insight",
        }
      )
    }

    return insights.slice(0, 5)
  }

  const formatOptions = [
    { value: "linkedin", label: "LinkedIn Post", icon: "💼" },
    { value: "blog", label: "Blog Post", icon: "📝" },
    { value: "newsletter", label: "Newsletter", icon: "📧" },
  ]

  const handleFormatToggle = (format) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter((f) => f !== format))
    } else {
      setSelectedFormats([...selectedFormats, format])
    }
  }

  const handleContinue = () => {
    if (selectedFormats.length === 0) return

    // Prepare the insights text for the next step
    const insightsText = keyInsights.map((insight) => insight.text).join("\n")

    // Pass the selected formats and insights to the next step
    onNext({
      selectedFormats,
      insights: insightsText,
      keyInsights,
    })
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>💡 Key Insights</h2>
        <p className="preview-subtitle">
          Main takeaways extracted from your content
        </p>
      </div>

      {isExtracting && (
        <div className="extracting-state">
          <div className="loading-spinner"></div>
          <p>Extracting key insights and organizing into content pillars...</p>
        </div>
      )}

      {!isExtracting && (
        <>
          {/* Key Insights Section */}
          <div className="insights-section">
            <h3>📋 Main Takeaways</h3>
            <p className="section-description">
              Key points and insights from your content
            </p>
            <div className="insights-grid">
              {keyInsights.map((insight) => (
                <div key={insight.id} className="insight-card">
                  <div className="insight-icon">💡</div>
                  <p className="insight-text">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="format-selection">
            <h3>📋 Choose Content Formats</h3>
            <p className="section-description">
              Select the formats you'd like to generate content for
            </p>
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

          {/* Action Buttons */}
          <div className="button-group">
            <button onClick={onBack}>Back</button>
            <button
              onClick={handleContinue}
              className="primary"
              disabled={selectedFormats.length === 0}
            >
              Generate Content
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Preview
