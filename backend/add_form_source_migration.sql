-- Migration to add form_source field to users table
-- This field distinguishes between demo and contact form submissions

-- Add the form_source column with a default value
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS form_source TEXT DEFAULT 'demo';

-- Add a comment to explain the field
COMMENT ON COLUMN users.form_source IS 'Indicates the source of the form submission: demo or contact';

-- Update existing records to have 'demo' as the default form_source
UPDATE users 
SET form_source = 'demo' 
WHERE form_source IS NULL; 