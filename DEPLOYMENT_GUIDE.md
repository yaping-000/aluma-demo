# 🚀 Aluma Demo Deployment Guide

This guide will help you deploy the Aluma demo to Vercel (frontend) and Railway (backend).

## 📋 **Prerequisites**

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
4. **Supabase Project**: Already configured
5. **OpenAI API Key**: For video/audio processing

## 🔧 **Step 1: Railway Backend Deployment**

### **1.1 Connect to Railway**

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `backend` folder

### **1.2 Set Environment Variables**

In Railway dashboard, add these environment variables:

```env
# Required
OPENAI_API_KEY=sk-your-openai-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
NODE_ENV=production

# Optional
GCP_CREDENTIALS_B64=your-base64-encoded-gcp-credentials
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
```

### **1.3 Deploy**

1. Railway will automatically detect the Node.js project
2. Click "Deploy" to start the deployment
3. Wait for deployment to complete
4. Copy your Railway URL (e.g., `https://aluma-backend-production.up.railway.app`)

## 🌐 **Step 2: Vercel Frontend Deployment**

### **2.1 Connect to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### **2.2 Set Environment Variables**

In Vercel dashboard, add:

```env
VITE_API_BASE_URL=https://your-railway-url.railway.app
```

### **2.3 Update Vercel Configuration**

Update `frontend/vercel.json` with your Railway URL:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-url.railway.app/$1"
    }
  ]
}
```

### **2.4 Deploy**

1. Click "Deploy" to start the deployment
2. Wait for deployment to complete
3. Copy your Vercel URL (e.g., `https://aluma-demo.vercel.app`)

## 🔗 **Step 3: Update CORS Settings**

### **3.1 Update Railway CORS**

In Railway, update the `FRONTEND_ORIGIN` environment variable with your Vercel URL:

```env
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
```

### **3.2 Redeploy Backend**

Redeploy the Railway backend to apply CORS changes.

## 🧪 **Step 4: Test Deployment**

### **4.1 Test Backend**

```bash
curl https://your-railway-url.railway.app/health
```

Should return: `{"status":"healthy",...}`

### **4.2 Test Frontend**

1. Visit your Vercel URL
2. Try the demo flow
3. Test file upload functionality
4. Verify onboarding form submission

## 🔄 **Step 5: Automated Deployment (Optional)**

### **5.1 Install CLI Tools**

```bash
npm install -g vercel @railway/cli
```

### **5.2 Link Projects**

```bash
# Link Railway project
cd backend
railway login
railway link

# Link Vercel project
cd ../frontend
vercel
```

### **5.3 Use Deployment Script**

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📊 **Monitoring & Maintenance**

### **Railway Monitoring**

- Check Railway dashboard for logs
- Monitor resource usage
- Set up alerts for downtime

### **Vercel Monitoring**

- Check Vercel dashboard for build status
- Monitor function execution
- Review analytics

## 🚨 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**

   - Ensure `FRONTEND_ORIGIN` is set correctly in Railway
   - Check that the URL matches exactly (including protocol)

2. **Environment Variables**

   - Verify all required variables are set
   - Check for typos in variable names

3. **Build Failures**

   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`

4. **API Errors**
   - Check Railway logs for backend errors
   - Verify API endpoints are working

### **Debug Commands**

```bash
# Test backend health
curl https://your-railway-url.railway.app/health

# Test API endpoint
curl -X POST https://your-railway-url.railway.app/onboarding \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","isCareerCoach":"No"}'
```

## 📚 **Additional Resources**

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🎯 **Success Checklist**

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Health check passes
- [ ] Demo flow works end-to-end
- [ ] File upload functionality works
- [ ] Onboarding form submits successfully

Your Aluma demo is now live! 🎉
