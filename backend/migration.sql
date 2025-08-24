-- Migration script to add business_name column to existing users table
-- Run this in Supabase SQL Editor if you already have a users table

-- Add business_name column to existing users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS business_name TEXT;

-- Add comment explaining the new column
COMMENT ON COLUMN users.business_name IS 'Business/organization name for AI personalization';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'business_name'; 