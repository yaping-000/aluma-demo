# Supabase Auth Setup Guide

## 🔐 **Simplified Authentication with Supabase Auth**

This guide will help you set up Google OAuth authentication using Supabase Auth directly in the frontend, eliminating the need for custom Express OAuth routes.

## 📋 **Prerequisites**

1. **Supabase Project** (already configured)
2. **Google Cloud Console Account** (for OAuth credentials)

## 🚀 **Step-by-Step Setup**

### **1. Enable Google OAuth in Supabase Dashboard**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click **Enable**
5. Configure Google OAuth:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
   - **Redirect URL**: `https://your-project-ref.supabase.co/auth/v1/callback`

### **2. Get Google OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **Google OAuth2 API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: "Aluma"
   - User support email: your email
   - Developer contact information: your email
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`

### **3. Create Profiles Table**

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    business_name TEXT,
    ideal_client TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add comments
COMMENT ON TABLE public.profiles IS 'User profiles linked to auth.users';
COMMENT ON COLUMN public.profiles.business_name IS 'Business/organization name';
COMMENT ON COLUMN public.profiles.ideal_client IS 'Ideal client/audience description';
```

### **4. Environment Variables**

#### **Frontend (.env.local or .env.production):**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend API URL
VITE_API_BASE_URL=https://aluma-demo-production.up.railway.app
```

#### **Backend (.env):**

```env
# Remove these (no longer needed):
# GOOGLE_CLIENT_ID
# GOOGLE_CLIENT_SECRET
# SESSION_SECRET

# Keep these:
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### **5. Install Dependencies**

The Supabase client is already installed in the frontend:

```bash
cd frontend
npm install @supabase/supabase-js
```

### **6. Test the Setup**

1. **Start the frontend**:

   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Google OAuth flow**:
   - Go to your frontend
   - Click "Sign In" in the navigation
   - You should be redirected to Google OAuth
   - After authentication, you should be redirected back to your app

## 🎯 **How It Works**

### **Authentication Flow:**

1. **User clicks "Sign In"** → `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. **Supabase redirects to Google** → User authorizes Aluma
3. **Google redirects back to Supabase** → Supabase creates/updates user in `auth.users`
4. **Supabase triggers database function** → Creates profile in `public.profiles`
5. **User is logged in** → Session managed by Supabase

### **User Data:**

- **Profile info** (name, email, avatar) comes from `user.user_metadata`
- **Custom fields** (business_name, ideal_client) stored in `public.profiles`
- **Session management** handled entirely by Supabase

## 🔒 **Security Features**

- **Row Level Security (RLS)** on profiles table
- **JWT tokens** for authentication
- **Automatic session refresh**
- **Secure OAuth flow** handled by Supabase

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"Invalid redirect URI" error**:

   - Check that your redirect URI exactly matches what's configured in Google Cloud Console
   - Ensure it matches: `https://your-project-ref.supabase.co/auth/v1/callback`

2. **"Client ID not found" error**:

   - Verify your Google OAuth credentials are correctly set in Supabase Dashboard
   - Check that the OAuth 2.0 client is properly configured

3. **Profile not created**:

   - Check that the database function and trigger are created correctly
   - Verify RLS policies are in place

4. **Environment variables not working**:
   - Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
   - Restart your development server after changing environment variables

### **Testing Commands:**

```bash
# Check if Supabase client is working
# Open browser console and run:
supabase.auth.getSession()

# Check if user is authenticated
supabase.auth.getUser()
```

## 📱 **Mobile Considerations**

- **Responsive design** for OAuth popups
- **Deep linking** for mobile OAuth flows
- **App store compliance** for mobile apps

## 🚀 **Benefits of This Approach**

1. **Simplified backend** - No custom OAuth routes needed
2. **Better security** - Handled by Supabase experts
3. **Automatic session management** - No custom session handling
4. **Built-in RLS** - Row Level Security out of the box
5. **Easy scaling** - Supabase handles authentication scaling

## 📚 **Next Steps**

1. ✅ Set up Google OAuth in Supabase Dashboard
2. ✅ Create profiles table
3. ✅ Configure environment variables
4. 🔄 Test authentication flow
5. 🔄 Add profile management features
6. 🔄 Implement protected routes
7. 🔄 Add user dashboard functionality
