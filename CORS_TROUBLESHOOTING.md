# 🚨 CORS Error Troubleshooting Guide

## **Current Issue**

You're getting CORS errors when calling `https://aluma-demo-production.up.railway.app/upload` from your Vercel frontend.

## **Quick Fix**

### **Step 1: Find Your Vercel URL**

Your Vercel frontend URL should look like:

- `https://aluma-demo.vercel.app`
- `https://your-app-name.vercel.app`

### **Step 2: Update Railway Environment Variable**

1. Go to [Railway Dashboard](https://railway.app)
2. Select your backend project
3. Go to **Variables** tab
4. Add/update this variable:

```env
FRONTEND_ORIGIN=https://your-vercel-url.vercel.app
```

**Replace `your-vercel-url.vercel.app` with your actual Vercel domain**

### **Step 3: Redeploy**

Railway will automatically redeploy with the new CORS settings.

## **Test the Fix**

Run this command to test your CORS configuration:

```bash
./test-cors.sh https://aluma-demo-production.up.railway.app
```

## **Common Issues**

### **1. Wrong Vercel URL**

- Make sure you're using the correct Vercel domain
- Check for typos in the URL
- Include the `https://` protocol

### **2. Environment Variable Not Set**

- Verify `FRONTEND_ORIGIN` is set in Railway
- Check that the value matches your Vercel URL exactly

### **3. Backend Not Redeployed**

- Railway should auto-redeploy when you change environment variables
- Check Railway logs to confirm deployment

### **4. Multiple Frontend Domains**

If you have multiple domains, separate them with commas:

```env
FRONTEND_ORIGIN=https://domain1.vercel.app,https://domain2.vercel.app
```

## **Debug Steps**

### **Check Browser Console**

1. Open browser dev tools
2. Go to Network tab
3. Try the upload/onboarding
4. Look for failed requests with CORS errors

### **Test Backend Directly**

```bash
# Test health endpoint
curl https://aluma-demo-production.up.railway.app/health

# Test CORS preflight
curl -X OPTIONS https://aluma-demo-production.up.railway.app/upload \
  -H "Origin: https://your-vercel-url.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

### **Expected Response**

You should see:

```
< Access-Control-Allow-Origin: https://your-vercel-url.vercel.app
< Access-Control-Allow-Methods: POST
< Access-Control-Allow-Headers: Content-Type
```

## **Still Not Working?**

1. **Check Railway Logs**: Look for CORS-related errors
2. **Verify Environment Variables**: Make sure they're set correctly
3. **Clear Browser Cache**: Hard refresh (Ctrl+F5)
4. **Test with Different Browser**: Try incognito mode

## **Emergency Fix**

If you need a quick fix for testing, you can temporarily allow all origins in Railway:

```env
FRONTEND_ORIGIN=*
```

**⚠️ Warning**: This is not secure for production, but useful for debugging.

---

**Need Help?** Check the Railway logs and browser console for specific error messages.
