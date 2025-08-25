import { supabase } from "./supabase.js"

async function runMigration() {
  console.log("🔄 Running database migration...")

  try {
    // Add business_name column
    const { error: businessNameError } = await supabase.rpc("exec_sql", {
      sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name TEXT;",
    })

    if (businessNameError) {
      console.log(
        "Note: business_name column might already exist or need manual migration"
      )
    } else {
      console.log("✅ Added business_name column")
    }

    // Add email_contact column
    const { error: emailContactError } = await supabase.rpc("exec_sql", {
      sql: "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_contact BOOLEAN DEFAULT true;",
    })

    if (emailContactError) {
      console.log(
        "Note: email_contact column might already exist or need manual migration"
      )
    } else {
      console.log("✅ Added email_contact column")
    }

    // Verify the columns exist
    const { data: columns, error: verifyError } = await supabase
      .from("users")
      .select("*")
      .limit(1)

    if (verifyError) {
      console.error("❌ Error verifying columns:", verifyError)
    } else {
      console.log("📋 Current table columns:", Object.keys(columns[0] || {}))
    }

    console.log("✅ Migration completed!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    console.log("\n📝 Manual migration required:")
    console.log("1. Go to your Supabase dashboard")
    console.log("2. Navigate to SQL Editor")
    console.log("3. Run the migration.sql script")
  }
}

runMigration()
