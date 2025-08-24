# Production Deployment Setup for Railway

## 🚀 Railway Backend Deployment

### 1. **Create Railway Account**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### 2. **Deploy Backend**

1. Connect your GitHub repository
2. Select the `backend` folder as the source
3. Railway will automatically detect Node.js and deploy

### 3. **Set Environment Variables**

In Railway dashboard, add these environment variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Cloud Vision (if using)
GCP_CREDENTIALS_B64=your_base64_encoded_credentials

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Frontend Origin (update with your Vercel URL)
FRONTEND_ORIGIN=https://your-app.vercel.app

# Node Environment
NODE_ENV=production
PORT=3000
```

### 4. **Database Setup**

**Option A: Use Supabase (Recommended)**

- Keep your existing Supabase setup
- Update environment variables with production Supabase credentials

**Option B: Use Railway PostgreSQL**

- Add PostgreSQL service in Railway
- Update connection string in environment variables
- Run migration scripts

### 5. **Get Backend URL**

- Railway will provide a URL like: `https://your-app.railway.app`
- Copy this URL for frontend configuration

## 📊 Performance Optimization

### **Railway Configuration**

- **Instance Type**: Standard (auto-scales)
- **Memory**: 512MB (sufficient for demo)
- **CPU**: 0.5 vCPU (auto-scales)

### **Scaling Settings**

- **Auto-scaling**: Enabled
- **Min instances**: 1
- **Max instances**: 10 (for demo day)

### **Health Checks**

- **Path**: `/health`
- **Interval**: 30 seconds
- **Timeout**: 5 seconds

## 🔒 Security Considerations

### **CORS Configuration**

- Update `FRONTEND_ORIGIN` with your Vercel domain
- Use specific origins, not wildcards in production

### **Rate Limiting**

- Consider adding rate limiting for demo day
- Railway handles basic DDoS protection

### **Environment Variables**

- Never commit API keys to repository
- Use Railway's secure environment variable storage

## 📈 Monitoring

### **Railway Metrics**

- CPU usage
- Memory usage
- Request count
- Response times

### **Health Check**

- Endpoint: `https://your-app.railway.app/health`
- Returns: Status, uptime, version

## 🚨 Troubleshooting

### **Common Issues**

1. **Build fails**: Check Node.js version compatibility
2. **Environment variables**: Verify all required vars are set
3. **Database connection**: Check Supabase/Railway DB credentials
4. **CORS errors**: Update FRONTEND_ORIGIN with correct Vercel URL

### **Logs**

- View logs in Railway dashboard
- Real-time log streaming available
- Error tracking and alerting

## 💰 Cost Estimation

### **Railway Pricing (Demo Day)**

- **Free tier**: $5/month credit
- **Standard instance**: ~$5-10/month for demo usage
- **Auto-scaling**: Pay only for what you use
- **Estimated cost**: $10-20 for demo day with 1000+ users
