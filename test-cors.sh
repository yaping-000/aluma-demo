#!/bin/bash

# Script to test CORS configuration for Aluma demo
# This helps verify that the backend is properly configured for CORS

echo "🔧 Aluma Demo - CORS Configuration Test"
echo "========================================"

# Check if Railway URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Railway backend URL"
    echo "Usage: ./test-cors.sh https://your-app.railway.app"
    echo ""
    echo "Example: ./test-cors.sh https://aluma-demo-production.up.railway.app"
    exit 1
fi

RAILWAY_URL=$1
# Remove trailing slash if present
RAILWAY_URL=$(echo $RAILWAY_URL | sed 's/\/$//')

echo "🔗 Testing Railway URL: $RAILWAY_URL"
echo ""

# Test 1: Health check
echo "📋 Test 1: Health Check"
echo "curl $RAILWAY_URL/health"
curl -s "$RAILWAY_URL/health" | jq . 2>/dev/null || curl -s "$RAILWAY_URL/health"
echo ""
echo ""

# Test 2: CORS preflight check
echo "📋 Test 2: CORS Preflight Check"
echo "curl -X OPTIONS $RAILWAY_URL/upload -H 'Origin: https://test.vercel.app' -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: Content-Type' -v"
curl -X OPTIONS "$RAILWAY_URL/upload" \
  -H "Origin: https://test.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -E "(Access-Control|HTTP|Origin)"
echo ""
echo ""

# Test 3: Test with actual Vercel origin
echo "📋 Test 3: Test with Vercel Origin"
echo "Please provide your Vercel frontend URL:"
read -p "Vercel URL (e.g., https://aluma-demo.vercel.app): " VERCEL_URL

if [ -n "$VERCEL_URL" ]; then
    echo "Testing CORS with your Vercel URL: $VERCEL_URL"
    curl -X OPTIONS "$RAILWAY_URL/upload" \
      -H "Origin: $VERCEL_URL" \
      -H "Access-Control-Request-Method: POST" \
      -H "Access-Control-Request-Headers: Content-Type" \
      -v 2>&1 | grep -E "(Access-Control|HTTP|Origin)"
else
    echo "⚠️  Skipping Vercel origin test"
fi

echo ""
echo ""

# Test 4: Check current CORS configuration
echo "📋 Test 4: Current CORS Configuration"
echo "The backend should allow requests from the FRONTEND_ORIGIN environment variable."
echo ""
echo "To fix CORS issues:"
echo "1. Go to Railway dashboard"
echo "2. Add/update FRONTEND_ORIGIN environment variable:"
echo "   FRONTEND_ORIGIN=$VERCEL_URL"
echo "3. Redeploy the backend"
echo ""

echo "🎯 Expected Results:"
echo "- Health check should return JSON with status: 'healthy'"
echo "- CORS preflight should return Access-Control-Allow-Origin header"
echo "- If CORS is not working, you'll see 'Access-Control-Allow-Origin' missing"
echo ""
echo "✅ Test complete!"
