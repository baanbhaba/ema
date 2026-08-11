# ALCHEMI — Contributing Guide

Welcome to the ALCHEMI repository! This guide will help you set up your local development environment and submit changes.

## 🛠 Local Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **NPM**: `v10.x` or higher
- **PostgreSQL**: Neon DB connection string or local Postgres instance

### 2. Clone & Install
```bash
git clone https://github.com/baanbhaba/demux.git
cd demux
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL`, `NVIDIA_API_KEY`, and `AIML_API_KEY` are configured.

### 4. Database Setup
Run Prisma migrations and seed the database:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Linting

Run tests and static analysis before submitting pull requests:
```bash
# Run TypeScript type check
npx tsc --noEmit

# Run unit tests
npm test

# Run code linter
npm run lint

# Build production bundle
npm run build
```

---

## 🌲 Branch & PR Conventions

- **Branch names**: `feat/description`, `fix/description`, or `docs/description`
- **Commits**: Follow conventional commits (e.g., `feat: add feedback modal`, `fix: header responsiveness`)
- **Pull Requests**: Ensure all automated checks and builds pass before requesting review.
