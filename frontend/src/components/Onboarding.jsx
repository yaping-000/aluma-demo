import React, { useState } from "react"
import { apiCall } from "../lib/api"

const Onboarding = ({ formData, handleInputChange, onNext, setUserId }) => {
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Save user data to Supabase
      const data = await apiCall("/onboarding", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          betaWaitlistConsent:
            formData.betaWaitlistConsent === "Yes" ||
            formData.betaWaitlistConsent === true,
          emailContact:
            formData.emailContact === "Yes" || formData.emailContact === true,
          formSource: "demo",
        }),
      })
      console.log("User data saved:", data)

      // Save userId for session tracking
      if (data.userId) {
        setUserId(data.userId)
        console.log("User ID saved for session tracking:", data.userId)
      }

      // Continue to next step
      onNext()
    } catch (error) {
      console.error("Error saving user data:", error)
      // Continue to demo even if saving fails
      onNext()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    handleInputChange(e)

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="demo-step">
      <h2>Tell us about yourself</h2>
      <p className="step-description">
        This helps us personalize your content generation experience
      </p>

      <div className="form-container">
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
            onChange={handleFieldChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
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
            onChange={handleFieldChange}
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
            onChange={handleFieldChange}
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
                onChange={handleFieldChange}
              />
              <span className="radio-label">Yes, I am a career coach</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="isCareerCoach"
                value="No"
                checked={formData.isCareerCoach === "No"}
                onChange={handleFieldChange}
              />
              <span className="radio-label">No, I'm not a career coach</span>
            </label>
          </div>
          {errors.isCareerCoach && (
            <span className="error-message">{errors.isCareerCoach}</span>
          )}
        </div>

        {/* Conditional: Coaching Niche (if career coach) */}
        {formData.isCareerCoach === "Yes" && (
          <div className="form-field">
            <label htmlFor="coachingNiche" className="form-label">
              What's your coaching niche? <span className="required">*</span>
            </label>
            <select
              id="coachingNiche"
              name="coachingNiche"
              value={formData.coachingNiche}
              onChange={handleFieldChange}
              className={errors.coachingNiche ? "error" : ""}
            >
              <option value="">Select your coaching niche</option>
              <option value="Early Career">Early Career</option>
              <option value="Executive">Executive</option>
              <option value="Career Transition">Career Transition</option>
              <option value="Resume Writing">Resume Writing</option>
              <option value="Interview Preparation">
                Interview Preparation
              </option>
              <option value="Leadership Development">
                Leadership Development
              </option>
              <option value="Personal Branding">Personal Branding</option>
              <option value="Other">Other</option>
            </select>
            {errors.coachingNiche && (
              <span className="error-message">{errors.coachingNiche}</span>
            )}
          </div>
        )}

        {/* Conditional: Profession (if not career coach) */}
        {formData.isCareerCoach === "No" && (
          <div className="form-field">
            <label htmlFor="profession" className="form-label">
              What's your profession? <span className="required">*</span>
            </label>
            <input
              id="profession"
              type="text"
              name="profession"
              placeholder="e.g., Marketing Manager, Software Engineer, Consultant"
              value={formData.profession}
              onChange={handleFieldChange}
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
            onChange={handleFieldChange}
            rows="3"
          />
        </div>

        {/* Business Growth Goals */}
        <div className="form-field">
          <label htmlFor="goals" className="form-label">
            How can Aluma best assist you with your business growth?
          </label>
          <textarea
            id="goals"
            name="goals"
            placeholder="Tell us about your business challenges, goals, or how you'd like Aluma to help you grow..."
            value={formData.goals}
            onChange={handleFieldChange}
            rows="4"
          />
        </div>

        {/* Email Contact Permission */}
        <div className="form-field">
          <label className="form-label">
            Can Aluma contact you via email and send you additional content?
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="emailContact"
                value="Yes"
                checked={formData.emailContact === "Yes"}
                onChange={handleFieldChange}
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
                onChange={handleFieldChange}
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
            Would you like to join our beta waitlist to help shape the future of
            Aluma?
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="betaWaitlistConsent"
                value="Yes"
                checked={formData.betaWaitlistConsent === "Yes"}
                onChange={handleFieldChange}
              />
              <span className="radio-label">
                Yes, I'd like to join the beta waitlist and provide feedback
              </span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="betaWaitlistConsent"
                value="No"
                checked={formData.betaWaitlistConsent === "No"}
                onChange={handleFieldChange}
              />
              <span className="radio-label">
                No, I prefer not to join the beta waitlist
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
            {isSubmitting ? "Saving..." : "Continue to Demo"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
