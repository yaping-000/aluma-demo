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
              content, actionable insights, and clients who need you—so you can
              spend more time doing what you love.
            </motion.p>

            <motion.div className="hero-ctas" variants={itemVariants}>
              <motion.div variants={buttonVariants} whileHover="hover">
                <Link to="/demo" className="cta-primary">
                  Try the Demo – See It in Action
                </Link>
              </motion.div>

              <motion.div variants={buttonVariants} whileHover="hover">
                <Link to="/contact" className="cta-secondary">
                  Contact Us – Partner with Us
                </Link>
              </motion.div>
            </motion.div>

            <motion.div className="hero-testimonial" variants={itemVariants}>
              <div className="testimonial-content">
                <div className="testimonial-quote">
                  "Aluma saved me hours every week and helped me attract my
                  dream clients effortlessly."
                </div>
                <div className="testimonial-author">– Jane, Life Coach</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Illustration */}
          <motion.div
            className="hero-visual"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="hero-illustration"
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
                      <div className="content-line"></div>
                      <div className="content-line short"></div>
                      <div className="content-line"></div>
                    </div>
                  </div>
                  <div className="mockup-card">
                    <div className="card-header">
                      <div className="card-icon">🚀</div>
                      <div className="card-title">Generated Content</div>
                    </div>
                    <div className="card-content">
                      <div className="content-line"></div>
                      <div className="content-line short"></div>
                      <div className="content-line"></div>
                    </div>
                  </div>
                  <div className="mockup-card">
                    <div className="card-header">
                      <div className="card-icon">📊</div>
                      <div className="card-title">Analytics</div>
                    </div>
                    <div className="card-content">
                      <div className="content-line"></div>
                      <div className="content-line short"></div>
                      <div className="content-line"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
