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

async function addFormSourceColumn() {
  try {
    console.log("🔄 Checking if form_source column exists...")

    // Try to insert a test record with form_source to see if the column exists
    const testData = {
      name: "Test User",
      email: `test-${Date.now()}@example.com`,
      is_career_coach: false,
      form_source: "test",
    }

    const { data, error } = await supabase
      .from("users")
      .insert([testData])
      .select()

    if (error) {
      if (error.message.includes("form_source")) {
        console.log("❌ form_source column does not exist")
        console.log(
          "📝 Please add the column manually in your Supabase dashboard:"
        )
        console.log(
          "   ALTER TABLE users ADD COLUMN form_source TEXT DEFAULT 'demo';"
        )
        console.log(
          "   COMMENT ON COLUMN users.form_source IS 'Indicates the source of the form submission: demo or contact';"
        )
      } else {
        console.error("❌ Error:", error)
      }
    } else {
      console.log("✅ form_source column exists!")
      console.log("✅ Test record inserted successfully")

      // Clean up the test record
      await supabase.from("users").delete().eq("email", testData.email)

      console.log("🧹 Test record cleaned up")
    }
  } catch (error) {
    console.error("❌ Failed:", error)
  }
}

addFormSourceColumn()
