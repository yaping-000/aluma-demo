import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSessions() {
  try {
    console.log("📊 Checking sessions in database...")

    // Get all sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (sessionsError) {
      console.error("❌ Error fetching sessions:", sessionsError)
      return
    }

    console.log(`✅ Found ${sessions.length} sessions:`)
    sessions.forEach((session, index) => {
      console.log(`\n${index + 1}. Session ID: ${session.id}`)
      console.log(`   User ID: ${session.user_id || "None"}`)
      console.log(`   Filename: ${session.filename}`)
      console.log(`   File Type: ${session.file_type}`)
      console.log(`   File Size: ${session.file_size} bytes`)
      console.log(`   Created: ${session.created_at}`)
      console.log(
        `   Text Length: ${session.extracted_text?.length || 0} chars`
      )
    })

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    if (usersError) {
      console.error("❌ Error fetching users:", usersError)
      return
    }

    console.log(`\n👥 Found ${users.length} users:`)
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.id}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Form Source: ${user.form_source}`)
      console.log(`   Created: ${user.created_at}`)
    })
  } catch (error) {
    console.error("❌ Failed:", error)
  }
}

checkSessions()
