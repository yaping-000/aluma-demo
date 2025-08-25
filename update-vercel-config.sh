#!/bin/bash

# Script to update Vercel configuration with the correct backend URL
# Usage: ./update-vercel-config.sh <your-railway-backend-url>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <your-railway-backend-url>"
    echo "Example: $0 https://aluma-backend-production.up.railway.app"
    exit 1
fi

BACKEND_URL=$1

# Update vercel.json with the correct backend URL
sed -i.bak "s|https://aluma-backend-production.up.railway.app|$BACKEND_URL|g" frontend/vercel.json

echo "✅ Updated vercel.json with backend URL: $BACKEND_URL"
echo "📝 Don't forget to:"
echo "   1. Deploy your backend to Railway first"
echo "   2. Update the URL in vercel.json with your actual Railway URL"
echo "   3. Deploy your frontend to Vercel"
echo "   4. Run the migration.sql in your Supabase SQL Editor" 