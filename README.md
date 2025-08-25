# Aluma Demo

AI-powered content generation app with Google OAuth authentication via Supabase Auth.

## Features

- **File Upload & Processing**: Upload images (OCR via Google Vision), audio/video (Whisper transcription), or text files
- **AI Content Generation**: Generate LinkedIn posts, newsletters, and other content formats
- **Google OAuth Authentication**: Secure sign-in with Supabase Auth
- **User Profiles**: Store user preferences and business information
- **Responsive Design**: Works on desktop and mobile

## Architecture

- **Frontend**: Vite + React with Supabase Auth
- **Backend**: Node/Express API for file processing and AI generation
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with Google OAuth

## Quick Start

### Prerequisites

1. **Supabase Project**: Create a project at [supabase.com](https://supabase.com)
2. **Google OAuth**: Set up OAuth credentials in Google Cloud Console
3. **OpenAI API Key**: Get your API key from [platform.openai.com](https://platform.openai.com)

### Setup

1. **Backend**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

2. **Frontend**

```bash
cd frontend
npm install
cp env.production.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

3. **Database Setup**

- Run the SQL from `PROFILES_TABLE_MIGRATION.sql` in your Supabase SQL Editor
- Enable Google OAuth in Supabase Dashboard → Authentication → Providers

### Environment Variables

**Backend (.env):**

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
GCP_CREDENTIALS_B64=your-gcp-credentials-base64
```

**Frontend (.env.local):**

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:3000
```

## Testing

### API Testing

Use the form in the frontend or curl directly:

```bash
curl -F "file=@/path/to/note.jpg" http://localhost:3000/upload
curl -F "file=@/path/to/voice.m4a" http://localhost:3000/upload
```

### Authentication Testing

1. Click "Sign In" in the navigation
2. Complete Google OAuth flow
3. Verify user profile is created in Supabase
4. Test sign out functionality

## Deployment

### Backend (Railway)

- Deploy to Railway with environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `OPENAI_API_KEY`
  - `GCP_CREDENTIALS_B64`

### Frontend (Vercel)

- Deploy to Vercel with environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_API_BASE_URL` (your Railway backend URL)

## Documentation

- [Supabase Auth Setup Guide](./SUPABASE_AUTH_SETUP.md) - Complete authentication setup
- [Migration Guide](./MIGRATION_GUIDE.md) - Database migration instructions
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Deployment instructions

## Architecture Benefits

- **Simplified Authentication**: No custom OAuth routes, handled by Supabase
- **Better Security**: Row Level Security, JWT tokens, automatic session management
- **Scalable**: Supabase handles authentication scaling
- **Developer Friendly**: Minimal configuration, built-in features
