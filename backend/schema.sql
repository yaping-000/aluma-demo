-- Supabase Database Schema for Aluma Demo App
-- This schema supports user onboarding, session tracking, and AI prompt personalization

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for storing onboarding form data
-- Supports AI prompt personalization and demo analytics
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    business_name TEXT, -- Optional field for business/organization name
    is_career_coach BOOLEAN NOT NULL,
    coaching_expertise TEXT, -- NULL for non-career coaches
    profession TEXT, -- NULL for career coaches
    ideal_client TEXT, -- Optional field for ideal client/audience description
    years_of_experience INTEGER, -- Optional field
    consent BOOLEAN DEFAULT true,
    additional_context TEXT, -- Optional field for user notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table for tracking file processing and content generation
-- Supports demo analytics and user session history
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL, -- MIME type
    file_size INTEGER NOT NULL, -- Size in bytes
    extracted_text TEXT, -- Optional: text extracted from file
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_career_coach ON users(is_career_coach);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);

-- Row Level Security (RLS) policies for data protection
-- Enable RLS on both tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for users table
-- Allow all operations for demo purposes (can be restricted later)
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL USING (true);

-- RLS policies for sessions table
-- Allow all operations for demo purposes (can be restricted later)
CREATE POLICY "Allow all operations on sessions" ON sessions
    FOR ALL USING (true);

-- Comments explaining the schema purpose
COMMENT ON TABLE users IS 'Stores user onboarding data for AI prompt personalization and demo analytics';
COMMENT ON TABLE sessions IS 'Tracks file processing sessions for analytics and user history';
COMMENT ON COLUMN users.coaching_expertise IS 'Coaching niche for career coaches (Early Career, Executive, etc.)';
COMMENT ON COLUMN users.profession IS 'Profession/expertise for non-career coaches';
COMMENT ON COLUMN sessions.extracted_text IS 'Text extracted from uploaded files for content generation'; 