import React from "react"
import { Link } from "react-router-dom"
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
          <h2 className="about-title">About Us</h2>
        </div>

        <div className="about-content">
          {/* Mission & Vision Section - Side by Side */}
          <div className="mission-vision-section">
            <div className="mission-section">
              <h3 className="mission-heading">Mission</h3>
              <p className="mission-text">
                To empower coaches to focus on what they do best—transforming
                lives—by turning their insights and expertise into powerful,
                authentic content that attracts the right clients and grows
                their business organically.
              </p>
            </div>

            <div className="vision-section">
              <h3 className="vision-heading">Vision</h3>
              <p className="vision-text">
                A world where every coach can effortlessly amplify their impact,
                connect with their ideal audience, and build sustainable
                businesses without the overwhelm of marketing or lead
                generation.
              </p>
            </div>
          </div>

          {/* Founder Section - Two Column */}
          <div className="founder-section-container">
            <div className="founder-text-column">
              <h3 className="founder-heading">Founder</h3>
              <p className="founder-text">
                Hi, I'm Yaping Yang, a growth engineer with over 5 years of
                experience helping fintech startups and enterprises scale. I've
                seen how the right systems can accelerate growth—and I created
                Aluma to bring that power to coaches. My passion lies in
                building tools that allow you to do what you love, while Aluma
                handles the rest.
              </p>
            </div>

            <div className="founder-image-column">
              <div className="founder-image-container">
                <img
                  src="/assets/founder.png"
                  alt="Yaping Yang - Founder of Aluma"
                  className="founder-image"
                  onLoad={(e) => {
                    // Hide placeholder when image loads successfully
                    e.target.nextSibling.style.display = "none"
                  }}
                  onError={(e) => {
                    // Show placeholder if image fails to load
                    e.target.style.display = "none"
                    e.target.nextSibling.style.display = "block"
                  }}
                />
                <div className="founder-image-placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-icon">👩‍💼</div>
                    <p className="placeholder-text">Founder Photo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <p className="cta-text">
              Let's redefine how coaching businesses grow.{" "}
              <Link to="/demo" className="cta-link demo-link">
                Try the demo
              </Link>{" "}
              or{" "}
              <Link to="/contact" className="cta-link contact-link">
                book a quick intro call
              </Link>{" "}
              to see how Aluma can help you thrive.
            </p>
          </div>

          {/* Values Section - Full Width */}
          <div className="values-section">
            <h3 className="values-heading">Our Values</h3>
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
