# Database Migration Guide

## 🚨 **Required: Add new columns to database**

The onboarding form data is not being saved because the `business_name`, `ideal_client`, `google_id`, and `profile_picture` columns are missing from your Supabase database.

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

-- Add ideal_client column to existing users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS ideal_client TEXT;

-- Add Google OAuth columns to existing users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Add comments explaining the new columns
COMMENT ON COLUMN users.business_name IS 'Business/organization name for AI personalization';
COMMENT ON COLUMN users.ideal_client IS 'Ideal client/audience description for AI personalization';
COMMENT ON COLUMN users.google_id IS 'Google OAuth ID for authentication';
COMMENT ON COLUMN users.profile_picture IS 'User profile picture URL from Google OAuth';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name IN ('business_name', 'ideal_client', 'google_id', 'profile_picture');
```

### 4. **Execute the Query**

- Click the "Run" button (or press Ctrl+Enter)
- You should see a success message and the column verification

### 5. **Verify the Migration**

You should see output like:

```
column_name      | data_type | is_nullable
business_name    | text      | YES
ideal_client     | text      | YES
google_id        | text      | YES
profile_picture  | text      | YES
```

## ✅ **After Migration**

Once the migration is complete:

1. The onboarding form will save data successfully
2. The `company` field will be stored as `business_name` in the database
3. The `idealClient` field will be stored as `ideal_client` in the database
4. The `emailContact` field will be stored as `consent` in the database
5. Google OAuth authentication will work properly
6. User profile pictures will be stored from Google OAuth

## 🧪 **Test the Fix**

After running the migration, test the onboarding form:

1. Fill out the form with test data
2. Submit the form
3. Check your Supabase dashboard → Table Editor → users table
4. You should see the new user data with `business_name`, `ideal_client`, `google_id`, and `profile_picture` fields populated

## 🚨 **If Migration Fails**

If you get an error during migration:

1. Check that you're in the correct Supabase project
2. Ensure you have admin permissions
3. Try running just the ALTER TABLE command first
4. Contact Supabase support if needed
