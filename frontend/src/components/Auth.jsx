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
          redirectTo: `${window.location.origin}/auth-success`,
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
      <button
        className="auth-button google-signin"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <svg className="google-icon" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign In
          </>
        )}
      </button>
    </div>
  )
}

export default Auth
