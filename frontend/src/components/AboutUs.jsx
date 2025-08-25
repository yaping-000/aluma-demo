import React from "react"
import "./AboutUs.css"

const AboutUs = ({ isStandalone = false }) => {
  const values = [
    {
      icon: "🎯",
      title: "Authenticity",
      description: "We champion the true voice of every coach.",
    },
    {
      icon: "⚡",
      title: "Empowerment",
      description: "We free coaches from tech and marketing overload.",
    },
    {
      icon: "✨",
      title: "Simplicity",
      description: "Technology should make life easier, not harder.",
    },
    {
      icon: "🌊",
      title: "Impact",
      description: "We believe in the ripple effect of coaches changing lives.",
    },
    {
      icon: "🤝",
      title: "Partnership",
      description: "We grow by helping our users succeed.",
    },
  ]

  return (
    <section
      id="about-us"
      className={`about-us ${isStandalone ? "about-us-standalone" : ""}`}
    >
      <div className="about-container">
        <div className="about-header">
          <h2 className="about-title">About Aluma</h2>
          <p className="about-subtitle">
            Empowering coaches to focus on transforming lives by organizing
            their session notes, synthesizing insights, identifying patterns,
            and transforming their expertise into authentic content that
            attracts ideal clients and builds sustainable businesses.
          </p>
        </div>

        <div className="about-content">
          <div className="mission-vision">
            <div className="mission-section">
              <h3 className="section-title">Our Mission</h3>
              <p className="section-text">
                To empower coaches to focus on what they do best—transforming
                lives—by turning their insights and expertise into powerful,
                authentic content that attracts the right clients and grows
                their business organically.
              </p>
            </div>

            <div className="vision-section">
              <h3 className="section-title">Our Vision</h3>
              <p className="section-text">
                A world where every coach can effortlessly amplify their impact,
                connect with their ideal audience, and build sustainable
                businesses without the overwhelm of marketing or lead
                generation.
              </p>
            </div>
          </div>

          <div className="values-section">
            <h3 className="section-title">Our Values</h3>
            <div className="values-grid">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="value-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="value-icon">{value.icon}</div>
                  <h4 className="value-title">{value.title}</h4>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
