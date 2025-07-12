#!/usr/bin/env pwsh

# GitHub Actions Setup Script for GigaTalentos
# This script helps you set up the required secrets for GitHub Actions deployment

Write-Host "🚀 GitHub Actions Setup for GigaTalentos" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ This doesn't appear to be a Git repository." -ForegroundColor Red
    Write-Host "Please run this script from the root of your GigaTalentos project." -ForegroundColor Red
    exit 1
}

Write-Host "This script will guide you through setting up GitHub secrets for automated deployment." -ForegroundColor Green
Write-Host ""

# Get repository information
try {
    $gitRemote = git remote get-url origin 2>$null
    if ($gitRemote -match "github\.com[:/]([^/]+)/([^/.]+)") {
        $repoOwner = $matches[1]
        $repoName = $matches[2] -replace "\.git$", ""
        Write-Host "📁 Detected Repository: $repoOwner/$repoName" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  Could not detect GitHub repository from remote URL." -ForegroundColor Yellow
        $repoOwner = Read-Host "Enter your GitHub username/organization"
        $repoName = Read-Host "Enter your repository name"
    }
} catch {
    Write-Host "⚠️  Could not get git remote URL." -ForegroundColor Yellow
    $repoOwner = Read-Host "Enter your GitHub username/organization"
    $repoName = Read-Host "Enter your repository name"
}

Write-Host ""
Write-Host "🔑 Required GitHub Secrets" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

$secrets = @(
    @{
        Name = "VERCEL_TOKEN"
        Description = "Your Vercel API token"
        Instructions = "1. Go to https://vercel.com/account/tokens`n2. Create a new token`n3. Copy the token value"
        Required = $true
    },
    @{
        Name = "VERCEL_ORG_ID"
        Description = "Your Vercel organization ID"
        Instructions = "Run: npx vercel org ls`nCopy the ID from the output"
        Required = $true
    },
    @{
        Name = "VERCEL_PROJECT_ID"
        Description = "Your Vercel project ID"
        Instructions = "Run: npx vercel project ls`nCopy the ID for your project"
        Required = $true
    },
    @{
        Name = "MONGODB_URI"
        Description = "Your MongoDB connection string"
        Instructions = "Get this from your MongoDB Atlas dashboard"
        Required = $true
    },
    @{
        Name = "NEXTAUTH_SECRET"
        Description = "NextAuth.js secret key"
        Instructions = "Generate with: openssl rand -base64 32`nOr use any secure random string"
        Required = $true
    },
    @{
        Name = "NEXTAUTH_URL"
        Description = "Your application URL"
        Instructions = "Production URL (e.g., https://yourapp.vercel.app)"
        Required = $true
    },
    @{
        Name = "SLACK_WEBHOOK_URL"
        Description = "Slack webhook for notifications"
        Instructions = "Optional: Create a Slack webhook for deployment notifications"
        Required = $false
    }
)

foreach ($secret in $secrets) {
    $requiredText = if ($secret.Required) { " (REQUIRED)" } else { " (Optional)" }
    Write-Host "🔐 $($secret.Name)$requiredText" -ForegroundColor $(if ($secret.Required) { "Red" } else { "Yellow" })
    Write-Host "   $($secret.Description)" -ForegroundColor Gray
    Write-Host "   Instructions: $($secret.Instructions)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "📋 How to Add Secrets to GitHub" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to your repository: https://github.com/$repoOwner/$repoName" -ForegroundColor Green
Write-Host "2. Click on 'Settings' tab" -ForegroundColor Green
Write-Host "3. In the left sidebar, click 'Secrets and variables' > 'Actions'" -ForegroundColor Green
Write-Host "4. Click 'New repository secret' for each secret above" -ForegroundColor Green
Write-Host "5. Enter the secret name and value" -ForegroundColor Green
Write-Host ""

Write-Host "🛠️  Quick Commands to Get Vercel Info" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Get Vercel Organization ID:" -ForegroundColor Yellow
Write-Host "npx vercel org ls" -ForegroundColor White
Write-Host ""
Write-Host "Get Vercel Project ID:" -ForegroundColor Yellow
Write-Host "npx vercel project ls" -ForegroundColor White
Write-Host ""
Write-Host "Generate NextAuth Secret:" -ForegroundColor Yellow
Write-Host "node -e `"console.log(require('crypto').randomBytes(32).toString('base64'))`"" -ForegroundColor White
Write-Host ""

Write-Host "✅ Next Steps" -ForegroundColor Cyan
Write-Host "=============" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Add all the required secrets to your GitHub repository" -ForegroundColor Green
Write-Host "2. Push your code to the main/master branch or create a Pull Request" -ForegroundColor Green
Write-Host "3. The GitHub Actions workflow will automatically deploy your app!" -ForegroundColor Green
Write-Host ""

Write-Host "📚 For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""

$response = Read-Host "Would you like to open the GitHub secrets page now? (y/N)"
if ($response -eq "y" -or $response -eq "Y") {
    $url = "https://github.com/$repoOwner/$repoName/settings/secrets/actions"
    Write-Host "Opening: $url" -ForegroundColor Green
    Start-Process $url
}

Write-Host ""
Write-Host "🎉 Setup guide complete! Happy deploying!" -ForegroundColor Green
