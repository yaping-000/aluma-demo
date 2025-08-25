# Google OAuth Setup Guide

## 🔐 **Setting up Google OAuth for Account Creation**

This guide will help you integrate Google OAuth authentication for the account creation flow in the Results page.

## 📋 **Prerequisites**

1. **Google Cloud Console Account**
2. **Supabase Project** (already configured)
3. **Backend API** (Node.js/Express)

## 🚀 **Step-by-Step Setup**

### **1. Google Cloud Console Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **Google OAuth2 API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: "Aluma"
   - User support email: your email
   - Developer contact information: your email
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback` (development)
     - `https://your-domain.com/auth/google/callback` (production)

### **2. Backend Integration**

Install required packages:

```bash
npm install passport passport-google-oauth20 express-session
```

### **3. Environment Variables**

Add to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-session-secret
FRONTEND_URL=http://localhost:5173
```

### **4. Backend Implementation**

Create `auth.js` in your backend:

```javascript
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import session from "express-session"
import { insertUser, getUserByEmail } from "./supabase.js"

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
)

// Passport configuration
app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await getUserByEmail(profile.emails[0].value)

        if (!user) {
          // Create new user
          user = await insertUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile.photos[0]?.value,
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    // Get user from database
    const user = await getUserByEmail(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

// Auth routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
)

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    res.redirect(
      `${process.env.FRONTEND_URL}/auth-success?userId=${req.user.id}`
    )
  }
)

app.get("/auth/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})
```

### **5. Frontend Integration**

Update the `handleGoogleSignup` function in `Results.jsx`:

```javascript
const handleGoogleSignup = async () => {
  setIsSigningUp(true)
  try {
    // Redirect to Google OAuth
    window.location.href = "/api/auth/google"
  } catch (error) {
    console.error("Signup error:", error)
    setIsSigningUp(false)
  }
}
```

### **6. Database Schema Updates**

Add Google OAuth fields to your users table:

```sql
-- Add Google OAuth fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Add index for Google ID lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
```

### **7. Session Association**

When a user signs up with Google, associate their existing demo session:

```javascript
// In your OAuth callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      // Associate existing session data with new user
      if (req.session.demoUserId) {
        await updateSessionUser(req.session.demoUserId, req.user.id)
      }

      res.redirect(
        `${process.env.FRONTEND_URL}/auth-success?userId=${req.user.id}`
      )
    } catch (error) {
      console.error("Error associating session:", error)
      res.redirect(
        `${process.env.FRONTEND_URL}/auth-success?userId=${req.user.id}`
      )
    }
  }
)
```

## 🎯 **User Flow**

1. **User completes demo** → Sees generated content
2. **Clicks "Create Free Account"** → Signup prompt appears
3. **Clicks "Continue with Google"** → Redirected to Google OAuth
4. **Google authentication** → User authorizes Aluma
5. **OAuth callback** → User account created/updated
6. **Session association** → Demo data linked to new account
7. **Redirect to dashboard** → User sees their organized content

## 🔒 **Security Considerations**

- **HTTPS required** for production OAuth
- **Secure session storage** with proper secrets
- **CSRF protection** for OAuth flows
- **Rate limiting** on auth endpoints
- **Input validation** for all user data

## 📱 **Mobile Considerations**

- **Responsive design** for OAuth popups
- **Deep linking** for mobile OAuth flows
- **App store compliance** for mobile apps

## 🚀 **Next Steps**

1. Implement the backend OAuth routes
2. Update database schema
3. Test the complete flow
4. Add error handling and edge cases
5. Implement session persistence
6. Add user dashboard for saved content
