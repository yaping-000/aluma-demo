#!/bin/bash

# Update Vercel Configuration Script
# This script helps update the Vercel config with your Railway URL

echo "🔧 Vercel Configuration Update Script"
echo "====================================="

# Get Railway URL from user
echo ""
echo "Please enter your Railway URL (e.g., https://your-app.railway.app):"
read RAILWAY_URL

if [ -z "$RAILWAY_URL" ]; then
    echo "❌ Railway URL is required. Please run the script again."
    exit 1
fi

# Remove trailing slash if present
RAILWAY_URL=$(echo $RAILWAY_URL | sed 's/\/$//')

echo ""
echo "📝 Updating Vercel configuration..."

# Update vercel.json
sed -i.bak "s|https://your-railway-url.railway.app|$RAILWAY_URL|g" frontend/vercel.json

echo "✅ Updated frontend/vercel.json"
echo "✅ Railway URL set to: $RAILWAY_URL"

echo ""
echo "📋 Next Steps:"
echo "1. Commit and push these changes:"
echo "   git add frontend/vercel.json"
echo "   git commit -m 'Update Vercel config with Railway URL'"
echo "   git push origin main"
echo ""
echo "2. In Railway dashboard, add environment variable:"
echo "   FRONTEND_ORIGIN=https://your-vercel-app.vercel.app"
echo ""
echo "3. Test your deployment:"
echo "   - Visit your Vercel URL"
echo "   - Test the demo functionality"
echo "   - Check that API calls work"

echo ""
echo "🎯 Your app should now be fully connected!" 