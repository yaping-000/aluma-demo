import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getCalApi } from "@calcom/embed-react"
import "./ContactUs.css"

const ContactUs = () => {
  const [showCalendar, setShowCalendar] = useState(false)

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

  const openCalendar = () => {
    setShowCalendar(true)
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
          {/* Google Form Section */}
          <motion.div
            className="contact-form-section"
            variants={contentVariants}
          >
            <div className="google-form-container">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLScCD7whbWmtplnEPMS5OjniLKij6e3JDOIVKSInnJ9iO66kBA/viewform?embedded=true"
                width="100%"
                height="800"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                title="Contact Form"
              >
                Loading…
              </iframe>
            </div>
          </motion.div>

          {/* Schedule Call Button */}
          <motion.div
            className="schedule-call-section"
            variants={contentVariants}
          >
            <div className="schedule-call-container">
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactUs
