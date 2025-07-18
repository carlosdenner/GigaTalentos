# Production Setup Guide

## 🚀 Complete Setup for GitHub & Vercel

### Step 1: GitHub Repository Secrets

1. **Go to your GitHub repository**: https://github.com/carlosdenner/GigaTalentos
2. **Navigate to Settings**:
   - Click on the "Settings" tab in your repository
   - Scroll down to "Secrets and variables" in the left sidebar
   - Click "Actions"

3. **Add Repository Secrets**:
   - Click "New repository secret"
   - Add these secrets one by one:

   **SECRET 1:**
   - Name: `EMAIL_USER`
   - Value: `carlosdenner@gmail.com`

   **SECRET 2:**
   - Name: `EMAIL_PASS`  
   - Value: `your-16-character-app-password` (from Gmail App Password setup)

### Step 2: Vercel Environment Variables

#### Option A: Using Vercel Dashboard
1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (GigaTalentos)
3. **Navigate to Settings**:
   - Click on "Settings" tab
   - Click "Environment Variables" in the left sidebar

4. **Add Environment Variables**:
   - Click "Add New"
   - Add these variables:

   **VARIABLE 1:**
   - Name: `EMAIL_USER`
   - Value: `carlosdenner@gmail.com`
   - Environment: Select "Production", "Preview", and "Development"

   **VARIABLE 2:**
   - Name: `EMAIL_PASS`
   - Value: `your-16-character-app-password`
   - Environment: Select "Production", "Preview", and "Development"

   **VARIABLE 3:**
   - Name: `NODE_ENV`
   - Value: `production`
   - Environment: Select "Production" only

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (run this in your project directory)
vercel link

# Add environment variables
vercel env add EMAIL_USER
# Enter: carlosdenner@gmail.com
# Select: Production, Preview, Development

vercel env add EMAIL_PASS  
# Enter: your-16-character-app-password
# Select: Production, Preview, Development

vercel env add NODE_ENV
# Enter: production
# Select: Production only
```

### Step 3: Redeploy Your Application

After setting up the environment variables:

1. **Push your latest changes to GitHub**:
   ```bash
   git add .
   git commit -m "Add production-ready contact form"
   git push origin main
   ```

2. **Trigger a new deployment**:
   - Vercel should automatically redeploy when you push to GitHub
   - Or manually redeploy from Vercel dashboard

### Step 4: Test in Production

1. **Visit your live site** (your-domain.vercel.app)
2. **Go to the contact page** (`/contact`)
3. **Submit a test message**
4. **Check your email** (carlosdenner@gmail.com) for the message

### Step 5: Monitor and Debug

#### Check Vercel Function Logs:
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on `/api/contact` to see logs
3. Look for any errors or successful email sends

#### Check Gmail:
1. Check your inbox for new messages
2. Check spam folder if not in inbox
3. Verify Gmail security settings aren't blocking the app

## 🔧 Troubleshooting

### Common Issues:

1. **"Environment variable not found"**
   - Double-check variable names: `EMAIL_USER`, `EMAIL_PASS`
   - Ensure they're set for the correct environment (Production)
   - Redeploy after adding variables

2. **"Authentication failed"**
   - Verify you're using the App Password, not your regular Gmail password
   - Check that 2FA is enabled on your Gmail account

3. **"SSL Certificate error"**
   - Should be resolved with the production SSL configuration
   - Check that `NODE_ENV=production` is set in Vercel

4. **"Internal Server Error"**
   - Check Vercel function logs for detailed error messages
   - Verify all environment variables are properly set

### Testing Commands:

```bash
# Test locally with production environment
NODE_ENV=production npm run dev

# Test the deployed API
curl -X POST https://your-domain.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "general",
    "message": "Production test message"
  }'
```

## 📧 Next Steps

1. **Set up Gmail App Password** (if not done already)
2. **Configure GitHub Secrets**
3. **Configure Vercel Environment Variables**
4. **Deploy and Test**
5. **Monitor email delivery**

## 🔐 Security Best Practices

- Never commit sensitive data to Git
- Use different App Passwords for different applications
- Monitor Gmail security dashboard for unusual activity
- Consider using a dedicated email service for high-volume applications
- Set up proper error handling and logging

---

**Need help?** Check the logs in Vercel dashboard or contact support with the specific error messages you're seeing.
