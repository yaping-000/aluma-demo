#!/bin/bash

# Quick Deploy Script for Aluma Demo
# This script provides quick deployment commands

echo "🚀 Aluma Demo Quick Deploy"
echo "=========================="
echo ""

echo "📋 Prerequisites:"
echo "1. GitHub repository with your code"
echo "2. Railway account (railway.app)"
echo "3. Vercel account (vercel.com)"
echo "4. Environment variables ready"
echo ""

echo "🔧 Quick Deploy Steps:"
echo "======================"
echo ""

echo "1. 🚂 Deploy Backend to Railway:"
echo "   - Go to railway.app"
echo "   - New Project → Deploy from GitHub"
echo "   - Select your repo and 'backend' folder"
echo "   - Add environment variables:"
echo "     OPENAI_API_KEY=sk-your-key"
echo "     SUPABASE_URL=https://your-project.supabase.co"
echo "     SUPABASE_ANON_KEY=your-key"
echo "     NODE_ENV=production"
echo "   - Deploy and copy the URL"
echo ""

echo "2. 🌐 Deploy Frontend to Vercel:"
echo "   - Go to vercel.com"
echo "   - New Project → Import GitHub repo"
echo "   - Select 'frontend' folder"
echo "   - Framework: Vite"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo "   - Deploy and copy the URL"
echo ""

echo "3. 🔗 Update Configuration:"
echo "   - Update frontend/vercel.json with Railway URL"
echo "   - Set FRONTEND_ORIGIN in Railway with Vercel URL"
echo "   - Redeploy both services"
echo ""

echo "4. 🧪 Test:"
echo "   - Backend: curl https://your-railway-url/health"
echo "   - Frontend: Visit your Vercel URL"
echo ""

echo "📚 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
echo ""

echo "🎯 Ready to deploy! Follow the steps above." 