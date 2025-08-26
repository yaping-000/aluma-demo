import React, { useState } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom"
import Demo from "./components/Demo"
import Auth from "./components/Auth"
import TermsOfService from "./components/TermsOfService"
import PrivacyPolicy from "./components/PrivacyPolicy"
import AboutUs from "./components/AboutUs"
import HeroSection from "./components/HeroSection"
import ContactUs from "./components/ContactUs"
import "./styles.css"

// Landing page component
const LandingPage = () => {
  const location = useLocation()

  React.useEffect(() => {
    // Check if we should scroll to about section (from navigation)
    if (location.hash === "#about-us" || location.state?.scrollToAbout) {
      const aboutSection = document.getElementById("about-us")
      if (aboutSection) {
        // Small delay to ensure the page has loaded
        setTimeout(() => {
          aboutSection.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }, [location])

  return (
    <>
      <HeroSection />
      <div className="landing-page">
        <div className="features">
          <div className="feature">
            <h3>AI-Powered</h3>
            <p>Advanced AI processes your content intelligently</p>
          </div>
          <div className="feature">
            <h3>Multiple Formats</h3>
            <p>Generate LinkedIn posts, newsletters, and more</p>
          </div>
          <div className="feature">
            <h3>Professional Quality</h3>
            <p>Tailored to your industry and role</p>
          </div>
        </div>
      </div>
      <AboutUs />
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          <div className="footer-copyright">
            © 2025 Aluma. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}

// Navigation component
const Navigation = ({ user, onAuthStateChange }) => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isHomePage = location.pathname === "/"

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`app-nav ${isHomePage ? "nav-hero" : "nav-default"}`}>
      <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
        Aluma
      </Link>

      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}></span>
      </button>

      {/* Desktop navigation */}
      <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
          onClick={closeMobileMenu}
        >
          Home
        </Link>
        <Link
          to="/demo"
          className={location.pathname === "/demo" ? "active" : ""}
          onClick={closeMobileMenu}
        >
          Demo
        </Link>
        <Link
          to="/"
          state={{ scrollToAbout: true }}
          onClick={(e) => {
            closeMobileMenu()
            // If we're already on the home page, scroll to about section
            if (location.pathname === "/") {
              e.preventDefault()
              const aboutSection = document.getElementById("about-us")
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: "smooth" })
              }
            }
            // If we're on another page, let the Link navigate to home page
            // We'll handle the scroll after navigation via useEffect
          }}
        >
          About
        </Link>
        <Link
          to="/contact"
          className={location.pathname === "/contact" ? "active" : ""}
          onClick={closeMobileMenu}
        >
          Contact Us
        </Link>
        {/* Dashboard link hidden until auth is ready
        {user && (
          <Link
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
        )}
        */}
      </div>

      <div className="nav-auth">
        <Auth onAuthStateChange={onAuthStateChange} />
      </div>
    </nav>
  )
}

// App Content component
const AppContent = ({ user, onAuthStateChange }) => {
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  return (
    <div className="app">
      <Navigation user={user} onAuthStateChange={onAuthStateChange} />
      <main className={`app-main ${isHomePage ? "home-page" : "other-page"}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<Demo />} />

          <Route path="/contact" element={<ContactUs />} />
          <Route path="/dashboard" element={<div>Dashboard Coming Soon</div>} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
    </div>
  )
}

// Main App component
const App = () => {
  const [user, setUser] = useState(null)

  const handleAuthStateChange = (newUser) => {
    setUser(newUser)
  }

  return (
    <Router>
      <AppContent user={user} onAuthStateChange={handleAuthStateChange} />
    </Router>
  )
}

export default App
