# ALCHEMI — Deployment Guide

This document covers deployment strategies for ALCHEMI on Vercel (Web & API Serverless Functions) and Electron (Desktop).

## 🚀 1. Vercel Web Deployment

ALCHEMI is pre-configured for zero-config Vercel deployment using `vercel.json`.

### Automatic Deployment (Git Integration)
1. Push your code to your GitHub/GitLab repository.
2. Connect the repository to your Vercel account.
3. Configure the required environment variables in the Vercel Dashboard:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string (with pooled endpoint).
   - `POSTGRES_URL`: Same as `DATABASE_URL`.
   - `NVIDIA_API_KEY`: NVIDIA NIM API key (server-side only, no `VITE_` prefix).
   - `AIML_API_KEY`: AI/ML API key (server-side only, no `VITE_` prefix).

### Build Command
Vercel automatically executes `vercel-build` specified in `package.json`:
```bash
node scripts/ensure-migrations.mjs && prisma generate && tsc -b && vite build && prisma db seed
```

---

## 💻 2. Electron Desktop Build

To build native desktop installers for Linux and Windows:

```bash
# Build for Linux (AppImage & tar.gz)
npm run electron:build:linux

# Build for Windows (NSIS Installer & Portable executable)
npm run electron:build:win
```

Build outputs are saved to the `dist-desktop/` directory.

---

## 🔒 3. Production Security Checklist

- [x] All AI API keys are stored in server-side environment variables (`NVIDIA_API_KEY`).
- [x] Security headers are set in `vercel.json` (`X-Frame-Options`, `X-Content-Type-Options`).
- [x] Database connection pooling is active with Neon (`pg.Pool` with `max: 1`).
- [x] Error Boundary is active for runtime exception handling.
- [x] Analytics & monitoring are active (`@vercel/analytics`).
