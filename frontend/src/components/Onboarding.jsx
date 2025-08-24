import React from "react"

const Onboarding = ({ formData, handleInputChange, onNext }) => {
  return (
    <div className="demo-step">
      <h2>Tell us about yourself</h2>
      <div className="form-grid">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="company"
          placeholder="Company/Organization"
          value={formData.company}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="role"
          placeholder="Your role"
          value={formData.role}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={formData.industry}
          onChange={handleInputChange}
        />
        <textarea
          name="goals"
          placeholder="What are your communication goals?"
          value={formData.goals}
          onChange={handleInputChange}
        />
      </div>
      <button
        onClick={onNext}
        disabled={!formData.name || !formData.email}
        className="primary"
      >
        Continue
      </button>
    </div>
  )
}

export default Onboarding
