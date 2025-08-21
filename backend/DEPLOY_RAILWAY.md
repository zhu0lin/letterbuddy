# Railway Deployment Guide

## Prerequisites
1. GitHub account with your code pushed
2. Railway account (sign up at https://railway.app)

## Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

## Step 2: Deploy to Railway

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment Variables**
   - Go to your project's "Variables" tab
   - Add these variables:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     PORT=8000
     ```

4. **Deploy**
   - Railway will automatically detect it's a Python app
   - It will install dependencies from requirements.txt
   - The app will deploy and give you a URL

## Step 3: Update Vercel

1. **Get Railway URL**
   - Copy the URL from Railway (e.g., https://your-app.railway.app)

2. **Update Vercel Environment Variable**
   - Go to your Vercel project
   - Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://your-app.railway.app`
   - Redeploy your Vercel app

## Step 4: Test

1. **Test Railway Backend**
   - Visit `https://your-app.railway.app/health`
   - Should return: `{"status": "healthy"}`

2. **Test from Frontend**
   - Upload an image in your production app
   - Should now work!

## Troubleshooting

- **Build Errors**: Check Railway logs in the dashboard
- **Environment Variables**: Make sure OPENAI_API_KEY is set
- **CORS Issues**: Backend now allows all origins for production
