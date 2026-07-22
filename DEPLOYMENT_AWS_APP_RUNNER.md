# AWS App Runner Deployment Guide

## Prerequisites

- AWS account
- GitHub repository with this project
- OpenRouter API key

## 1) Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial AI Content Studio production setup"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## 2) Create App Runner Service

1. Open AWS Console -> App Runner
2. Click **Create service**
3. Source: **Repository**
4. Connect GitHub account and select your repo
5. Branch: `main`

## 3) Build & Start Configuration

- Runtime: **Node.js 20+**
- Build command:

```bash
npm --prefix backend install --omit=dev
```

- Start command:

```bash
node backend/server.js
```

- Port: `3000`

## 4) Environment Variables

Add these in App Runner:

- `NODE_ENV=production`
- `PORT=3000`
- `OPENROUTER_API_KEY=YOUR_KEY_HERE`
- `OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free`
- `OPENROUTER_BASE_URL=https://openrouter.ai/api/v1`
- `OPENROUTER_APP_NAME=AI Content Studio`
- `OPENROUTER_APP_URL=https://<your-app-runner-url>.awsapprunner.com`
- `CORS_ORIGIN=https://<your-app-runner-url>.awsapprunner.com`
- `RATE_LIMIT_WINDOW_MS=900000`
- `RATE_LIMIT_MAX=60`

## 5) Health Check

- Health check path: `/api/health`
- Protocol: HTTP

## 6) Deploy

Click **Create & Deploy**.  
After deployment, App Runner provides a public HTTPS URL:

`https://<your-app-runner-url>.awsapprunner.com`

## 7) Post-Deployment Validation

1. Visit public URL
2. Confirm homepage loads
3. Test `/api/health`
4. Generate sample content and confirm streaming works
5. Verify CORS and rate limits

