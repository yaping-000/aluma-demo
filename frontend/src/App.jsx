import React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom"
import Demo from "./components/Demo"
import "./styles.css"

// Landing page component
const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to Aluma</h1>
          <p>Transform your content into professional communications</p>
          <Link to="/demo" className="cta-button">
            Try the Demo
          </Link>
        </div>
        <div className="hero-image">
          <img
            src="/hero-image.png"
            alt="Diverse professionals representing different careers"
            className="hero-img"
          />
        </div>
      </div>
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
  )
}

// Navigation component
const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="app-nav">
      <Link to="/" className="nav-brand">
        Aluma
      </Link>
      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link
          to="/demo"
          className={location.pathname === "/demo" ? "active" : ""}
        >
          Demo
        </Link>
      </div>
    </nav>
  )
}

// Main App component
const App = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/demo" element={<Demo />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
