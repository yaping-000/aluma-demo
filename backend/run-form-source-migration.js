import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables")
  console.error("Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  try {
    console.log("🔄 Running form_source migration...")

    // Read the migration SQL
    const migrationPath = path.join(
      process.cwd(),
      "add_form_source_migration.sql"
    )
    const migrationSQL = fs.readFileSync(migrationPath, "utf8")

    // Execute the migration
    const { error } = await supabase.rpc("exec_sql", { sql: migrationSQL })

    if (error) {
      console.error("❌ Migration failed:", error)
      process.exit(1)
    }

    console.log("✅ Migration completed successfully!")
    console.log("📊 Added form_source field to users table")
    console.log('   - Default value: "demo"')
    console.log("   - Distinguishes between demo and contact form submissions")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

runMigration()
