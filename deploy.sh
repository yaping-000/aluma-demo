#!/bin/bash

# Aluma Demo Deployment Script
# This script helps prepare and deploy the app to Vercel + Railway

echo "🚀 Aluma Demo Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Git remote not set. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/aluma-demo.git"
    exit 1
fi

echo "✅ Git repository ready"

# Check environment files
echo ""
echo "📋 Environment Setup Check:"
echo "=========================="

if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Please create it with:"
    echo "   - OPENAI_API_KEY"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_ANON_KEY"
    echo "   - GCP_CREDENTIALS_B64 (optional)"
else
    echo "✅ backend/.env found"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env not found. Please create it with:"
    echo "   - VITE_API_BASE_URL (will be updated after Railway deployment)"
else
    echo "✅ frontend/.env found"
fi

echo ""
echo "🔧 Deployment Steps:"
echo "==================="
echo ""
echo "1. 🚂 Deploy Backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Connect your GitHub repository"
echo "   - Select 'backend' folder"
echo "   - Set environment variables (see backend/production-setup.md)"
echo "   - Deploy and get your Railway URL"
echo ""
echo "2. 🌐 Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Connect your GitHub repository"
echo "   - Select 'frontend' folder"
echo "   - Set environment variables:"
echo "     VITE_API_BASE_URL=https://your-railway-url.railway.app/upload"
echo "   - Deploy"
echo ""
echo "3. 🔗 Update Configuration:"
echo "   - Update frontend/vercel.json with your Railway URL"
echo "   - Update Railway CORS settings with your Vercel URL"
echo ""
echo "4. 🧪 Test Deployment:"
echo "   - Test health check: https://your-railway-url.railway.app/health"
echo "   - Test frontend: https://your-app.vercel.app"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - backend/production-setup.md"
echo "   - SUPABASE_INTEGRATION.md"
echo ""
echo "🎯 Ready to deploy! Follow the steps above." 