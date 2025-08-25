# Troubleshooting: Onboarding Form Data Not Saving

## 🔍 **Issue Description**

The onboarding form data is not being saved to the Supabase database.

## 🛠️ **Root Causes & Solutions**

### **1. Backend URL Configuration Issue**

**Problem**: The frontend is trying to call a placeholder backend URL.

**Solution**: Update the backend URL in `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR-ACTUAL-RAILWAY-URL.railway.app/$1"
    }
  ]
}
```

**Steps**:

1. Deploy your backend to Railway first
2. Copy your Railway URL (e.g., `https://aluma-backend-abc123.railway.app`)
3. Update `frontend/vercel.json` with the correct URL
4. Redeploy your frontend to Vercel

### **2. Missing Database Column**

**Problem**: The `email_contact` column doesn't exist in the database.

**Solution**: Run the migration in Supabase SQL Editor:

```sql
-- Add email_contact column to existing users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS email_contact BOOLEAN DEFAULT true;

-- Add comment explaining the new column
COMMENT ON COLUMN users.email_contact IS 'User consent for email contact and additional content';
```

**Steps**:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the migration script from `backend/migration.sql`
4. Verify the column was added

### **3. Environment Variables Not Set**

**Problem**: Supabase credentials are not configured.

**Solution**: Set the required environment variables in Railway:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Steps**:

1. Go to Railway dashboard
2. Select your backend service
3. Go to Variables tab
4. Add the Supabase environment variables
5. Redeploy the service

### **4. Duplicate API Endpoints**

**Problem**: There were duplicate `/onboarding` endpoints in the server code.

**Solution**: ✅ **FIXED** - Removed duplicate endpoint in `backend/server.js`

## 🔧 **Quick Fix Script**

Use the provided script to update your Vercel configuration:

```bash
./update-vercel-config.sh https://your-railway-backend.railway.app
```

## 🧪 **Testing Steps**

1. **Check Backend Health**:

   ```bash
   curl https://your-railway-backend.railway.app/health
   ```

2. **Test Onboarding API**:

   ```bash
   curl -X POST https://your-railway-backend.railway.app/onboarding \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","isCareerCoach":"No","profession":"Developer","emailContact":"Yes"}'
   ```

3. **Check Browser Console**: Look for any API errors in the browser's developer tools.

## 📋 **Verification Checklist**

- [ ] Backend is deployed to Railway and accessible
- [ ] Vercel configuration has correct backend URL
- [ ] Supabase environment variables are set in Railway
- [ ] Database migration has been run
- [ ] Frontend is redeployed to Vercel
- [ ] API calls are working (check browser network tab)

## 🚨 **Common Error Messages**

- **"Failed to save user data"**: Usually backend URL or environment variable issue
- **"Supabase not available"**: Missing Supabase credentials
- **"Column does not exist"**: Migration not run
- **"Network error"**: Backend URL is incorrect

## 📞 **Still Having Issues?**

1. Check Railway logs for backend errors
2. Check Vercel logs for frontend errors
3. Verify Supabase connection in the dashboard
4. Test the API endpoints directly with curl or Postman
