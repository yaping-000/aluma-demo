# 🔧 CORS Fix for Aluma Demo

## 🚨 **Issue Fixed**

The production deployment was experiencing CORS errors because the frontend components were making API calls to hardcoded `http://localhost:3000` URLs instead of using the production backend URL.

## ✅ **Changes Made**

### 1. **Created API Utility (`frontend/src/lib/api.js`)**

- Centralized API base URL configuration
- Environment-aware URL handling
- Automatic fallback to production URL

### 2. **Updated All Components**

Fixed hardcoded localhost URLs in:

- `ContactUs.jsx` - `/onboarding` endpoint
- `Onboarding.jsx` - `/onboarding` endpoint
- `Demo.jsx` - `/upload` and `/generate` endpoints
- `FileUpload.jsx` - `/upload` endpoint
- `Results.jsx` - `/beta-consent` endpoint

### 3. **Environment Configuration**

- Updated `env.production.example` with correct API URL format
- Created `set-production-env.sh` script for easy setup
- Fixed deployment guide documentation

## 🚀 **How to Deploy the Fix**

### **Step 1: Update Vercel Environment Variables**

In your Vercel dashboard, set:

```env
VITE_API_BASE_URL=https://your-railway-backend.railway.app
```

**Important**: Remove `/upload` from the URL if it was previously included.

### **Step 2: Redeploy Frontend**

1. Push the updated code to GitHub
2. Vercel will automatically redeploy
3. Or manually trigger a redeploy in Vercel dashboard

### **Step 3: Verify the Fix**

1. Visit your production frontend URL
2. Try the onboarding form submission
3. Test file upload functionality
4. Verify content generation works

## 🔍 **Testing the Fix**

### **Local Development**

```bash
# Start backend
cd backend
npm start

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### **Production Testing**

```bash
# Test backend health
curl https://your-railway-url.railway.app/health

# Test onboarding endpoint
curl -X POST https://your-railway-url.railway.app/onboarding \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","isCareerCoach":"No"}'
```

## 📋 **Environment Variables Checklist**

### **Vercel (Frontend)**

- [ ] `VITE_API_BASE_URL=https://your-railway-url.railway.app`
- [ ] `VITE_SUPABASE_URL=your-supabase-url`
- [ ] `VITE_SUPABASE_ANON_KEY=your-supabase-key`

### **Railway (Backend)**

- [ ] `FRONTEND_ORIGIN=https://your-vercel-url.vercel.app`
- [ ] `OPENAI_API_KEY=your-openai-key`
- [ ] `SUPABASE_URL=your-supabase-url`
- [ ] `SUPABASE_ANON_KEY=your-supabase-key`

## 🛠 **Troubleshooting**

### **Still Getting CORS Errors?**

1. **Check Railway CORS settings**:

   - Ensure `FRONTEND_ORIGIN` is set correctly
   - URL must match exactly (including protocol)

2. **Verify API Base URL**:

   - Check browser console for actual URLs being called
   - Ensure no `/upload` suffix in `VITE_API_BASE_URL`

3. **Check Network Tab**:
   - Look for failed requests in browser dev tools
   - Verify the correct backend URL is being used

### **Common Issues**

1. **Environment Variable Not Set**:

   - Check Vercel dashboard for `VITE_API_BASE_URL`
   - Redeploy after setting environment variables

2. **Wrong URL Format**:

   - Should be: `https://your-app.railway.app`
   - Not: `https://your-app.railway.app/upload`

3. **Cache Issues**:
   - Clear browser cache
   - Hard refresh (Ctrl+F5 / Cmd+Shift+R)

## 📚 **Code Changes Summary**

### **Before (Broken)**

```javascript
const response = await fetch("http://localhost:3000/onboarding", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
})
```

### **After (Fixed)**

```javascript
import { apiCall } from "../lib/api"

const data = await apiCall("/onboarding", {
  method: "POST",
  body: JSON.stringify(data),
})
```

## 🎯 **Success Indicators**

- ✅ Onboarding form submits without CORS errors
- ✅ File uploads work in production
- ✅ Content generation completes successfully
- ✅ No console errors related to localhost URLs
- ✅ All API calls use the correct production backend URL

## 📞 **Support**

If you continue to experience issues:

1. Check the browser console for specific error messages
2. Verify all environment variables are set correctly
3. Test the backend endpoints directly with curl
4. Check Railway logs for backend errors

---

**🎉 The CORS issue should now be resolved!**
