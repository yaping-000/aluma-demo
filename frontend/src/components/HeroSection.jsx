import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import "./HeroSection.css"

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  return (
    <>
      <section className="hero-section">
        <div className="hero-container">
          <motion.div
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column - Content */}
            <div className="hero-text">
              <motion.h1 className="hero-headline" variants={itemVariants}>
                Focus on Coaching.
                <br />
                <span className="gradient-text">We'll Handle the Growth.</span>
              </motion.h1>

              <motion.p className="hero-subheadline" variants={itemVariants}>
                Aluma transforms your coaching session notes into authentic
                content, actionable insights, and clients who need you—so you
                can spend more time doing what you love.
              </motion.p>

              <motion.div className="hero-ctas" variants={itemVariants}>
                <motion.div variants={buttonVariants} whileHover="hover">
                  <Link to="/demo" className="cta-primary">
                    Try the Demo – See It in Action
                  </Link>
                </motion.div>

                <motion.div variants={buttonVariants} whileHover="hover">
                  <Link to="/contact" className="cta-secondary">
                    Contact Us – Join the Beta Waitlist
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Visual (Desktop only) */}
            <div className="hero-visual desktop-only">
              <motion.div
                className="hero-illustration"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="mockup-container">
                  <div className="mockup-header">
                    <div className="mockup-dots">
                      <div className="dot red"></div>
                      <div className="dot yellow"></div>
                      <div className="dot green"></div>
                    </div>
                    <div className="mockup-title">Aluma Dashboard</div>
                  </div>
                  <div className="mockup-content">
                    <div className="mockup-card">
                      <div className="card-header">
                        <div className="card-icon">📝</div>
                        <div className="card-title">Session Notes</div>
                      </div>
                      <div className="card-content">
                        <div className="content-text">
                          <div className="content-title">
                            Alex R. – Career Pivot
                          </div>
                          <div className="content-quote">
                            "Clarity comes from action, not overthinking."
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mockup-card">
                      <div className="card-header">
                        <div className="card-icon">🚀</div>
                        <div className="card-title">Generated Content</div>
                      </div>
                      <div className="card-content">
                        <div className="content-text">
                          <div className="content-section">
                            <strong>LinkedIn Post Ready:</strong>
                            <br />
                            "3 steps to pivot careers with confidence."
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mockup-card">
                      <div className="card-header">
                        <div className="card-icon">📊</div>
                        <div className="card-title">Analytics</div>
                      </div>
                      <div className="card-content">
                        <div className="content-text">
                          <div className="content-metric">
                            +34% Engagement | 22 posts this month
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Showcase Section (Mobile) */}
      <section className="dashboard-showcase">
        <div className="dashboard-container">
          <motion.div
            className="dashboard-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 className="dashboard-title" variants={itemVariants}>
              See Aluma in Action
            </motion.h2>
            <motion.p className="dashboard-subtitle" variants={itemVariants}>
              Watch how your coaching sessions transform into growth-driving
              content
            </motion.p>

            <motion.div
              className="dashboard-visual"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="dashboard-illustration"
                variants={floatVariants}
                animate="animate"
              >
                <div className="mockup-container">
                  <div className="mockup-header">
                    <div className="mockup-dots">
                      <div className="dot red"></div>
                      <div className="dot yellow"></div>
                      <div className="dot green"></div>
                    </div>
                    <div className="mockup-title">Aluma Dashboard</div>
                  </div>
                  <div className="mockup-content">
                    <div className="mockup-card">
                      <div className="card-header">
                        <div className="card-icon">📝</div>
                        <div className="card-title">Session Notes</div>
                      </div>
                      <div className="card-content">
                        <div className="content-text">
                          <div className="content-title">
                            Alex R. – Career Pivot
                          </div>
                          <div className="content-quote">
                            "Clarity comes from action, not overthinking."
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mockup-card">
                      <div className="card-header">
                        <div className="card-icon">🚀</div>
                        <div className="card-title">Generated Content</div>
                      </div>
                      <div className="card-content">
                        <div className="content-text">
                          <div className="content-section">
                            <strong>LinkedIn Post Ready:</strong>
                            <br />
                            "3 steps to pivot careers with confidence."
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mockup-card">
                      <div className="card-header">
                        <div className="card-icon">📊</div>
                        <div className="card-title">Analytics</div>
                      </div>
                      <div className="card-content">
                        <div className="content-text">
                          <div className="content-metric">
                            +34% Engagement | 22 posts this month
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default HeroSection
