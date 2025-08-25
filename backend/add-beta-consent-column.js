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

async function addBetaConsentColumn() {
  try {
    console.log("🔄 Checking if beta_waitlist_consent column exists...")

    // Try to insert a test record with beta_waitlist_consent to see if the column exists
    const testData = {
      name: "Test User Beta",
      email: `test-beta-${Date.now()}@example.com`,
      is_career_coach: false,
      beta_waitlist_consent: true,
    }

    const { data, error } = await supabase
      .from("users")
      .insert([testData])
      .select()

    if (error) {
      if (error.message.includes("beta_waitlist_consent")) {
        console.log("❌ beta_waitlist_consent column does not exist")
        console.log(
          "📝 Please add the column manually in your Supabase dashboard:"
        )
        console.log(
          "   ALTER TABLE users ADD COLUMN beta_waitlist_consent BOOLEAN DEFAULT false;"
        )
        console.log(
          "   COMMENT ON COLUMN users.beta_waitlist_consent IS 'User consent for joining the beta waitlist';"
        )
      } else {
        console.error("❌ Error:", error)
      }
    } else {
      console.log("✅ beta_waitlist_consent column exists!")
      console.log("✅ Test record inserted successfully")

      // Clean up the test record
      await supabase.from("users").delete().eq("email", testData.email)

      console.log("🧹 Test record cleaned up")
    }
  } catch (error) {
    console.error("❌ Failed:", error)
  }
}

addBetaConsentColumn()
