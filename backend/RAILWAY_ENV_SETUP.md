# Railway Environment Variables Setup

## 🚀 **Required for Demo Deployment**

### **1. OpenAI API Key (Required)**

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

- Get from: https://platform.openai.com/api-keys
- Required for content generation

### **2. Node Environment (Required)**

```env
NODE_ENV=production
PORT=3000
```

## 🔧 **Optional (for full functionality)**

### **3. Supabase (Optional - Demo will work without)**

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

- Only needed if you want analytics and user tracking
- Demo will work without these variables

### **4. Google Cloud Vision (Optional)**

```env
GCP_CREDENTIALS_B64=your-base64-encoded-credentials
```

- Only needed for image text extraction
- Demo will work without this variable

### **5. Frontend Origin (Optional)**

```env
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
```

- Set this after deploying frontend to Vercel
- For CORS configuration

## 📋 **How to Set in Railway**

1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to "Variables" tab
4. Add each variable with its value
5. Click "Save" and redeploy

## ✅ **Minimum Setup for Demo**

For the demo to work, you only need:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=production
PORT=3000
```

## 🎯 **Demo Day Setup**

For demo day with 1000+ users, add:

```env
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
```

## 🚨 **Troubleshooting**

### **If deployment still fails:**

1. Check that `OPENAI_API_KEY` is set correctly
2. Verify the API key is valid and has credits
3. Check Railway logs for specific error messages
4. Ensure all required variables are set

### **If you see Supabase warnings:**

- These are normal if you haven't set Supabase variables
- The demo will work without Supabase
- Analytics will be disabled but functionality remains
