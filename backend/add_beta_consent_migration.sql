-- Migration to add beta_waitlist_consent field to users table
-- This field tracks user consent for joining the beta waitlist

-- Add the beta_waitlist_consent column with a default value
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS beta_waitlist_consent BOOLEAN DEFAULT false;

-- Add a comment to explain the field
COMMENT ON COLUMN users.beta_waitlist_consent IS 'User consent for joining the beta waitlist';

-- Update existing records to have false as the default consent
UPDATE users 
SET beta_waitlist_consent = false 
WHERE beta_waitlist_consent IS NULL; 