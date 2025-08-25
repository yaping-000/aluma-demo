import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// Make Supabase optional for demo deployment
let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log("✅ Supabase client initialized successfully")
  } catch (error) {
    console.warn("⚠️ Failed to initialize Supabase client:", error.message)
    supabase = null
  }
} else {
  console.warn(
    "⚠️ Supabase environment variables not set. Analytics will be disabled."
  )
}

export { supabase }

/**
 * Database Operations for User Management
 * These functions handle user onboarding data storage for AI prompt personalization
 */

/**
 * Insert a new user from the onboarding form
 * @param {Object} userData - User data from onboarding form
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.businessName - Business/organization name
 * @param {boolean} userData.isCareerCoach - Whether user is a career coach
 * @param {string} userData.coachingExpertise - Coaching expertise/niche
 * @param {string} userData.otherExpertise - Custom expertise if "other" selected
 * @param {string} userData.profession - Profession for non-career coaches
 * @param {number} userData.yearsOfExperience - Years of experience
 * @param {boolean} userData.consent - Email consent
 * @param {string} userData.additionalContext - Additional context/notes
 * @returns {Object} - Inserted user data with UUID
 */
export async function insertUser(userData) {
  if (!supabase) {
    console.warn("⚠️ Supabase not available. Skipping user insertion.")
    return { id: "demo-user-" + Date.now() }
  }

  try {
    console.log("Inserting user data:", userData)

    const insertData = {
      name: userData.name,
      email: userData.email,
      business_name: userData.company || null,
      is_career_coach: userData.isCareerCoach === "Yes",
      coaching_expertise: userData.coachingNiche || null,
      profession: userData.profession || null,
      consent: userData.emailContact === "Yes",
      additional_context: userData.goals || null,
    }

    console.log("Processed insert data:", insertData)

    const { data, error } = await supabase
      .from("users")
      .insert([insertData])
      .select()

    if (error) {
      console.error("Error inserting user:", error)
      throw error
    }

    console.log("User inserted successfully:", data[0])
    return data[0]
  } catch (error) {
    console.error("Failed to insert user:", error)
    throw error
  }
}

/**
 * Get user information by email for AI prompt personalization
 * @param {string} email - User's email address
 * @returns {Object} - User data for AI context
 */
export async function getUserByEmail(email) {
  if (!supabase) {
    console.warn("⚠️ Supabase not available. Returning null user.")
    return null
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return null
  }
}

/**
 * Database Operations for Session Management
 * These functions handle file processing metadata for demo analytics and content generation
 */

/**
 * Insert a new session with file processing metadata
 * @param {Object} sessionData - Session data from file processing
 * @param {string} sessionData.userId - User UUID from users table
 * @param {string} sessionData.filename - Original filename
 * @param {string} sessionData.fileType - MIME type of uploaded file
 * @param {number} sessionData.fileSize - File size in bytes
 * @param {string} sessionData.extractedText - Text extracted from file (optional)
 * @returns {Object} - Inserted session data with UUID
 */
export async function insertSession(sessionData) {
  if (!supabase) {
    console.warn("⚠️ Supabase not available. Skipping session insertion.")
    return { id: "demo-session-" + Date.now() }
  }

  try {
    // Only insert if userId is provided, otherwise skip
    if (!sessionData.userId) {
      console.log("No userId provided, skipping session insertion")
      return { id: "demo-session-" + Date.now() }
    }

    const { data, error } = await supabase
      .from("sessions")
      .insert([
        {
          user_id: sessionData.userId,
          filename: sessionData.filename,
          file_type: sessionData.fileType,
          file_size: sessionData.fileSize,
          extracted_text: sessionData.extractedText,
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting session:", error)
      throw error
    }

    console.log("Session inserted successfully:", data[0])
    return data[0]
  } catch (error) {
    console.error("Failed to insert session:", error)
    throw error
  }
}

/**
 * Get user's session history for analytics and content personalization
 * @param {string} userId - User UUID
 * @returns {Array} - Array of user's sessions
 */
export async function getUserSessions(userId) {
  if (!supabase) {
    console.warn("⚠️ Supabase not available. Returning empty sessions.")
    return []
  }

  try {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user sessions:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch user sessions:", error)
    return []
  }
}

/**
 * Get demo analytics data for insights
 * @returns {Object} - Analytics data including user counts, session counts, etc.
 */
export async function getDemoAnalytics() {
  if (!supabase) {
    console.warn("⚠️ Supabase not available. Returning demo analytics.")
    return {
      totalUsers: 0,
      totalSessions: 0,
      careerCoaches: 0,
      nonCareerCoaches: 0,
    }
  }

  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    // Get total sessions
    const { count: totalSessions } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })

    // Get career coach vs non-career coach breakdown
    const { data: coachBreakdown } = await supabase
      .from("users")
      .select("is_career_coach")

    const careerCoaches =
      coachBreakdown?.filter((u) => u.is_career_coach).length || 0
    const nonCareerCoaches =
      coachBreakdown?.filter((u) => !u.is_career_coach).length || 0

    return {
      totalUsers,
      totalSessions,
      careerCoaches,
      nonCareerCoaches,
    }
  } catch (error) {
    console.error("Failed to fetch analytics:", error)
    return {
      totalUsers: 0,
      totalSessions: 0,
      careerCoaches: 0,
      nonCareerCoaches: 0,
    }
  }
}
