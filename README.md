# AI Content Studio

Generate AI-powered blogs, emails, LinkedIn posts, captions, summaries, tweets, and professional content instantly.

## Features

- Premium responsive UI (glassmorphism, animation, dark/light mode)
- Content generation types:
  - Blog, Email, LinkedIn Post, Instagram Caption, Tweet
  - Summary, Essay, Story, Motivational Quote
  - Business Proposal, Professional Reply, Resume Objective, Cover Letter
- OpenRouter integration with streaming response rendering
- Markdown output rendering
- Copy, Download TXT, Download PDF
- Word/Character/Reading-time counters
- Prompt templates
- Recent history (localStorage)
- AI usage counter
- Keyboard shortcuts
- Skeleton loader and empty state
- Secure Express backend with:
  - Helmet, CORS, Compression, Morgan
  - Rate limiting
  - Request validation (Zod)
  - Centralized error handling

---

## Project Structure

```text
AI-Content-Studio/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   └── utils/
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json
├── ARCHITECTURE.md
├── CONCEPT_NOTE.md
├── PROJECT_REPORT.md
├── PROMPT_ENGINEERING.md
├── SAMPLE_PROMPTS.md
├── TESTING_GUIDE.md
└── DEPLOYMENT_AWS_APP_RUNNER.md
```

---

## Quick Start (Local)

### 1) Clone and enter project

```bash
git clone <your-repo-url>
cd AI-Content-Studio
```

### 2) Create `.env`

Create a file named `.env` in project root and paste:

```env
OPENROUTER_API_KEY=YOUR_KEY_HERE
NODE_ENV=development
PORT=3000
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_APP_NAME=AI Content Studio
OPENROUTER_APP_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=60
```

### 3) Install dependencies

```bash
npm run install:all
```

### 4) Start app

```bash
npm run start
```

Open: `http://localhost:3000`

---

## API

### POST `/api/generate`

Request body:

```json
{
  "text": "Write a launch announcement for our AI app",
  "type": "linkedin-post"
}
```

Response: streamed plain text content.

### GET `/api/health`

Returns application health payload.

---

## Keyboard Shortcuts

- `Ctrl + Enter`: Generate content
- `Ctrl + K`: Focus prompt box
- `Esc`: Clear output panel

---

## Docker

### Run with Docker Compose

```bash
docker compose up --build
```

App URL: `http://localhost:3000`

---

## AWS Deployment

See: [`DEPLOYMENT_AWS_APP_RUNNER.md`](./DEPLOYMENT_AWS_APP_RUNNER.md)

---

## GitHub Setup Commands

```bash
git init
git add .
git commit -m "Initial production-ready AI Content Studio setup"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

---

## Screenshot Placeholders

- Hero + Input Panel
- Streaming Output Panel
- Dark Mode
- Light Mode
- Mobile View

---

## License

MIT

