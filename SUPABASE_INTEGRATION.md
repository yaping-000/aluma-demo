# Supabase Integration for Aluma Demo

This document outlines the complete Supabase integration for the Aluma demo app, including database setup, API integration, and usage examples.

## 🗄️ Database Schema

### Users Table

Stores onboarding form data for AI prompt personalization and demo analytics.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    is_career_coach BOOLEAN NOT NULL,
    coaching_expertise TEXT, -- NULL for non-career coaches
    profession TEXT, -- NULL for career coaches
    years_of_experience INTEGER, -- Optional field
    consent BOOLEAN DEFAULT true,
    additional_context TEXT, -- Optional field for user notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Sessions Table

Tracks file processing metadata and extracted text for analytics and user history.

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL, -- MIME type
    file_size INTEGER NOT NULL, -- Size in bytes
    extracted_text TEXT, -- Optional: text extracted from file
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Setup Instructions

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Wait for the project to be set up

### 2. Get Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" (this is your `SUPABASE_URL`)
4. Copy the "anon public" key (this is your `SUPABASE_ANON_KEY`)

### 3. Set Environment Variables

Add to your `backend/.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `backend/schema.sql`
4. Click "Run" to create the tables

## 🚀 API Integration

### Backend Endpoints

#### POST `/onboarding`

Saves user onboarding data to Supabase.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "isCareerCoach": "Yes",
  "coachingExpertise": "Executive",
  "yearsOfExperience": "5",
  "consent": true,
  "additionalContext": "Interested in AI tools for coaching"
}
```

**Response:**

```json
{
  "success": true,
  "userId": "uuid-here",
  "message": "User data saved successfully"
}
```

#### POST `/upload` (Enhanced)

Now includes user ID for session tracking.

**Form Data:**

- `file`: Uploaded file
- `userId`: (Optional) User UUID for session tracking

#### POST `/generate` (Enhanced)

Now uses Supabase user data for AI personalization.

**Request Body:**

```json
{
  "content": "Meeting notes content...",
  "formats": ["linkedin", "newsletter"],
  "userContext": {
    /* onboarding data */
  },
  "userEmail": "john@example.com" // For Supabase lookup
}
```

## 📊 Database Operations

### User Management

#### Insert New User

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

#### Get User by Email

```javascript
import { getUserByEmail } from "./supabase.js"

const user = await getUserByEmail("john@example.com")
// Returns user data for AI personalization
```

### Session Management

#### Insert New Session

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

#### Get User Sessions

```javascript
import { getUserSessions } from "./supabase.js"

const sessions = await getUserSessions("user-uuid-here")
// Returns array of user's sessions
```

### Analytics

#### Get Demo Analytics

```javascript
import { getDemoAnalytics } from "./supabase.js"

const analytics = await getDemoAnalytics()
// Returns: { totalUsers, totalSessions, careerCoaches, nonCareerCoaches }
```

## 🎯 AI Prompt Personalization

The integration enhances AI content generation by:

1. **User Context**: Automatically includes user background in prompts
2. **Professional Expertise**: Tailors content to user's field/niche
3. **Experience Level**: Adjusts recommendations based on years of experience
4. **Session History**: Can reference previous sessions for continuity

### Example Enhanced Prompt

```
User Context:
- Name: John Doe
- Career Coach: Yes
- Coaching Expertise: Executive
- Years of Experience: 5
- Additional Context: Interested in AI tools for coaching

Create an engaging LinkedIn post based on this content. Consider the user's background and expertise when crafting the message...
```

## 📈 Demo Analytics

The database supports comprehensive demo analytics:

- **User Demographics**: Career coaches vs other professionals
- **Usage Patterns**: File types, session frequency
- **Content Generation**: Most popular output formats
- **User Engagement**: Session duration, content quality

## 🔒 Security Considerations

### Current Setup (Demo)

- Permissive RLS policies for demo purposes
- All operations allowed for simplicity

### Production Recommendations

1. **Authentication**: Implement Supabase Auth
2. **Authorization**: Restrict RLS policies by user ownership
3. **Data Privacy**: Implement data retention policies
4. **API Security**: Add rate limiting and validation

### RLS Policies for Production

```sql
-- Example: Users can only access their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);
```

## 🛠️ Troubleshooting

### Common Issues

1. **Missing Environment Variables**

   - Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
   - Check `.env` file in backend directory

2. **Database Connection Errors**

   - Verify Supabase project is active
   - Check network connectivity
   - Ensure RLS policies allow operations

3. **Schema Errors**
   - Run `schema.sql` in Supabase SQL Editor
   - Check for existing tables that might conflict

### Debug Mode

Enable detailed logging by setting:

```env
DEBUG=true
```

## 📝 Usage Examples

### Complete User Flow

1. User fills onboarding form
2. Data saved to `users` table
3. User uploads file/records audio
4. Session data saved to `sessions` table
5. AI generates personalized content using user context
6. Analytics updated for demo insights

### Frontend Integration

```javascript
// Save onboarding data
const response = await fetch("/onboarding", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(onboardingData),
})

// Store user ID for session tracking
localStorage.setItem("alumaUserId", response.data.userId)

// Upload file with user tracking
const form = new FormData()
form.append("file", file)
form.append("userId", localStorage.getItem("alumaUserId"))
```

This integration provides a complete data layer for the Aluma demo, supporting both user personalization and demo analytics while maintaining security and scalability.
