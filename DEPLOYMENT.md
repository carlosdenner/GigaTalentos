# 🚀 GigaTalentos - End-to-End Deployment Guide

This document explains the automated deployment pipeline for the GigaTalentos platform using GitHub Actions and Vercel.

## 📋 Overview

The deployment pipeline automatically:
- ✅ Runs quality checks (linting, type checking)
- 🏗️ Builds and tests the application
- 🚀 Deploys preview environments for Pull Requests
- 🚀 Deploys to production on main/master branch pushes
- 🏥 Runs health checks post-deployment
- 💬 Comments on PRs with preview URLs

## 🔧 Setup Instructions

### 1. Prerequisites

- GitHub repository with admin access
- Vercel account connected to your GitHub repo
- MongoDB Atlas database
- Supabase project (optional)

### 2. GitHub Secrets Configuration

Go to your GitHub repository: `Settings > Secrets and variables > Actions`

Add the following repository secrets:

#### 🔐 Vercel Configuration
```
VERCEL_TOKEN          # Get from https://vercel.com/account/tokens
VERCEL_ORG_ID         # Run: vercel teams ls
VERCEL_PROJECT_ID     # Get from Vercel project settings
```

#### 🌍 Environment Variables
```
MONGODB_URI                    # Your MongoDB connection string
NEXTAUTH_SECRET               # Your NextAuth secret key
NEXTAUTH_URL                  # Your production URL
NEXT_PUBLIC_SUPABASE_URL      # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Your Supabase anonymous key
```

### 3. Get Vercel Project Information

```bash
# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Get Organization ID
vercel teams ls

# Get Project ID
vercel project ls

# Create a new token at: https://vercel.com/account/tokens
```

### 4. Quick Setup Script

Run the setup script for detailed instructions:

```bash
chmod +x scripts/setup-github-actions.sh
./scripts/setup-github-actions.sh
```

## 🔄 Workflow Triggers

### Automatic Triggers
- **Push to main/master**: Deploys to production
- **Pull Request**: Deploys to preview environment
- **Manual trigger**: Can be triggered manually from GitHub Actions tab

### Workflow Jobs

1. **🔍 Quality Checks**
   - ESLint linting
   - TypeScript type checking
   - Unit tests (if available)

2. **🏗️ Build Test**
   - Builds the application
   - Validates build artifacts
   - Uploads build files

3. **🚀 Deploy Preview** (PRs only)
   - Deploys to Vercel preview environment
   - Comments on PR with preview URL

4. **🚀 Deploy Production** (main/master only)
   - Deploys to Vercel production
   - Requires environment approval (optional)

5. **🏥 Health Checks** (production only)
   - Tests main page response
   - Tests API endpoints
   - Generates deployment summary

## 📊 Deployment Environments

### Preview Environment
- **Trigger**: Pull Requests
- **URL**: Auto-generated preview URL
- **Purpose**: Test changes before merging

### Production Environment
- **Trigger**: Push to main/master branch
- **URL**: Your configured production domain
- **Purpose**: Live application for users

## 🔍 Monitoring and Debugging

### GitHub Actions Logs
1. Go to your repository
2. Click on "Actions" tab
3. Select the workflow run
4. Check individual job logs

### Common Issues and Solutions

#### ❌ Build Failures
```bash
# Check for TypeScript errors
npm run build

# Check for linting issues
npm run lint

# Verify environment variables
echo $MONGODB_URI
```

#### ❌ Deployment Failures
- Verify Vercel token is valid and has correct permissions
- Check that all required secrets are set in GitHub
- Ensure Vercel project is properly linked

#### ❌ Health Check Failures
- Verify MongoDB connection allows Vercel IPs
- Check that environment variables are correctly set
- Verify API endpoints are responding

### Environment Variables Checklist

```bash
# Required for build
✅ MONGODB_URI
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY

# Required for deployment
✅ VERCEL_TOKEN
✅ VERCEL_ORG_ID
✅ VERCEL_PROJECT_ID
```

## 🚀 Manual Deployment

If you need to deploy manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 🔄 Workflow Customization

### Adding Tests
Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Adding Environment Protection
1. Go to repository settings
2. Navigate to "Environments"
3. Create "production" environment
4. Add protection rules (required reviewers, deployment branches)

### Custom Notifications
Modify the workflow to add:
- Slack notifications
- Email alerts
- Discord webhooks
- Custom API calls

## 📈 Best Practices

### Code Quality
- Always run linting before pushing
- Fix TypeScript errors
- Add meaningful commit messages
- Use conventional commits format

### Security
- Never commit secrets to repository
- Use GitHub secrets for sensitive data
- Regularly rotate API tokens
- Review deployment logs for security issues

### Performance
- Monitor build times
- Optimize bundle size
- Use caching strategies
- Monitor deployment frequency

## 🛡️ Security Considerations

### Secrets Management
- All secrets are encrypted in GitHub
- Secrets are only available during workflow execution
- Regular secret rotation recommended

### Access Control
- Limit repository access to necessary team members
- Use environment protection rules for production
- Monitor deployment activities

### Database Security
- Ensure MongoDB Atlas has proper IP restrictions
- Use strong passwords and connection strings
- Monitor database access logs

## 📞 Support

### Resources
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

### Troubleshooting
1. Check GitHub Actions logs
2. Verify all secrets are correctly set
3. Test local build: `npm run build`
4. Check Vercel dashboard for deployment status

---

## 🎉 Success!

Once everything is configured, your deployment pipeline will:

1. **Automatically deploy** every push to main/master
2. **Create preview environments** for all Pull Requests
3. **Run quality checks** on every change
4. **Monitor deployment health** and provide summaries
5. **Notify team members** of deployment status

Your GigaTalentos platform is now ready for continuous deployment! 🚀
