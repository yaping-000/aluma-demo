#!/bin/bash

echo "🚀 Production Environment Variables Setup"
echo "=========================================="
echo ""

echo "📋 Frontend Variables (Vercel):"
echo "VITE_SUPABASE_URL=https://poondlknkfsyogkrrwaf.supabase.co"
echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb25kbGtuZmtzeW9na3Jyd2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjQ5NDUsImV4cCI6MjA3MTY0MDk0NX0.k6aAL3WsERVOC8nFc9HwWqonQk3G91v0_8HZN7CgmyI"
echo "VITE_API_BASE_URL=https://aluma-demo-production.up.railway.app"
echo ""

echo "🔧 Backend Variables (Railway):"
echo "SUPABASE_URL=https://poondlknkfsyogkrrwaf.supabase.co"
echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb25kbGtuZmtzeW9na3Jyd2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjQ5NDUsImV4cCI6MjA3MTY0MDk0NX0.k6aAL3WsERVOC8nFc9HwWqonQk3G91v0_8HZN7CgmyI"
echo "OPENAI_API_KEY=your-openai-api-key"
echo "GCP_CREDENTIALS_B64=your-gcp-credentials-base64"
echo "PORT=3000"
echo "NODE_ENV=production"
echo ""

echo "🔗 Google OAuth Redirect URIs to add:"
echo "https://poondlknkfsyogkrrwaf.supabase.co/auth/v1/callback"
echo "https://your-vercel-domain.vercel.app/auth-success"
echo ""

echo "✅ Steps to complete:"
echo "1. Set frontend variables in Vercel dashboard"
echo "2. Set backend variables in Railway dashboard"
echo "3. Add redirect URIs in Google Cloud Console"
echo "4. Update OAuth consent screen name to 'Aluma'"
echo "5. Deploy both frontend and backend"
echo "" 