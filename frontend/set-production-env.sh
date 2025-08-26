#!/bin/bash

# Script to set up production environment variables for Aluma demo
# This script helps configure the VITE_API_BASE_URL for production deployment

echo "🚀 Aluma Demo - Production Environment Setup"
echo "=============================================="

# Check if Railway URL is provided as argument
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Railway backend URL"
    echo "Usage: ./set-production-env.sh https://your-app.railway.app"
    echo ""
    echo "To get your Railway URL:"
    echo "1. Go to your Railway dashboard"
    echo "2. Copy the URL from your deployed backend service"
    echo "3. Run this script with that URL"
    exit 1
fi

RAILWAY_URL=$1

# Remove trailing slash if present
RAILWAY_URL=$(echo $RAILWAY_URL | sed 's/\/$//')

echo "✅ Setting up environment for Railway URL: $RAILWAY_URL"
echo ""

# Create .env.production file
cat > .env.production << EOF
# Production environment variables for Aluma demo
# Generated on $(date)

# Backend API URL
VITE_API_BASE_URL=$RAILWAY_URL

# App configuration
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0

# Note: Add your Supabase credentials manually:
# VITE_SUPABASE_URL=your-supabase-project-url
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
EOF

echo "✅ Created .env.production file"
echo ""
echo "📝 Next steps:"
echo "1. Add your Supabase credentials to .env.production"
echo "2. Deploy to Vercel with this configuration"
echo "3. Set the same VITE_API_BASE_URL in your Vercel environment variables"
echo ""
echo "🔗 Railway URL configured: $RAILWAY_URL"
echo "🎉 Environment setup complete!"
