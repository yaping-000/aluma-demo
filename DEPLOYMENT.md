# 🚀 Aluma Demo Deployment Guide

This guide will help you deploy the Aluma demo app to handle 1000+ concurrent users with high scalability and reliability.

## 🎯 **Recommended Platform: Vercel + Railway**

**Why this combination:**

- **Vercel**: Best-in-class frontend hosting with automatic scaling
- **Railway**: Reliable backend hosting with auto-scaling
- **Cost-effective**: Free tiers available, pay-as-you-scale
- **Performance**: Global CDN, edge functions, auto-scaling

## 📋 **Pre-Deployment Checklist**

### ✅ **Required Accounts**

- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Railway account (free tier available)
- [ ] Supabase account (free tier available)
- [ ] OpenAI API key

### ✅ **Required API Keys**

- [ ] OpenAI API key
- [ ] Supabase URL and anon key
- [ ] Google Cloud Vision credentials (optional)

## 🚂 **Step 1: Deploy Backend to Railway**

### 1.1 **Create Railway Account**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### 1.2 **Deploy Backend**

1. Click "Deploy from GitHub repo"
2. Select your repository
3. Choose the `backend` folder as the source
4. Railway will auto-detect Node.js and deploy

### 1.3 **Configure Environment Variables**

In Railway dashboard, add these variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Node Environment
NODE_ENV=production
PORT=3000
```

### 1.4 **Get Railway URL**

- Railway will provide: `https://your-app.railway.app`
- Copy this URL for frontend configuration

## 🌐 **Step 2: Deploy Frontend to Vercel**

### 2.1 **Create Vercel Account**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Create a new project

### 2.2 **Deploy Frontend**

1. Import your GitHub repository
2. Select the `frontend` folder
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 **Set Environment Variables**

In Vercel dashboard, add:

```env
VITE_API_BASE_URL=https://your-railway-url.railway.app
```

### 2.4 **Get Vercel URL**

- Vercel will provide: `https://your-app.vercel.app`
- Copy this URL for backend CORS configuration

## 🔗 **Step 3: Connect Frontend and Backend**

### 3.1 **Update Railway CORS**

In Railway dashboard, update the `FRONTEND_ORIGIN` environment variable:

```env
FRONTEND_ORIGIN=https://your-app.vercel.app
```

### 3.2 **Update Vercel Configuration**

Edit `frontend/vercel.json` and update the Railway URL:

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

## 🧪 **Step 4: Test Deployment**

### 4.1 **Health Check**

Test backend health:

```bash
curl https://your-railway-url.railway.app/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2025-08-24T20:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

### 4.2 **Frontend Test**

1. Visit your Vercel URL
2. Complete the onboarding form
3. Test file upload and content generation
4. Verify Supabase data storage

## 📊 **Step 5: Performance Optimization**

### 5.1 **Railway Scaling**

- **Instance Type**: Standard (auto-scales)
- **Memory**: 512MB (sufficient for demo)
- **Auto-scaling**: Enabled
- **Min instances**: 1
- **Max instances**: 10 (for demo day)

### 5.2 **Vercel Optimization**

- **Edge Functions**: Enabled
- **Global CDN**: Automatic
- **Image Optimization**: Enabled
- **Analytics**: Optional

## 🔒 **Step 6: Security Configuration**

### 6.1 **CORS Settings**

- Railway: Specific origin (your Vercel URL)
- Vercel: Security headers enabled

### 6.2 **Environment Variables**

- Never commit API keys
- Use platform-specific secure storage
- Rotate keys regularly

## 📈 **Step 7: Monitoring Setup**

### 7.1 **Railway Monitoring**

- CPU usage
- Memory usage
- Request count
- Response times
- Error rates

### 7.2 **Vercel Analytics**

- Page views
- Performance metrics
- Error tracking
- User analytics

## 🚨 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**

   - Check `FRONTEND_ORIGIN` in Railway
   - Verify Vercel URL is correct

2. **Build Failures**

   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **API Errors**

   - Check environment variables
   - Verify API keys are valid
   - Check Railway logs

4. **Database Connection**
   - Verify Supabase credentials
   - Check network connectivity

### **Performance Issues**

1. **Slow Response Times**

   - Check Railway instance scaling
   - Monitor API usage limits
   - Optimize database queries

2. **Memory Issues**
   - Increase Railway memory allocation
   - Optimize file upload handling
   - Monitor memory usage

## 💰 **Cost Estimation**

### **Demo Day Costs (1000+ users)**

**Railway:**

- Standard instance: $5-10/month
- Auto-scaling: $5-15 additional
- **Total**: $10-25 for demo day

**Vercel:**

- Hobby plan: Free
- Pro plan: $20/month (if needed)
- **Total**: $0-20

**Supabase:**

- Free tier: 50,000 monthly active users
- Pro plan: $25/month (if needed)
- **Total**: $0-25

**Estimated Total**: $10-70 for demo day

## 🎯 **Demo Day Preparation**

### **Pre-Demo Checklist**

- [ ] Load test with 100+ concurrent users
- [ ] Monitor resource usage
- [ ] Set up alerts for high usage
- [ ] Prepare backup deployment
- [ ] Test all features end-to-end

### **During Demo**

- [ ] Monitor Railway dashboard
- [ ] Watch Vercel analytics
- [ ] Check Supabase usage
- [ ] Have backup plan ready

## 📚 **Additional Resources**

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🆘 **Support**

If you encounter issues:

1. Check the troubleshooting section
2. Review platform documentation
3. Check application logs
4. Contact platform support

---

**🎉 Your Aluma demo is now ready for 1000+ concurrent users!**
