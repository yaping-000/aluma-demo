import React, { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import "./Auth.css"

const Auth = ({ onAuthStateChange }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (onAuthStateChange) {
        onAuthStateChange(session?.user ?? null)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (onAuthStateChange) {
        onAuthStateChange(session?.user ?? null)
      }
    })

    return () => subscription.unsubscribe()
  }, [onAuthStateChange])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}`,
        },
      })

      if (error) {
        console.error("Sign in error:", error)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
      } else {
        setShowDropdown(false)
      }
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (user) {
    return (
      <div className="auth-user">
        <div
          className="user-profile"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata?.full_name || user.email}
              className="user-avatar"
            />
          ) : (
            <div className="user-avatar-placeholder">
              {(user.user_metadata?.full_name || user.email)
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
          <span className="user-name">
            {user.user_metadata?.full_name || user.email}
          </span>
          <svg
            className="dropdown-arrow"
            width="12"
            height="8"
            viewBox="0 0 12 8"
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {showDropdown && (
          <div className="auth-dropdown">
            <div className="dropdown-header">
              <strong>{user.user_metadata?.full_name || user.email}</strong>
              <span className="user-email">{user.email}</span>
            </div>
            <div className="dropdown-divider"></div>
            <button
              className="dropdown-item"
              onClick={() => {
                setShowDropdown(false)
                // TODO: Navigate to user dashboard
              }}
            >
              My Dashboard
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setShowDropdown(false)
                // TODO: Navigate to settings
              }}
            >
              Settings
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item sign-out" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="auth-buttons">
      <div className="auth-coming-soon">
        <span className="coming-soon-text">Sign In</span>
        <span className="coming-soon-badge">Coming Soon</span>
      </div>
    </div>
  )
}

export default Auth
