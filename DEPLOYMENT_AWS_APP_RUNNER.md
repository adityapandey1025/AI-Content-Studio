# AWS Elastic Beanstalk Deployment Guide

## Live URL

`http://ai-content-studio-vibe-env.eba-v2pg5tsz.us-east-1.elasticbeanstalk.com`

## Prerequisites

- AWS account
- Project source code
- OpenRouter API key

## 1) Project Structure

```
AI-Content-Studio/
  backend/
  frontend/
  Dockerfile
  .ebextensions/
    proxy.config
  package.json
```

## 2) Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY package.json ./
RUN cd backend && npm install --omit=dev
EXPOSE 80
CMD ["node", "backend/server.js"]
```

The app listens on `0.0.0.0:80` inside the container.

## 3) Deploy via AWS CLI

```bash
# Upload zip to S3
aws s3 cp deploy.zip s3://elasticbeanstalk-us-east-1-<ACCOUNT_ID>/ai-content-studio/deploy.zip

# Create application version
aws elasticbeanstalk create-application-version \
  --application-name ai-content-studio-vibe \
  --version-label v1 \
  --source-bundle S3Bucket="elasticbeanstalk-us-east-1-<ACCOUNT_ID>",S3Key="ai-content-studio/deploy.zip"

# Update environment
aws elasticbeanstalk update-environment \
  --application-name ai-content-studio-vibe \
  --environment-name Ai-content-studio-vibe-env \
  --version-label v1
```

## 4) Environment Variables

Set in Elastic Beanstalk console under Configuration > Software:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `80` |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `OPENROUTER_MODEL` | `deepseek/deepseek-chat-v3-0324:free` |
| `OPENROUTER_BASE_URL` | `https://openrouter.ai/api/v1` |
| `OPENROUTER_APP_NAME` | `AI Content Studio` |
| `OPENROUTER_APP_URL` | `http://ai-content-studio-vibe-env.eba-v2pg5tsz.us-east-1.elasticbeanstalk.com` |
| `CORS_ORIGIN` | `http://ai-content-studio-vibe-env.eba-v2pg5tsz.us-east-1.elasticbeanstalk.com` |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX` | `60` |

## 5) Health Check

- Path: `/api/health`
- Protocol: HTTP
- Expected: `200 OK`

## 6) Post-Deployment Validation

1. Visit the live URL
2. Confirm the homepage loads with styled UI
3. Test `/api/health` endpoint
4. Generate sample content and confirm streaming works
5. Verify CORS and rate limits

## 7) Troubleshooting

- **Container crash loop**: Ensure Dockerfile CMD uses correct syntax (`node backend/server.js` not `CMD node backend/server.js`)
- **403 from OpenRouter**: Ensure `OPENROUTER_API_KEY` is set in EB environment properties
- **CORS errors**: Ensure `CORS_ORIGIN` matches the actual EB URL
- **nginx timeout**: Use `.ebextensions/proxy.config` to increase proxy timeouts
