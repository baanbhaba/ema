# ALCHEMI — Automated Legacy Code Transformation Engine

**ALCHEMI** is an enterprise-grade automated transformation platform and human-in-the-loop review system designed to orchestrate complex legacy codebase migrations (e.g. legacy Java applications to high-performance, memory-safe Rust services).

---

# 🚀 Key Features

- **Core & Impact Auditing**: Automated static and dynamic AST analysis identifying architectural bottlenecks, memory patterns, and dependency risks.
- **Transformation Blueprinting**: Interactive human-in-the-loop review interface allowing developers to inspect, modify, and bulk-approve generated Rust code transformations.
- **NVIDIA AI Integration**: Deep integration with AI models for complex code synthesis and refactoring logic.
- **Dual Runtime Support**: Runs seamlessly as a modern web app (Vite + React) or as a native desktop application powered by Electron.
- **High-Performance Rust Backend**: High-concurrency orchestration engine built with Rust & Axum.

---

## 🛠 Tech Stack

### Frontend & Desktop
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS
- **State & Data**: Zustand + TanStack React Query
- **Desktop Runtime**: Electron
- **Testing & Quality**: Vitest + Oxlint

### Backend Engine
- **Language**: Rust
- **Framework**: Axum + Tokio async runtime
- **CORS & Middleware**: Tower-HTTP

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+`
- **Rust**: `1.75+` (for running the backend engine)

### 2. Frontend Setup & Local Development

```bash
# Install dependencies
npm install

# Start Vite development server (port 5173)
npm run dev
```

### 3. Backend Engine Setup

```bash
# Navigate to backend directory
cd backend

# Run backend engine (port 8080 by default)
cargo run
```

### 4. Electron Desktop App (Optional)

```bash
# Start concurrently with Vite dev server
npm run electron:dev
```

---

## 🌐 API & Deployment Configuration

### Local Development Proxy
During development (`npm run dev`), Vite automatically proxies `/api` requests to `http://localhost:8080` via [`vite.config.ts`](file:///home/baanbhaba/projects/demux/vite.config.ts).

### Environment Variables
Environment settings are defined in [`.env`](file:///home/baanbhaba/projects/demux/.env):
```env
VITE_API_BASE_URL=/api/v1
VITE_USE_MOCKS=false
```

### Deploying to Vercel
1. Deploy your Rust backend to a cloud host (Render, Railway, Fly.io, etc.).
2. In Vercel Project Settings, set:
   ```env
   VITE_API_BASE_URL=https://<your-backend-host>/api/v1
   ```
3. Trigger a redeploy on Vercel.

---

## 🧪 Testing & Linting

```bash
# Run unit tests
npm run test

# Run Oxlint linter
npm run lint

# Build production bundle
npm run build
```

---

## 📄 License

Internal Enterprise License — ALCHEMI Engineering Team.
