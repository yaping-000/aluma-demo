# Supabase Setup Guide for Aluma Demo

## Environment Variables Setup

Add the following variables to your `backend/.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Getting Supabase Credentials

1. **Create a Supabase Project:**

   - Go to [https://supabase.com](https://supabase.com)
   - Sign up/login and create a new project
   - Wait for the project to be set up

2. **Get Your Credentials:**
   - Go to your project dashboard
   - Navigate to Settings > API
   - Copy the "Project URL" (this is your `SUPABASE_URL`)
   - Copy the "anon public" key (this is your `SUPABASE_ANON_KEY`)

## Database Schema Setup

1. **Run the Schema:**

   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `schema.sql`
   - Click "Run" to create the tables

2. **Verify Tables:**
   - Go to Table Editor
   - You should see two tables: `users` and `sessions`

## Database Schema Overview

### Users Table

- Stores onboarding form data for AI prompt personalization
- Tracks user preferences and expertise
- Supports demo analytics

### Sessions Table

- Tracks file processing metadata
- Stores extracted text for content generation
- Links to users for session history

## Usage Examples

### Inserting a New User

```javascript
import { insertUser } from "./supabase.js"

const userData = {
  name: "John Doe",
  email: "john@example.com",
  isCareerCoach: "Yes",
  coachingExpertise: "Executive",
  yearsOfExperience: "5",
  consent: true,
  additionalContext: "Interested in AI tools for coaching",
}

const newUser = await insertUser(userData)
```

### Inserting a New Session

```javascript
import { insertSession } from "./supabase.js"

const sessionData = {
  userId: "user-uuid-here",
  filename: "meeting-notes.pdf",
  fileType: "application/pdf",
  fileSize: 1024000,
  extractedText: "Meeting notes content...",
}

const newSession = await insertSession(sessionData)
```

### Getting User for AI Personalization

```javascript
import { getUserByEmail } from "./supabase.js"

const user = await getUserByEmail("john@example.com")
// Use user data in AI prompts for personalization
```

## Security Notes

- The current setup uses permissive RLS policies for demo purposes
- In production, implement proper authentication and authorization
- Consider adding user authentication with Supabase Auth
- Restrict RLS policies based on user roles and ownership
