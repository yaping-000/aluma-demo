# Database Migration Guide

## 🚨 **Required: Add business_name column to database**

The onboarding form data is not being saved because the `business_name` column is missing from your Supabase database.

## 📋 **Step-by-Step Migration**

### 1. **Go to Supabase Dashboard**

- Visit: https://supabase.com/dashboard
- Select your project: `poondlknkfsyogkrrwaf`

### 2. **Open SQL Editor**

- Click on "SQL Editor" in the left sidebar
- Click "New query"

### 3. **Run the Migration**

Copy and paste this SQL:

```sql
-- Add business_name column to existing users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS business_name TEXT;

-- Add comment explaining the new column
COMMENT ON COLUMN users.business_name IS 'Business/organization name for AI personalization';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'business_name';
```

### 4. **Execute the Query**

- Click the "Run" button (or press Ctrl+Enter)
- You should see a success message and the column verification

### 5. **Verify the Migration**

You should see output like:

```
column_name    | data_type | is_nullable
business_name  | text      | YES
```

## ✅ **After Migration**

Once the migration is complete:

1. The onboarding form will save data successfully
2. The `company` field will be stored as `business_name` in the database
3. The `emailContact` field will be stored as `consent` in the database

## 🧪 **Test the Fix**

After running the migration, test the onboarding form:

1. Fill out the form with test data
2. Submit the form
3. Check your Supabase dashboard → Table Editor → users table
4. You should see the new user data with the `business_name` field populated

## 🚨 **If Migration Fails**

If you get an error during migration:

1. Check that you're in the correct Supabase project
2. Ensure you have admin permissions
3. Try running just the ALTER TABLE command first
4. Contact Supabase support if needed
