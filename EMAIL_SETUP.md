# Email Configuration Setup Instructions

## Gmail Setup for Contact Form

To make the contact form work with Gmail, you need to:

### 1. Enable 2-Factor Authentication on Gmail
- Go to your Google Account settings
- Security → 2-Step Verification
- Turn it on if not already enabled

### 2. Create an App Password
- Go to Google Account → Security → App passwords
- Select "Mail" and "Windows Computer" (or other)
- Generate a 16-character app password
- **Important**: Use this app password, NOT your regular Gmail password!

### 3. Update Environment Variables
Edit `.env.local` file and replace:
```
EMAIL_USER=carlosdenner@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 4. Test the Contact Form
- Start the development server: `npm run dev`
- Go to `/contact` page
- Fill out the form and submit
- Check if email arrives at carlosdenner@gmail.com

## Alternative: Using Other Email Services

If you prefer to use other email services:

### SendGrid (Recommended for production)
```bash
npm install @sendgrid/mail
```

### Mailgun
```bash
npm install mailgun-js
```

### AWS SES
```bash
npm install aws-sdk
```

## Production Deployment Setup

### GitHub Repository Secrets (for CI/CD)
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these repository secrets:
   - `EMAIL_USER`: carlosdenner@gmail.com
   - `EMAIL_PASS`: your-16-character-app-password

### Vercel Environment Variables
1. Go to your Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add these variables:
   - `EMAIL_USER`: carlosdenner@gmail.com
   - `EMAIL_PASS`: your-16-character-app-password
   - Environment: Production (and Preview if needed)

### Alternative: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
```

### Important Notes for Production
- The current setup uses `tls.rejectUnauthorized: false` for development only
- For production, you should remove this line or set it to `true`
- Consider using a dedicated email service like SendGrid for better deliverability
- Monitor email delivery and implement proper error handling

## Security Notes
- Never commit your app password to version control
- Use environment variables for all sensitive data
- Consider using a dedicated email service for production
- The current setup is perfect for development and small-scale use

## Testing
You can test the API directly:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "general",
    "message": "This is a test message"
  }'
```
