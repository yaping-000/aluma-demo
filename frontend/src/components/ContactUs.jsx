import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getCalApi } from "@calcom/embed-react"
import { apiCall } from "../lib/api"
import "./ContactUs.css"

const ContactUs = () => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    isCareerCoach: "",
    coachingNiche: "",
    profession: "",
    idealClient: "",
    goals: "",
    emailContact: "Yes",
    betaWaitlistConsent: "Yes",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    // Set page title for SEO
    document.title = "Contact Us | Aluma"

    // Initialize Cal.com for popup
    const initCal = async () => {
      try {
        const cal = await getCalApi({ namespace: "aluma-intros" })
        cal("ui", {
          hideEventTypeDetails: false,
          layout: "week_view",
          styles: {
            branding: {
              brandColor: "#7c3aed",
            },
          },
        })
      } catch (error) {
        console.error("Error initializing Cal.com:", error)
      }
    }

    initCal()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.isCareerCoach) {
      newErrors.isCareerCoach = "Please select whether you are a career coach"
    }

    // Conditional required fields
    if (formData.isCareerCoach === "Yes" && !formData.coachingNiche) {
      newErrors.coachingNiche = "Please select your coaching niche"
    }

    if (formData.isCareerCoach === "No" && !formData.profession) {
      newErrors.profession = "Please specify your profession"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Save user data to Supabase
      const requestBody = {
        ...formData,
        betaWaitlistConsent:
          formData.betaWaitlistConsent === "Yes" ||
          formData.betaWaitlistConsent === true,
        emailContact:
          formData.emailContact === "Yes" || formData.emailContact === true,
        formSource: "contact",
      }
      console.log("Sending contact form data:", requestBody)

      const data = await apiCall("/onboarding", {
        method: "POST",
        body: JSON.stringify(requestBody),
      })
      console.log("User data saved:", data)

      // Show success state
      setIsSubmitted(true)
      setSubmitError("")

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        isCareerCoach: "",
        coachingNiche: "",
        profession: "",
        idealClient: "",
        goals: "",
        emailContact: "Yes",
        betaWaitlistConsent: "Yes",
      })
    } catch (error) {
      console.error("Error saving user data:", error)
      setSubmitError(
        "There was an error submitting your form. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const openCalendar = () => {
    setShowCalendar(true)
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setSubmitError("")
    setErrors({})
    setFormData({
      name: "",
      email: "",
      company: "",
      isCareerCoach: "",
      coachingNiche: "",
      profession: "",
      idealClient: "",
      goals: "",
      emailContact: "Yes",
      betaWaitlistConsent: "No",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="book-call-page">
      <div className="book-call-container">
        <motion.div
          className="book-call-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div className="book-call-header" variants={contentVariants}>
            <h1 className="book-call-title">Contact Us</h1>
            <p className="book-call-subtitle">
              Get in touch with us to learn how Aluma can transform your
              coaching sessions into growth.
            </p>
          </motion.div>

          {/* Contact Options */}
          <motion.div className="contact-options" variants={contentVariants}>
            <div className="option-cards">
              <div className="option-card primary">
                <h3>Tell us about yourself</h3>
                <p>
                  Fill out our contact form and we'll get back to you with
                  personalized information.
                </p>
                <div className="option-indicator">Default</div>
              </div>
              <div className="option-card secondary">
                <h3>Schedule a call</h3>
                <p>Book a quick intro call to see how Aluma can help.</p>
                <button
                  className="schedule-button"
                  data-cal-namespace="aluma-intros"
                  data-cal-link="yapingyang/aluma-intros"
                  data-cal-config='{"layout":"week_view","styles":{"body":{"background":"white"},"branding":{"brandColor":"#7c3aed"},"page":{"backgroundColor":"white","backgroundImage":"none"}}}'
                  onClick={openCalendar}
                >
                  Schedule Call
                </button>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div
            className="contact-form-section"
            variants={contentVariants}
          >
            {isSubmitted ? (
              <div className="success-container">
                <div className="success-icon">✅</div>
                <h2>Thank you for contacting us!</h2>
                <p className="success-message">
                  We've received your message and will get back to you soon.
                </p>
                <button onClick={resetForm} className="primary">
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="form-container">
                <h2>Contact Form</h2>
                <p className="form-description">
                  Tell us about yourself and your needs. Join our beta waitlist!
                </p>

                {/* Name - Required */}
                <div className="form-field">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                {/* Email - Required */}
                <div className="form-field">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                {/* Company */}
                <div className="form-field">
                  <label htmlFor="company" className="form-label">
                    Company/Organization
                  </label>
                  <input
                    id="company"
                    type="text"
                    name="company"
                    placeholder="Enter your company or organization"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Career Coach Question - Required */}
                <div className="form-field">
                  <label className="form-label">
                    Are you a career coach? <span className="required">*</span>
                  </label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="isCareerCoach"
                        value="Yes"
                        checked={formData.isCareerCoach === "Yes"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-label">
                        Yes, I am a career coach
                      </span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="isCareerCoach"
                        value="No"
                        checked={formData.isCareerCoach === "No"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-label">
                        No, I'm not a career coach
                      </span>
                    </label>
                  </div>
                  {errors.isCareerCoach && (
                    <span className="error-message">
                      {errors.isCareerCoach}
                    </span>
                  )}
                </div>

                {/* Conditional: Coaching Niche (if career coach) */}
                {formData.isCareerCoach === "Yes" && (
                  <div className="form-field">
                    <label htmlFor="coachingNiche" className="form-label">
                      What's your coaching niche?{" "}
                      <span className="required">*</span>
                    </label>
                    <select
                      id="coachingNiche"
                      name="coachingNiche"
                      value={formData.coachingNiche}
                      onChange={handleInputChange}
                      className={errors.coachingNiche ? "error" : ""}
                    >
                      <option value="">Select your coaching niche</option>
                      <option value="Early Career">Early Career</option>
                      <option value="Executive">Executive</option>
                      <option value="Career Transition">
                        Career Transition
                      </option>
                      <option value="Resume Writing">Resume Writing</option>
                      <option value="Interview Preparation">
                        Interview Preparation
                      </option>
                      <option value="Leadership Development">
                        Leadership Development
                      </option>
                      <option value="Personal Branding">
                        Personal Branding
                      </option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.coachingNiche && (
                      <span className="error-message">
                        {errors.coachingNiche}
                      </span>
                    )}
                  </div>
                )}

                {/* Conditional: Profession (if not career coach) */}
                {formData.isCareerCoach === "No" && (
                  <div className="form-field">
                    <label htmlFor="profession" className="form-label">
                      What's your profession?{" "}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="profession"
                      type="text"
                      name="profession"
                      placeholder="e.g., Marketing Manager, Software Engineer, Consultant"
                      value={formData.profession}
                      onChange={handleInputChange}
                      className={errors.profession ? "error" : ""}
                    />
                    {errors.profession && (
                      <span className="error-message">{errors.profession}</span>
                    )}
                  </div>
                )}

                {/* Ideal Client/Audience */}
                <div className="form-field">
                  <label htmlFor="idealClient" className="form-label">
                    Who is your ideal client or audience?
                  </label>
                  <textarea
                    id="idealClient"
                    name="idealClient"
                    placeholder="Describe your ideal client or target audience (e.g., 'Mid-career professionals looking to transition into tech', 'Recent graduates seeking their first job', 'Executives wanting to improve their leadership presence')"
                    value={formData.idealClient}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                {/* Communication Goals */}
                <div className="form-field">
                  <label htmlFor="goals" className="form-label">
                    How can Aluma best assist you with your business growth?
                  </label>
                  <textarea
                    id="goals"
                    name="goals"
                    placeholder="Tell us about your business challenges, goals, or how you'd like Aluma to help you grow..."
                    value={formData.goals}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>

                {/* Email Contact Permission */}
                <div className="form-field">
                  <label className="form-label">
                    Can Aluma contact you via email and send you additional
                    content?
                  </label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="emailContact"
                        value="Yes"
                        checked={formData.emailContact === "Yes"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-label">
                        Yes, I'd like to receive updates and content
                      </span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="emailContact"
                        value="No"
                        checked={formData.emailContact === "No"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-label">
                        No, I prefer not to receive emails
                      </span>
                    </label>
                  </div>
                </div>

                {/* Beta Waitlist Consent */}
                <div className="form-field">
                  <label className="form-label">
                    Would you like to join our beta waitlist to help shape the
                    future of Aluma?
                  </label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="betaWaitlistConsent"
                        value="Yes"
                        checked={formData.betaWaitlistConsent === "Yes"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-label">
                        Yes, I'd like to join the beta waitlist and provide
                        feedback
                      </span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="betaWaitlistConsent"
                        value="No"
                        checked={formData.betaWaitlistConsent === "No"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-label">
                        No, I prefer not to join the beta waitlist at this time
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="primary"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="error-container">
                    <p className="error-message">{submitError}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactUs
