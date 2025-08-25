-- Migration script to add new columns to existing users table
-- Run this in Supabase SQL Editor if you already have a users table

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