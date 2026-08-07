# ALCHEMI — Automated Legacy Code Transformation Engine
## THIS IS US · Iteration CLAUDE · Complete Technical Reference
### The Full Picture — Every File, Every Layer, Every Byte, Every Decision

> **Generated:** 2026-08-07 · **Author:** Antigravity (Claude Sonnet 4.6 Thinking) · **Corpus:** `baanbhaba/ema`  
> **Workspace root:** `/home/baanbhaba/projects/demux`

---

## TABLE OF CONTENTS

1. [Project Identity & Mission](#1-project-identity--mission)
2. [The Big Picture — What Is This Thing?](#2-the-big-picture--what-is-this-thing)
3. [Full Technology Stack — Every Library, Every Version, Every Reason](#3-full-technology-stack)
4. [Complete Filesystem Tree](#4-complete-filesystem-tree)
5. [All APIs — External, Internal, Serverless, and Rust Routes](#5-all-apis)
6. [The Database Schema — Every Model, Every Column](#6-the-database-schema)
7. [Frontend Architecture — React, Router, State, Components, Pages](#7-frontend-architecture)
8. [Backend Architecture — Rust, Axum, Agents, Repository](#8-backend-architecture)
9. [AI Integration — NVIDIA NIM, AIML API, Prompts, Proxy, Guards](#9-ai-integration)
10. [State Management — Zustand Stores Deep Dive](#10-state-management)
11. [Type System & Schema Validation — Zod Contracts](#11-type-system--schema-validation)
12. [The 7-Stage Migration Pipeline — End to End](#12-the-7-stage-migration-pipeline)
13. [Code Transformation Engine](#13-code-transformation-engine)
14. [Electron Desktop Application](#14-electron-desktop-application)
15. [Deployment Infrastructure — Vercel](#15-deployment-infrastructure)
16. [Dev Mode — The baanbhaba Superuser System](#16-dev-mode)
17. [Mock & Fallback System — Offline-First Resilience](#17-mock--fallback-system)
18. [Source Code Persistence — sessionStorage, In-Memory Stores](#18-source-code-persistence)
19. [Testing Suite — Vitest, RTL, Integration & Unit Tests](#19-testing-suite)
20. [Build System — Vite, TypeScript, Prisma, Electron-Builder](#20-build-system)
21. [Environment Variables — Every Key, What It Does, Who Uses It](#21-environment-variables)
22. [Readiness Scoring — The Math Behind the Score](#22-readiness-scoring)
23. [Consensus Engine — How the Two Agents Disagree and Resolve](#23-consensus-engine)
24. [Human-in-the-Loop Safeguards](#24-human-in-the-loop-safeguards)
25. [Static Analysis Engine — Java AST Pattern Detection](#25-static-analysis-engine)
26. [Component Architecture — Full UI Hierarchy](#26-component-architecture)
27. [Routing Architecture — All Routes, Guards, Navigation](#27-routing-architecture)
28. [NPM Scripts — Every Command Explained](#28-npm-scripts)
29. [Strategic Rationale — Why Everything Exists](#29-strategic-rationale)
30. [Known Architecture Decisions & Trade-offs](#30-architecture-decisions--trade-offs)
31. [Appendices](#31-appendices)

---

## 1. Project Identity & Mission

| Field | Value |
|:------|:------|
| **Project Name** | ALCHEMI — Automated Legacy Code Transformation Engine |
| **NPM Package Name** | `alchemi-transformation-engine` |
| **Version** | `1.0.0` |
| **Description** | Enterprise-grade multi-agent Java → Rust / Java 21 migration platform |
| **App ID (Electron)** | `com.alchemi.transformation` |
| **Executable Name** | `alchemi-ui` |
| **Primary Author** | ALCHEMI Team (`dev@alchemi.ai`) |
| **Package Type** | `"type": "module"` (ES Modules throughout) |
| **Electron Entry** | `electron/main.cjs` |
| **Workspace Root** | `/home/baanbhaba/projects/demux` |
| **Deployment Target** | Vercel (web) + Electron (desktop, Linux/Windows) |
| **Primary AI Model** | `meta/llama-3.1-70b-instruct` via NVIDIA NIM |
| **Database** | PostgreSQL 15+ via Prisma 7.9 ORM |
| **Backend Language** | Rust 1.75+ (Axum 0.7 / Tokio) |
| **Frontend Language** | TypeScript ~6.0.2 / React 19 |

**Mission Statement:** ALCHEMI automates the analysis, planning, review, and code synthesis phases of migrating enterprise Java 8/11 Spring Boot monoliths into either modern Java 21 LTS or memory-safe Rust microservices (Axum + Tokio). It combines multi-agent AI, human review gates, weighted readiness scoring, topology-aware transformation sequencing, and one-click download of compilable Rust source packages.

---

## 2. The Big Picture — What Is This Thing?

ALCHEMI is simultaneously **seven things at once**:

1. **A Static Analysis Engine** — Takes raw Java source code and automatically detects deprecated APIs, EOL Java versions, legacy frameworks (Spring Boot 2.x), and hazardous patterns (`sun.misc.Unsafe`, `javax.*`, `Thread.stop()`) without needing a running JVM.

2. **A Multi-Agent AI Orchestration System** — Runs two independent AI agents (Core Analysis Agent + Impact Analysis Agent), compares their divergent opinions, generates structured conflict objects, computes consensus, and resolves disagreements before allowing any transformation.

3. **A Human-in-the-Loop Review Platform** — Enforces that a real developer opens, reads, and inspects every migration blueprint step before a bulk "Approve All & Execute" action is unlocked. You cannot skip this gate.

4. **An AI Code Synthesis Engine** — Using Meta Llama 3.1 70B via NVIDIA NIM, synthesizes idiomatic Rust code from Java source, sanitizes markdown fences, upgrades deprecated Axum 0.6 syntax to Axum 0.7, deduplicates imports, and packages everything into a downloadable `.rs` + `Cargo.toml` bundle.

5. **A Full-Stack Web Application** — Built on React 19 + Vite 8 + TailwindCSS 4 with a PostgreSQL + Prisma backend, deployable to Vercel with serverless API functions.

6. **A Native Desktop Application** — The exact same web codebase runs inside Electron 34 with sandboxed preload scripts and a locked-down `BrowserWindow`.

7. **An Offline-First Resilient System** — Every API call has a graceful 3-tier fallback. It never crashes the UI even with zero infrastructure.

---

## 3. Full Technology Stack

### 3.1 Frontend Runtime Dependencies (`package.json` → `dependencies`)

| Package | Version | Why It's Here | What It Does |
|:--------|:--------|:--------------|:-------------|
| `react` | `^19.2.8` | Core UI framework | Concurrent rendering, hooks, suspense boundaries |
| `react-dom` | `^19.2.8` | React DOM renderer | Mounts React trees to the browser DOM |
| `react-router-dom` | `^7.18.2` | Client-side routing | `HashRouter`, `Routes`, `Route`, `Navigate`, `useParams` |
| `@tanstack/react-query` | `^5.101.4` | Server state management | Async data fetching, caching (5-min stale time), mutations, 1 retry |
| `zustand` | `^5.0.14` | Global client state | `useAuthStore` (auth/dev mode) + `useUiStore` (theme/steps/toasts) |
| `zod` | `^4.4.3` | Runtime schema validation | Validates all API responses against contracts before they touch React state |
| `mermaid` | `^11.16.0` | Diagram rendering | Client-side rendering of dependency flow diagrams from AI output |
| `lucide-react` | `^1.28.0` | Icon library | All SVG icons in dashboards, sidebar, buttons, status badges |
| `clsx` | `^2.1.1` | Conditional classNames | Clean className composition without string concatenation |
| `tailwind-merge` | `^3.6.0` | TailwindCSS class merging | Resolves conflicting Tailwind utilities when multiple variants apply |
| `@prisma/client` | `^7.9.1` | Database ORM client | Type-safe query client auto-generated from `schema.prisma` |
| `@prisma/adapter-pg` | `^7.9.1` | Prisma PostgreSQL adapter | Connects Prisma Client to the `pg` Node.js driver |
| `pg` | `^8.22.0` | PostgreSQL Node.js driver | Low-level connection pool for PostgreSQL 15+ |
| `@types/pg` | `^8.20.4` | TypeScript types for `pg` | Type definitions for pg's API |

### 3.2 Frontend Build / Dev Dependencies (`devDependencies`)

| Package | Version | Why It's Here | What It Does |
|:--------|:--------|:--------------|:-------------|
| `vite` | `^8.2.0` | Build tool + dev server | Ultra-fast HMR, ES module bundling, dev proxy config |
| `@vitejs/plugin-react` | `^6.0.4` | Vite React plugin | JSX transform + React Fast Refresh via Babel |
| `tailwindcss` | `^4.3.3` | CSS utility framework | Utility-first classes, dark mode via `.dark` class on `<html>` |
| `@tailwindcss/vite` | `^4.3.3` | Tailwind v4 Vite plugin | Processes Tailwind CSS at build time inside Vite (no PostCSS needed) |
| `typescript` | `~6.0.2` | TypeScript compiler | Static typing across frontend + Vercel API functions |
| `@types/react` | `^19.2.17` | React type definitions | JSX types, hook signatures, component prop types |
| `@types/react-dom` | `^19.2.3` | React DOM types | `ReactDOM.createRoot`, event handler types |
| `@types/node` | `^24.13.3` | Node.js type definitions | `process.env`, `path`, `Buffer` for config files |
| `vitest` | `^4.1.10` | Test runner | Fast Vite-native test execution (shares same Vite config) |
| `@testing-library/react` | `^16.3.2` | React component testing | `render`, `screen`, `fireEvent`, `waitFor` |
| `@testing-library/jest-dom` | `^7.0.0` | DOM matchers | `toBeInTheDocument()`, `toHaveTextContent()`, etc. |
| `@testing-library/user-event` | `^14.6.1` | User interaction sim | Realistic `click`, `type`, keyboard event simulation |
| `jsdom` | `^30.0.1` | DOM environment | Simulates browser DOM in Node.js for Vitest |
| `oxlint` | `^1.75.0` | Rust-native JS/TS linter | Extremely fast linting, config via `.oxlintrc.json` |
| `@vercel/node` | `^5.9.5` | Vercel Node.js runtime | `VercelRequest`/`VercelResponse` types for API functions |
| `concurrently` | `^9.2.0` | Concurrent process runner | Runs Vite dev server AND Electron simultaneously |
| `wait-on` | `^8.0.3` | Process readiness checker | Waits for `http://localhost:5173` before launching Electron |
| `electron` | `^34.2.0` | Desktop app runtime | Native Chromium + Node.js window |
| `electron-builder` | `^25.1.8` | Desktop packager | AppImage + tar.gz (Linux), NSIS + portable (Windows) |
| `cross-env` | `^7.0.3` | Cross-platform env vars | Sets env variables in npm scripts across OS platforms |
| `prisma` | `^7.9.1` | Prisma CLI | `prisma generate`, `prisma migrate`, schema management |

### 3.3 Rust Backend Crates (`backend/Cargo.toml`)

| Crate | Version | Features Used | Purpose |
|:------|:--------|:-------------|:--------|
| `tokio` | `1.38` | `full` | Multi-threaded async runtime for all I/O-bound handlers |
| `axum` | `0.7` | — | HTTP routing, JSON extractors, middleware, `State` injection |
| `tower-http` | `0.5` | `cors`, `trace` | Permissive `CorsLayer` + request tracing middleware |
| `reqwest` | `0.12` | `json`, `rustls-tls` | HTTP client for calling NVIDIA NIM / DeepSeek APIs |
| `serde` | `1.0` | `derive` | `#[derive(Serialize, Deserialize)]` on all data structs |
| `serde_json` | `1.0` | — | JSON encode/decode for AI responses and DB `jsonb` fields |
| `tracing` | `0.1` | — | Structured logging (`info!`, `warn!`) throughout |
| `tracing-subscriber` | `0.3` | — | `fmt` subscriber — writes structured logs to stdout |
| `dotenvy` | `0.15` | — | Loads `backend/.env` into `std::env` at startup |
| `sqlx` | `0.8` | `runtime-tokio-rustls`, `postgres`, `uuid`, `chrono`, `json` | Async PostgreSQL pool with compile-time query checking |
| `uuid` | `1` | `v4` | UUID generation for all DB primary keys |
| `chrono` | `0.4` | `serde` | DateTime serialization for Postgres `timestamptz` |

### 3.4 External Services & Third-Party APIs

| Service | Base URL | Used By | Purpose |
|:--------|:---------|:--------|:--------|
| **NVIDIA NIM API** | `https://integrate.api.nvidia.com/v1` | Rust agents + `nvidiaEngine.ts` | Runs `meta/llama-3.1-70b-instruct` for analysis, blueprint, transformation |
| **DeepSeek API** | `https://api.deepseek.com` | Rust `CoreAnalysisAgent` fallback | Alternative when key does not start with `nvapi-` |
| **AIML API** | `https://api.aimlapi.com/v1` | Vite proxy + Vercel rewrite | Alternative AI provider option |
| **PostgreSQL 15+** | Via `DATABASE_URL` | Prisma ORM + SQLx `PgPool` | Persistent relational storage for all migration artifacts |
| **Vercel** | `vercel.com` | Deployment target | Hosts React SPA + Node.js serverless functions |

---

## 4. Complete Filesystem Tree

Every file and directory in the workspace, with its role:

```
/home/baanbhaba/projects/demux/
│
├── .env                          ← Runtime secrets (DATABASE_URL, AI keys) — NOT committed to git
├── .env.example                  ← Template: all required env var keys with placeholder values
├── .env.local                    ← Local dev overrides (1232B) — higher priority than .env
├── .gitignore                    ← Ignores: node_modules/, dist/, target/, backend/target/, *.env
├── .oxlintrc.json                ← Oxlint rules config (245B) — Rust-native JS/TS linter
├── .vercel/                      ← Vercel CLI project cache (project ID, org ID) — NOT committed
├── .vercelignore                 ← Tells Vercel to skip: backend/ and electron/
├── .git/                         ← Git repository metadata (history, refs, config)
│
├── index.html                    ← HTML entry point; mounts <div id="root">; loads Google Fonts
├── package.json                  ← Root manifest: all deps, scripts, electron-builder config
├── package-lock.json             ← NPM lockfile (460KB) — exact resolved dependency tree
├── tsconfig.json                 ← Root TS config: references tsconfig.app.json + tsconfig.node.json
├── tsconfig.app.json             ← App TS: strict mode, DOM lib, JSX=react-jsx, bundler moduleRes
├── tsconfig.node.json            ← Node TS: for vite.config.ts + api/*.ts files
├── vite.config.ts                ← Vite: plugins, dev proxy (/api→:8080, /nvidia-api, /aiml-api)
├── vercel.json                   ← Vercel: 17 URL rewrites + SPA catch-all rewrite
├── prisma.config.ts              ← Prisma configuration entrypoint
├── README.md                     ← Project overview and quick-start guide
│
├── this is us.md                 ← Previous documentation iteration
├── this is us iteration CLAUDE.md ← THIS FILE — complete technical reference
│
├── prisma/
│   └── schema.prisma             ← 12 Prisma data models → PostgreSQL table definitions
│
├── public/
│   ├── favicon.svg               ← App favicon (SVG, sharp at all sizes)
│   └── icons.svg                 ← SVG sprite sheet for UI icons
│
├── api/                          ← Vercel Serverless Function API Routes (Node.js TypeScript)
│   ├── tsconfig.json             ← TS config scoped to /api — references @vercel/node types
│   ├── ai/
│   │   └── chat.ts               ← POST /api/v1/ai/chat — Server-side AI proxy (key held server-side)
│   └── projects/
│       ├── index.ts              ← GET /api/v1/projects + POST /api/v1/projects
│       └── [id]/
│           ├── index.ts          ← GET /api/v1/projects/:id + DELETE /api/v1/projects/:id
│           ├── audit.ts          ← GET /api/v1/projects/:id/audit (core + impact combined)
│           ├── readiness.ts      ← GET /api/v1/projects/:id/readiness
│           ├── consensus.ts      ← GET /api/v1/projects/:id/consensus
│           ├── blueprint.ts      ← GET blueprint + POST approve-all
│           ├── transform.ts      ← POST /api/v1/projects/:id/transform
│           ├── report.ts         ← GET /api/v1/projects/:id/report
│           └── blueprint/
│               └── steps/
│                   └── [stepId].ts ← PATCH step | POST ?action=approve | POST ?action=reject
│
├── backend/                      ← Rust High-Performance Orchestration Engine
│   ├── Cargo.toml                ← Rust package manifest (crate: "ema-backend")
│   ├── Cargo.lock                ← Exact cargo dependency lockfile (63KB)
│   ├── .env                      ← Backend env: DATABASE_URL, NVIDIA_API_KEY, PORT
│   ├── .env.example              ← Backend env template
│   ├── target/                   ← Cargo build artifacts (binaries, incremental cache)
│   └── src/
│       ├── main.rs               ← Axum server entry: routes, DB pool init, CORS, startup
│       ├── agents/
│       │   ├── mod.rs            ← Exports: core_analysis + impact_analysis modules
│       │   ├── core_analysis.rs  ← CoreAnalysisAgent: prompts AI, fallback generation
│       │   └── impact_analysis.rs← ImpactAnalysisAgent: blast radius, API surface scan
│       ├── db/
│       │   ├── mod.rs            ← Exports: create_pool() + repository module
│       │   └── repository.rs     ← upsert_core_audit, upsert_impact_audit, update_project_stage
│       └── models/
│           ├── mod.rs            ← Exports: contracts module
│           └── contracts.rs      ← Rust structs: CoreAudit, ImpactAudit, DetectedStackItem, etc.
│
├── electron/                     ← Native Desktop Application Wrapper
│   ├── main.js                   ← ES module version of Electron main process
│   ├── main.cjs                  ← CJS version — ACTUAL ENTRY (package.json "main")
│   ├── preload.js                ← ES module sandbox preload
│   └── preload.cjs               ← CJS sandbox preload (contextBridge, no nodeIntegration)
│
├── dist/                         ← Vite production build output (React SPA bundle)
│
└── src/                          ← React Frontend Application Source
    ├── main.tsx                  ← Entry: renders <App /> inside React.StrictMode
    ├── App.tsx                   ← HashRouter, QueryClientProvider, ProtectedLayout auth guard
    ├── App.css                   ← Custom keyframe animations, utility classes
    ├── index.css                 ← TailwindCSS v4 @import, global dark theme color vars
    │
    ├── assets/
    │   ├── hero.png              ← Dashboard banner graphic
    │   ├── react.svg             ← React logo
    │   └── vite.svg              ← Vite logo
    │
    ├── lib/
    │   └── prisma.ts             ← Prisma Client singleton with @prisma/adapter-pg
    │
    ├── types/
    │   └── contracts.ts          ← MASTER: all Zod schemas + all inferred TypeScript types
    │
    ├── store/
    │   ├── useAuthStore.ts       ← Zustand auth (persisted to sessionStorage as "ema-auth-store")
    │   └── useUiStore.ts         ← Zustand UI (theme, drawers, step tracking, toasts, error sim)
    │
    ├── utils/
    │   └── exportRustCode.ts     ← stripRustComments, sanitizeRustCode, downloadCombinedRustProject,
    │                                downloadCargoToml — code post-processing + browser file downloads
    │
    ├── api/
    │   ├── client.ts             ← fetchApi<T>() wrapper, BASE_URL builder, error simulation toggle
    │   ├── index.ts              ← Re-exports all service modules
    │   ├── project.ts            ← Project CRUD; detectJavaStack(); detectJavaDeprecatedUsages();
    │   │                           detectJavaImpactAudit(); getCoreAudit(); getImpactAudit();
    │   │                           calculateDynamicReadinessScore(); calculateDynamicConsensus();
    │   │                           getReadinessScore(); getConsensusResult()
    │   ├── review.ts             ← getBlueprint(); approveBlueprintStep(); rejectBlueprintStep();
    │   │                           updateBlueprintStep(); approveAllBlueprintSteps();
    │   │                           regenerateBlueprintWithNvidiaAI()
    │   ├── transform.ts          ← triggerTransformation(); generateRustCodeFromJava();
    │   │                           isJavaSourceCode(); getTransformationStatus()
    │   ├── report.ts             ← getMigrationReport(); generateMigrationReport()
    │   ├── nvidiaEngine.ts       ← callAiProxy(); analyzeCoreWithNvidia();
    │   │                           analyzeImpactWithNvidia(); generateBlueprintWithNvidia()
    │   └── mockData.ts           ← MOCK_PROJECTS, MOCK_CORE_AUDITS, MOCK_IMPACT_AUDITS,
    │                               MOCK_CONSENSUS, MOCK_READINESS_SCORES (25KB seed data)
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.tsx              ← Shell: Header + Sidebar + HamburgerDrawer + <main>
    │   │   ├── Header.tsx              ← Project switcher, theme toggle, dev badge, profile dropdown
    │   │   ├── Sidebar.tsx             ← Stage navigation links + progress indicators
    │   │   └── HamburgerDrawer.tsx     ← Mobile slide-in navigation drawer
    │   ├── common/
    │   │   ├── Button.tsx              ← Accessible button with variant/size props
    │   │   ├── Card.tsx                ← Glassmorphism bordered card wrapper
    │   │   ├── Badge.tsx               ← Status: pending/approved/rejected/risk levels
    │   │   ├── Modal.tsx               ← Accessible backdrop modal dialog
    │   │   ├── MermaidDiagram.tsx      ← Client-side Mermaid graph renderer
    │   │   ├── LoadingSkeleton.tsx     ← Animated shimmer skeleton placeholder
    │   │   ├── ErrorState.tsx          ← Error container with retry action button
    │   │   └── PipelineNarrativeBanner.tsx ← Dynamic banner: current stage + progress
    │   ├── blueprint/
    │   │   ├── StepCard.tsx            ← Step card: details, diff, approve/reject/edit actions
    │   │   ├── StepEditModal.tsx       ← Modal: edit step target code + description
    │   │   ├── StepRejectModal.tsx     ← Modal: enter rejection reason (required)
    │   │   └── ConfirmBulkApproveModal.tsx ← Safety confirmation before "Approve All & Execute"
    │   └── report/
    │       ├── DiffViewer.tsx          ← Side-by-side colorized Java vs Rust diff
    │       ├── ValidationBadge.tsx     ← Build status + unit test pass/fail indicator
    │       └── RollbackSection.tsx     ← Rollback: copyable shell scripts + SQL undo statements
    │
    ├── pages/
    │   ├── DashboardPage.tsx     ← Route /  — Project metrics, upload modal, project list
    │   ├── CoreAuditPage.tsx     ← Route /projects/:id/core-audit — Stack table, Mermaid
    │   ├── ImpactAuditPage.tsx   ← Route /projects/:id/impact-audit — API surface, blast radius
    │   ├── ReadinessPage.tsx     ← Route /projects/:id/readiness — Score gauge, conflicts
    │   ├── BlueprintPage.tsx     ← Route /projects/:id/blueprint — Step gate, AI blueprint
    │   ├── ReportPage.tsx        ← Route /projects/:id/report — Diffs, export, rollback
    │   ├── IntegrationsPage.tsx  ← Route /integrations — Backend/AI/DB connection status
    │   ├── AccountPage.tsx       ← Route /account — User settings, API key management
    │   ├── SettingsPage.tsx      ← Route /settings — Theme, error simulation, config
    │   └── LoginPage.tsx         ← Route /login — Authentication interface
    │
    └── tests/
        ├── setup.ts                          ← Vitest setup: imports @testing-library/jest-dom
        ├── BlueprintPage.test.tsx            ← RTL: step inspection enforcement, modal interactions
        ├── liveNvidiaIntegration.test.ts     ← E2E: AI prompt/response schema integrity
        ├── nvidiaBlueprintVerification.test.ts ← Schema validation for AI-generated blueprints
        ├── exportRustCode.test.ts            ← Unit: comment stripping, Axum 0.6→0.7 upgrade
        └── readinessAndConsensus.test.ts     ← Math: readiness formula + consensus logic
```

---

## 5. All APIs

### 5.1 Rust Backend HTTP API (Port 8080 default)

The Rust backend (Axum 0.7 + Tokio) exposes exactly 3 HTTP endpoints:

| Method | Route | Handler Function | Description |
|:-------|:------|:----------------|:------------|
| `GET` | `/api/v1/health` | `health_check` | Returns `{status, service, version, db}`. Runs `SELECT 1` to verify DB connectivity. |
| `POST` | `/api/v1/analyze/core` | `run_core_analysis` | Body: `{project_id?, ingestion_manifest, deepseek_api_key?, model?}` → `CoreAnalysisAgent.analyze()` → persists to DB → returns `CoreAudit` JSON |
| `POST` | `/api/v1/analyze/impact` | `run_impact_analysis` | Same shape → `ImpactAnalysisAgent.analyze()` → persists to DB → returns `ImpactAudit` JSON |

**API Key resolution order (Rust backend):**
1. `payload.deepseek_api_key` (from request body)
2. `NVIDIA_API_KEY` env var
3. `DEEPSEEK_API_KEY` env var
4. None found → `400 BAD_REQUEST`

**Endpoint routing (CoreAnalysisAgent):**
- Key starts with `"nvapi-"` → `https://integrate.api.nvidia.com/v1/chat/completions`
- Otherwise → `https://api.deepseek.com/chat/completions`

**After successful analysis:**
```
upsert_core_audit(db, project_id, &audit)  →  update_project_stage(db, project_id, "readiness", 92)
```

### 5.2 Vercel Serverless API Functions

All under `/api/` directory, TypeScript, Node.js runtime:

| Method | Public Path (`/api/v1/...`) | Handler File | Description |
|:-------|:---------------------------|:-------------|:------------|
| `POST` | `/api/v1/ai/chat` | `api/ai/chat.ts` | AI proxy — holds `NVIDIA_API_KEY` server-side, never sent to browser |
| `GET` | `/api/v1/projects` | `api/projects/index.ts` | List all projects from DB |
| `POST` | `/api/v1/projects` | `api/projects/index.ts` | Create new project in DB |
| `GET` | `/api/v1/projects/:id` | `api/projects/[id]/index.ts` | Fetch single project |
| `DELETE` | `/api/v1/projects/:id` | `api/projects/[id]/index.ts` | Delete project (CASCADE on all child records) |
| `GET` | `/api/v1/projects/:id/audit` | `api/projects/[id]/audit.ts` | Returns `{core, impact}` audit pair |
| `GET` | `/api/v1/projects/:id/readiness` | `api/projects/[id]/readiness.ts` | Returns readiness score + breakdown |
| `GET` | `/api/v1/projects/:id/consensus` | `api/projects/[id]/consensus.ts` | Returns multi-agent consensus result |
| `GET` | `/api/v1/projects/:id/blueprint` | `api/projects/[id]/blueprint.ts` | Returns blueprint with all steps |
| `POST` | `/api/v1/projects/:id/blueprint/approve-all` | `api/projects/[id]/blueprint.ts` | Bulk approve all pending steps |
| `PATCH` | `/api/v1/projects/:id/blueprint/steps/:stepId` | `api/projects/[id]/blueprint/steps/[stepId].ts` | Edit step fields |
| `POST` | `.../steps/:stepId/approve` | Same (`?action=approve`) | Approve single step |
| `POST` | `.../steps/:stepId/reject` | Same (`?action=reject`) | Reject with reason |
| `POST` | `/api/v1/projects/:id/transform` | `api/projects/[id]/transform.ts` | Trigger code transformation |
| `GET` | `/api/v1/projects/:id/report` | `api/projects/[id]/report.ts` | Fetch final migration report |

### 5.3 Frontend API Client (`src/api/client.ts`)

```
BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1"
```

`fetchApi<T>(endpoint, options)` does:
1. If `simulateErrorsGlobal === true` → throws `"Simulated Backend API Error: 503 Service Unavailable"` immediately
2. Constructs full URL (handles absolute URLs and relative paths)
3. Merges `Content-Type: application/json` into headers
4. `fetch()` with all options
5. On non-OK response → reads error text, throws with status + message
6. Detects HTML responses (Vercel SPA rewrite collision) → throws informative error
7. `JSON.parse(text)` → returns typed `T`

### 5.4 Vite Dev Server Proxy Rules

| Source Prefix | Target | Notes |
|:-------------|:-------|:------|
| `/api` | `http://localhost:8080` | All `/api/v1/*` → local Rust backend |
| `/nvidia-api` | `https://integrate.api.nvidia.com/v1` | Strips `/nvidia-api` prefix on rewrite |
| `/aiml-api` | `https://api.aimlapi.com/v1` | Strips `/aiml-api` prefix on rewrite |

Both `changeOrigin: true` and `secure: false` so self-signed certs are not rejected in dev.

### 5.5 Vercel URL Rewrites (`vercel.json`) — All 17 Rules

```
/aiml-api/:path*                                   → https://api.aimlapi.com/v1/:path*
/nvidia-api/:path*                                 → https://integrate.api.nvidia.com/v1/:path*
/api/v1/ai/chat                                    → /api/ai/chat
/api/v1/projects/:id/blueprint/steps/:stepId/approve → /api/projects/:id/blueprint/steps/:stepId?action=approve
/api/v1/projects/:id/blueprint/steps/:stepId/reject  → /api/projects/:id/blueprint/steps/:stepId?action=reject
/api/v1/projects/:id/blueprint/steps/:stepId         → /api/projects/:id/blueprint/steps/:stepId
/api/v1/projects/:id/blueprint/approve-all           → /api/projects/:id/blueprint
/api/v1/projects/:id/blueprint                       → /api/projects/:id/blueprint
/api/v1/projects/:id/readiness                       → /api/projects/:id/readiness
/api/v1/projects/:id/consensus                       → /api/projects/:id/consensus
/api/v1/projects/:id/report                          → /api/projects/:id/report
/api/v1/projects/:id/audit                           → /api/projects/:id/audit
/api/v1/projects/:id/transform                       → /api/projects/:id/transform
/api/v1/projects/:id                                 → /api/projects/:id
/api/v1/projects                                     → /api/projects
/((?!api/|assets/|favicon.ico).*)                    → /index.html   (SPA catch-all)
```

---

## 6. The Database Schema

**Provider:** PostgreSQL 15+ | **ORM:** Prisma 7.9.1 | **Adapter:** `@prisma/adapter-pg`

### Model 1: `User` → table `users`

| Column | Type | Constraint | Purpose |
|:-------|:-----|:-----------|:--------|
| `id` | String (UUID) | PK, auto | Primary identifier |
| `email` | String | UNIQUE | Login identifier |
| `username` | String | UNIQUE | Display name |
| `passwordHash` | String | — | Bcrypt-hashed, never stored plain |
| `role` | String | default `"developer"` | Access role |
| `devApiKey` | String? | nullable | Personal NVIDIA/AI API key |
| `createdAt` | DateTime | auto-set | Insert timestamp |
| `updatedAt` | DateTime | auto-update | Change timestamp |

Relations: `projects Project[]`, `auditHistory AuditHistory[]`

### Model 2: `Project` → table `projects`

| Column | Type | Constraint | Purpose |
|:-------|:-----|:-----------|:--------|
| `id` | String (UUID) | PK | Primary identifier |
| `name` | String | — | Human-readable project name |
| `repoUrl` | String? | nullable | GitHub/GitLab URL |
| `stage` | String | default `"core_audit"` | Current pipeline stage |
| `readinessScore` | Int | default `0` | 0-100 computed score |
| `userId` | String? | FK → User (nullable) | Owner (null = anonymous) |

Relations: `user`, `coreAudit`, `impactAudit`, `readinessAssessment`, `blueprint`, `transformations[]`, `migrationReport`, `rustExports[]`, `uploadedSources[]`, `auditHistory[]`

### Model 3: `UploadedSource` → table `uploaded_sources`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | UUID | PK |
| `projectId` | String | FK → Project (CASCADE DELETE) |
| `fileName` | String | e.g. `"Main.java"` |
| `rawCode` | String | Full Java source text |
| `language` | String | default `"java"` |
| `astData` | Json? | Parsed AST (optional, `jsonb`) |

### Model 4: `CoreAudit` → table `core_audits`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | UUID | PK |
| `projectId` | String | UNIQUE FK → Project (CASCADE) |
| `architectureSummary` | String | AI-generated summary |
| `detectedStack` | Json | `[{technology, version, status}]` |
| `deprecatedUsages` | Json | `[{file, line, pattern, recommended_replacement}]` |
| `dependencyGraph` | Json | `{nodes: string[], edges: {from, to}[]}` |
| `diagrams` | Json | `[{type, format, content}]` — Mermaid strings |
| `confidence` | Float | default `0.9` — AI self-rated |

### Model 5: `ImpactAudit` → table `impact_audits`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | UUID | PK |
| `projectId` | String | UNIQUE FK → Project (CASCADE) |
| `apiSurface` | Json | `[{endpoint_or_interface, consumers[], breaking_change_risk}]` |
| `databaseImpacts` | Json | `[{component, risk, notes}]` |
| `configImpacts` | Json | `[{file, risk, notes}]` |
| `dependencyRisks` | Json | `[{library, current_version, target_version, known_breaking_changes[]}]` |
| `blastRadius` | Json | `[{change, affected_files[], severity}]` |
| `confidence` | Float | default `0.9` |

### Model 6: `ReadinessAssessment` → table `readiness_assessments`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | UUID | PK |
| `projectId` | String | UNIQUE FK → Project (CASCADE) |
| `overallScore` | Int | 0-100 weighted composite |
| `breakdown` | Json | `{architecture_understanding, dependency_resolution, api_compatibility, configuration_completeness, migration_feasibility, breaking_change_risk, rollback_availability}` |
| `consensusIteration` | Int | default `1` |
| `consensusConflicts` | Json | `[{topic, core_position, impact_position, resolved}]` |
| `unifiedConfidence` | Float | Average of both agent confidences |
| `shouldIterateAgain` | Boolean | Whether more rounds needed |

### Model 7: `Blueprint` → table `blueprints`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | UUID | PK |
| `projectId` | String | UNIQUE FK → Project (CASCADE) |
| `version` | Int | default `1`, increments on AI regen |

Relation: `steps BlueprintStep[]`

### Model 8: `BlueprintStep` → table `blueprint_steps`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | UUID | PK |
| `blueprintId` | String | FK → Blueprint (CASCADE) |
| `stepNumber` | Int | Ordered position |
| `fileOrModule` | String | Target Java class/file |
| `whatChanges` | String | Human-readable change description |
| `why` | String | Migration rationale |
| `targetPattern` | String | AI-generated target Rust/Java 21 code |
| `riskLevel` | String | `"low"` / `"medium"` / `"high"` |
| `dependsOn` | String[] | Step IDs this step must follow |
| `status` | String | `"pending"` / `"approved"` / `"rejected"` |
| `rejectionReason` | String? | Developer's rejection comment |

Relation: `transformations Transformation[]`

### Model 9: `Transformation` → table `transformations`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | UUID | PK |
| `projectId` | String | FK → Project (CASCADE) |
| `stepId` | String? | FK → BlueprintStep (nullable) |
| `status` | String | `"completed"` / `"failed"` / `"in_progress"` |
| `rawJavaCode` | String | Original Java source |
| `transformedRustCode` | String | AI-synthesized Rust output |
| `errorDetail` | String? | Error message if failed |
| `modelUsed` | String | default `"meta/llama-3.1-70b-instruct"` |

### Model 10: `MigrationReport` → table `migration_reports`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | UUID | PK |
| `projectId` | String | UNIQUE FK → Project (CASCADE) |
| `totalUnits` | Int | Number of transformed units |
| `filesModified` | String[] | Java files transformed |
| `summaryStats` | Json | `{total_units, approved, rejected, high_risk_steps, ...}` |
| `diffEntries` | Json | `[{unit, diff, validation, approved_by, approved_at}]` |
| `rollbackPlan` | String | Shell script + SQL undo statements (plaintext) |

### Model 11: `RustExport` → table `rust_exports`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | UUID | PK |
| `projectId` | String | FK → Project (CASCADE) |
| `exportName` | String | Filename (e.g. `"project_migrated_main.rs"`) |
| `combinedRustCode` | String | Full combined Rust source |
| `cargoTomlContent` | String | Full generated `Cargo.toml` |

### Model 12: `AuditHistory` → table `audit_history`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | UUID | PK |
| `userId` | String? | FK → User (nullable) |
| `projectId` | String? | FK → Project (nullable) |
| `action` | String | e.g. `"blueprint_step_approved"` |
| `metadata` | Json | Arbitrary key-value context |

---

## 7. Frontend Architecture

### 7.1 Entry Point Chain

```
index.html
  └── <script type="module" src="/src/main.tsx">
        └── ReactDOM.createRoot(document.getElementById('root'))
              └── <React.StrictMode>
                    └── <App />
```

### 7.2 `App.tsx` — Application Root

Sets up three things in this order:
- `QueryClient` — `retry: 1`, `refetchOnWindowFocus: false`, `staleTime: 300_000ms`
- `QueryClientProvider` wrapping everything
- `HashRouter` — hash-based routing (`/#/path`) essential for Electron `file://` + Vercel static

**Why HashRouter?** Electron loads `file:///dist/index.html`. `BrowserRouter` would navigate to `file:///projects/abc` — a nonexistent file. `HashRouter` keeps everything after `#` purely client-side.

**Route guard:** `ProtectedLayout` checks `useAuthStore().isAuthenticated`. If false → `<Navigate to="/login" replace />`. The `replace` prevents the back button from looping.

### 7.3 All Routes

| Path | Component | Auth | Description |
|:-----|:----------|:-----|:------------|
| `/login` | `LoginPage` | No | Authentication screen |
| `/` | `DashboardPage` | Yes | Home — project list, metrics, upload |
| `/projects/:id/core-audit` | `CoreAuditPage` | Yes | Stage 2 — AST analysis results |
| `/projects/:id/impact-audit` | `ImpactAuditPage` | Yes | Stage 3 — breaking change assessment |
| `/projects/:id/readiness` | `ReadinessPage` | Yes | Stage 4 — score + consensus conflicts |
| `/projects/:id/blueprint` | `BlueprintPage` | Yes | Stage 5 — human review gate |
| `/projects/:id/report` | `ReportPage` | Yes | Stage 7 — report + exports + rollback |
| `/settings` | `SettingsPage` | Yes | Global preferences + error sim toggle |
| `/account` | `AccountPage` | Yes | User profile + API key management |
| `/integrations` | `IntegrationsPage` | Yes | Backend/AI/DB connection status |
| `*` | `Navigate to /` | Yes | 404 catch-all |

### 7.4 Layout Shell Components

**`Layout.tsx`** renders: `<Header>` + `<Sidebar>` + `<HamburgerDrawer>` + `<main>{children}</main>`

**`Header.tsx`** — fixed top bar:
- Project switcher dropdown
- Theme toggle (`toggleDarkMode()` → adds/removes `.dark` class on `document.documentElement`)
- Dev mode badge (visible when `isDevMode === true`)
- Profile dropdown (username + logout)

**`Sidebar.tsx`** — fixed left navigation:
- ALCHEMI logo + brand
- Stage links: Core Audit → Impact → Readiness → Blueprint → Report
- Stage progress indicators (highlights current)

**`HamburgerDrawer.tsx`** — mobile equivalent, toggled via `isHamburgerOpen` in `useUiStore`

---

## 8. Backend Architecture

### 8.1 Startup Sequence (`backend/src/main.rs`)

```
1. dotenvy::dotenv().ok()                    → load backend/.env
2. tracing_subscriber::fmt::init()           → stdout structured logging
3. db::create_pool().await                   → PostgreSQL pool (SQLx PgPool)
4. AppState { db: pool }                     → shared state (cheaply clonable via Arc)
5. CorsLayer::new().allow_origin(Any)        → permissive CORS
       .allow_methods(Any).allow_headers(Any)
6. Router::new()
     .route("/api/v1/health", get(health_check))
     .route("/api/v1/analyze/core", post(run_core_analysis))
     .route("/api/v1/analyze/impact", post(run_impact_analysis))
     .layer(cors).with_state(state)
7. PORT env var (default: 8080)
8. TcpListener::bind(addr).await → axum::serve(listener, app)
```

**`AnalyzeRequest` body shape:**
```rust
struct AnalyzeRequest {
    project_id: Option<String>,       // if set → result persisted to DB
    ingestion_manifest: String,       // raw Java source code
    deepseek_api_key: Option<String>, // optional key override from client
    model: Option<String>,            // optional model override
}
```

### 8.2 CoreAnalysisAgent (`core_analysis.rs`)

- Holds `reqwest::Client`, `api_key: String`, `model: String` (default: `"meta/llama-3.1-70b-instruct"`)
- `analyze(&str) -> Result<CoreAudit, Box<dyn Error>>`
- Builds `DeepSeekRequest { model, messages: [system_prompt, user_message], temperature: 0.2 }`
- On success: strips markdown fences from response, `serde_json::from_str::<CoreAudit>()` 
- On ANY failure: returns rich hardcoded fallback (Java 8 + Spring Boot 2.7.18 detected stack, Mermaid diagram, confidence 0.95)

### 8.3 ImpactAnalysisAgent (`impact_analysis.rs`)

Same pattern as CoreAnalysisAgent:
- Prompt focuses on breaking change risk, API surface, database impacts
- Returns `ImpactAudit` struct
- Rich hardcoded fallback if AI unavailable

### 8.4 Database Repository (`db/repository.rs`)

```rust
// Three async functions:
pub async fn upsert_core_audit(pool: &PgPool, project_id: &str, audit: &CoreAudit)
// → serializes to serde_json::Value → INSERT ... ON CONFLICT (project_id) DO UPDATE

pub async fn upsert_impact_audit(pool: &PgPool, project_id: &str, audit: &ImpactAudit)
// → same pattern for impact_audits table

pub async fn update_project_stage(pool: &PgPool, project_id: &str, stage: &str, score: i32)
// → UPDATE projects SET stage=$2, readiness_score=$3 WHERE id=$1
```

### 8.5 Rust Data Contracts (`models/contracts.rs`)

Mirror of TypeScript `contracts.ts`. All structs derive `Serialize, Deserialize`:
```rust
pub struct CoreAudit {
    pub architecture_summary: String,
    pub detected_stack: Vec<DetectedStackItem>,
    pub deprecated_usages: Vec<DeprecatedUsage>,
    pub dependency_graph: DependencyGraph,
    pub diagrams: Vec<Diagram>,
    pub confidence: f64,
}
// DetectedStackItem, DeprecatedUsage, DependencyGraph, Diagram, ImpactAudit,
// ApiSurfaceItem, ImpactItem, DependencyRisk, BlastRadiusItem all defined here
```

---

## 9. AI Integration

### 9.1 Security Model

```
Browser → POST /api/v1/ai/chat → Vercel serverless function (api/ai/chat.ts)
                                         ↓
                                  process.env.NVIDIA_API_KEY  (SERVER-SIDE ONLY)
                                         ↓
                             https://integrate.api.nvidia.com/v1/chat/completions
                                         ↓
                                  meta/llama-3.1-70b-instruct
                                         ↓
                                  JSON response → browser
```

The `NVIDIA_API_KEY` **never** appears in the browser JavaScript bundle. It's set on the Vercel server only.

### 9.2 `nvidiaEngine.ts` — Frontend AI Service Layer

**`callAiProxy(messages, max_tokens = 900)`:**
- `POST /api/v1/ai/chat`
- Model: `"meta/llama-3.1-70b-instruct"` (hardcoded)
- Temperature: `0.1` (maximally deterministic)
- Returns `choices[0].message.content`

**`extractJsonBlock(rawText)`:**
- Regex `/\{[\s\S]*\}/` — finds first `{...}` in raw AI output
- Handles preamble text or trailing explanation from AI

**`analyzeCoreWithNvidia(projectName, javaCode)`:**
- System prompt embeds full JSON schema + input guardrail
- Guardrail: if input is NOT Java → return `{confidence: 0.0, detected_stack: [], ...}`

**`analyzeImpactWithNvidia(projectName, javaCode)`:**
- Same guardrail pattern for impact audit schema

**`generateBlueprintWithNvidia(projectId, projectName, javaCode)`:**
- max_tokens: `1000`
- Post-processes each step: validates `risk_level` in `["low","medium","high"]`, `depends_on` is array, `status = "pending"`
- Forces `parsed.project_id = projectId`

### 9.3 Code Transformation AI Prompt (`transform.ts`)

14-rule system prompt for code transformation:
1. Input must be Java — reject non-Java with error comment
2. Output ONLY pure Rust (no markdown, no comments)
3. No markdown fences
4. No `//` or `/* */` comments
5. No non-existent macros like `import_axum_prelude!()`
6. Always `io::stdout().flush().unwrap()` before stdin reads
7. Never `let mut stdin` — use `io::stdin().read_line()` directly
8. Always `.trim()` on stdin input
9. Model Java classes as `struct + impl`
10. Semantic preservation: CLI app stays CLI, web app becomes Axum
11. Use Axum 0.7 syntax
12. 4-space indentation
13. Preserve exact domain behavior (CoffeeBot stays CoffeeBot)
14. `&self` for reads, `&mut self` for mutations

**3-tier transformation fallback:**
```
1. POST /api/v1/ai/chat (NVIDIA NIM via server proxy)
2. POST /projects/:id/steps/:stepId/transform (Vercel function)
3. generateRustCodeFromJava() (local deterministic generator)
```

### 9.4 Input Guardrails Summary

| AI Function | Non-Java Input Response |
|:-----------|:------------------------|
| Core Audit | `{architecture_summary: "ERROR: Invalid input...", confidence: 0.0, detected_stack: [], ...}` |
| Impact Audit | `{confidence: 0.0, api_surface: [], database_impacts: [], ...}` |
| Blueprint | `{steps: [{status: "rejected", why: "ERROR: Input is not valid Java source code"}]}` |
| Transform | `"// ERROR: Invalid input. Please provide valid Java source code for legacy migration."` |

### 9.5 Local Rust Code Generator (`generateRustCodeFromJava`)

Deterministic fallback when AI is unavailable:

- **Java detection:** regex `/\b(class|interface|public|private|import\s+java|void|static\s+void\s+main|@SpringBootApplication|...)\b/`
- **Special case — CoffeeBot:** if code contains `"CoffeeBot"` or `map[x][y] != 'C'` → generates authentic Rust grid simulation with `rand::Rng`
- **Main class pattern:** `static void main` → generates `struct + impl + fn main()` with stdin reading
- **POJO pattern:** default → generates minimal `pub struct + impl new()`

---

## 10. State Management

### 10.1 `useAuthStore` — Auth Store

**Storage:** persisted to `sessionStorage` under key `"ema-auth-store"` via `zustand/middleware persist`

**State:**
```typescript
{
  isAuthenticated: boolean   // true = logged in
  username: string | null    // display name
  token: string | null       // session token
  isDevMode: boolean         // superuser dev mode flag
  devApiKey: string          // user's NVIDIA API key
  devBaseUrl: string         // default: "https://integrate.api.nvidia.com/v1"
}
```

**`login(u, p)` — Three paths:**
1. `u === "baanbhaba" && p === "baanbhaba"` → sets `isDevMode: true`, `token: "baanbhaba-dev-session-active"` — bypasses all backend
2. Try `POST /api/v1/auth/login` — success if `res.success === true`
3. Backend down → fallback accepts ANY non-empty credentials with `isDevMode: false`

**`logout()`** → resets all fields to defaults

**`setDevApiConfig(apiKey, baseUrl)`** → updates dev API key and base URL

### 10.2 `useUiStore` — UI Store

**Storage:** in-memory only (no persistence across refresh)

**State:**
```typescript
{
  isDarkMode: boolean                      // default: true
  isHamburgerOpen: boolean                 // mobile drawer open/close
  viewedSteps: Record<string, string[]>    // {[projectId]: [stepId, stepId, ...]}
  expandedSteps: string[]                  // currently expanded accordion step IDs
  isSimulatingApiError: boolean            // 503 error simulation toggle
  notifications: ToastNotification[]       // {id, message, type}[]
}
```

**Key actions:**

`toggleDarkMode()`:
```typescript
const next = !state.isDarkMode;
if (next) document.documentElement.classList.add("dark");
else document.documentElement.classList.remove("dark");
return { isDarkMode: next };
```
TailwindCSS dark mode reads the `.dark` class on `<html>`.

`markStepViewed(projectId, stepId)`:
```typescript
const current = state.viewedSteps[projectId] || [];
if (current.includes(stepId)) return state;  // idempotent
return { viewedSteps: { ...state.viewedSteps, [projectId]: [...current, stepId] } };
```

`addNotification(message, type)`:
- Generates unique ID: `Date.now().toString(36) + Math.random().toString(36).substring(2,5)`
- Appends to `notifications` array
- `setTimeout(() => removeNotification(id), 4000)` — auto-dismisses

`toggleSimulateApiError()`:
- Flips `isSimulatingApiError`
- When `true`: `fetchApi` throws 503 immediately → exercises `ErrorState.tsx` error boundaries

---

## 11. Type System & Schema Validation

### 11.1 Why Zod?

Every API response is validated through a Zod schema before it reaches React state. Benefits:
- Malformed AI responses can never silently corrupt the UI
- TypeScript types are always exactly in sync with runtime shapes (inferred from schemas)
- Validation errors throw early with precise field-level messages
- No manual type casting needed anywhere

### 11.2 All Schemas (`src/types/contracts.ts`)

| Schema | TypeScript Type | Key Fields |
|:-------|:---------------|:-----------|
| `DetectedStackItemSchema` | `DetectedStackItem` | `technology`, `version`, `status: "current"\|"deprecated"\|"eol"` |
| `DeprecatedUsageSchema` | `DeprecatedUsage` | `file`, `line: number`, `pattern`, `recommended_replacement` |
| `DependencyGraphSchema` | `DependencyGraph` | `nodes: string[]`, `edges: {from,to}[]` |
| `DiagramSchema` | `Diagram` | `type`, `format` (`"mermaid"`), `content` (Mermaid string) |
| `CoreAuditSchema` | `CoreAudit` | All above + `architecture_summary`, `confidence: 0-1` |
| `ApiSurfaceItemSchema` | `ApiSurfaceItem` | `endpoint_or_interface`, `consumers[]`, `breaking_change_risk` |
| `ImpactItemSchema` | `ImpactItem` | `component?`, `file?`, `risk`, `notes` |
| `DependencyRiskSchema` | `DependencyRisk` | `library`, `current_version`, `target_version`, `known_breaking_changes[]` |
| `BlastRadiusItemSchema` | `BlastRadiusItem` | `change`, `affected_files[]`, `severity: "low"\|"medium"\|"high"` |
| `ImpactAuditSchema` | `ImpactAudit` | All above + `confidence` |
| `ConflictSchema` | `Conflict` | `topic`, `core_position`, `impact_position`, `resolved: boolean` |
| `ConsensusResultSchema` | `ConsensusResult` | `iteration`, `conflicts[]`, `unified_confidence`, `should_iterate_again` |
| `ReadinessScoreBreakdownSchema` | `ReadinessScoreBreakdown` | 7 dimensions (all `number`) |
| `ReadinessScoreSchema` | `ReadinessScore` | `overall: 0-100`, `breakdown` |
| `BlueprintStepStatusSchema` | `BlueprintStepStatus` | `"pending"\|"approved"\|"rejected"` |
| `BlueprintStepSchema` | `BlueprintStep` | `id`, `file_or_module`, `what_changes`, `why`, `target_pattern`, `risk_level`, `depends_on[]`, `status`, `rejection_reason?` |
| `BlueprintSchema` | `Blueprint` | `project_id`, `steps: BlueprintStep[]` |
| `ValidationResultSchema` | `ValidationResult` | `unit`, `build_status: "pass"\|"fail"`, `tests_run`, `tests_passed`, `lint_issues[]`, `coverage_note` |
| `MigrationReportEntrySchema` | `MigrationReportEntry` | `unit`, `diff`, `validation`, `approved_by`, `approved_at` |
| `MigrationReportSchema` | `MigrationReport` | `project_id`, `core_audit`, `impact_audit`, `blueprint`, `entries[]`, `rollback_plan` |
| `ProjectSummarySchema` | `ProjectSummary` | `id`, `name`, `repo_url`, `stage` (6 values), `readiness_score?`, `last_updated`, `java_from`, `java_to` |

---

## 12. The 7-Stage Migration Pipeline

```
[ Stage 1: INGESTION ]
  → User uploads Java via DashboardPage modal
  → savePersistedSourceCode(id, code) → sessionStorage["ema_source_code_store"]
  → createProject() → localProjectsStore[id]
        ↓
[ Stage 2: CORE AUDIT ]
  → CoreAuditPage → getCoreAudit(projectId)
  → DevMode:   analyzeCoreWithNvidia() → NVIDIA NIM via /api/v1/ai/chat
  → Prod:      POST /api/v1/analyze/core → Rust CoreAnalysisAgent
  → Fallback:  detectJavaStack() + detectJavaDeprecatedUsages()
  → Output: CoreAudit (architecture_summary, detected_stack, deprecated_usages, diagrams)
        ↓
[ Stage 3: IMPACT AUDIT ]
  → ImpactAuditPage → getImpactAudit(projectId)
  → DevMode:   analyzeImpactWithNvidia() → NVIDIA NIM
  → Prod:      POST /api/v1/analyze/impact → Rust ImpactAnalysisAgent
  → Fallback:  detectJavaImpactAudit()
  → Output: ImpactAudit (api_surface, database_impacts, blast_radius)
        ↓
[ Stage 4: READINESS + CONSENSUS ]
  → ReadinessPage → getReadinessScore() + getConsensusResult()
  → Score: calculateDynamicReadinessScore(coreAudit, impactAudit, blueprint)
  → Consensus: calculateDynamicConsensus(coreAudit, impactAudit)
  → Output: ReadinessScore (0-100 overall + 7-dim breakdown) + ConsensusResult (conflicts[])
        ↓
[ Stage 5: BLUEPRINT HUMAN REVIEW ]
  → BlueprintPage → getBlueprint(projectId)
  → DevMode: generates from uploaded source file list
  → AI Regen: generateBlueprintWithNvidia() via NVIDIA NIM
  → GATE: ALL steps must be opened/viewed before "Approve All & Execute" unlocks
  → Per step: Approve / Reject (with reason) / Edit (target_pattern + what_changes)
        ↓
[ Stage 6: CODE TRANSFORMATION ]
  → Per step: triggerTransformation(projectId, stepId)
  → 1st: POST /api/v1/ai/chat (NVIDIA NIM proxy, detailed 14-rule system prompt)
  → 2nd: POST /projects/:id/steps/:stepId/transform (Vercel function)
  → 3rd: generateRustCodeFromJava(javaCode, stepId) (local deterministic engine)
  → sanitizeRustCode() applied to all outputs
  → Output: transformedRustCode stored in BlueprintStep.target_pattern
        ↓
[ Stage 7: REPORT + EXPORT + ROLLBACK ]
  → ReportPage → getMigrationReport(projectId)
  → DiffViewer: side-by-side Java ↔ Rust color diff
  → ValidationBadge: build_status pass/fail per unit
  → downloadCombinedRustProject() → downloads {name}_migrated_main.rs
  → downloadCargoToml() → downloads Cargo.toml
  → RollbackSection: copyable shell rollback + SQL undo statements
```

---

## 13. Code Transformation Engine

### 13.1 `stripRustComments(code: string): string`

A **character-by-character state machine** (not a regex — regexes break on strings containing `://`):

```
State: { inString: false, stringChar: '' }

Loop over each character:
  If inString:
    Handle backslash escapes → skip next char
    If char === stringChar → exit string mode
    Always append to output
  If char is '"' or "'" → enter string mode
  If '//' (not in string) → skip to end of line
  If '/*' (not in string) → skip to matching '*/'
  Otherwise → append to output
```

**Why state machine?** `"http://example.com"` — a naive regex `//.*` would strip everything after `//` even inside string literals. The state machine knows we're inside a string and preserves it.

### 13.2 `sanitizeRustCode(rawCode: string): string`

```
1. Trim whitespace
2. If ` ```rust...``` ` or ` ```rs...``` ` blocks found → extract content inside fences
3. Otherwise → remove all ``` ``` markers globally
4. Remove invalid macro: import_axum_prelude!() → ""
5. Upgrade Axum 0.6 server syntax:
   axum::Server::bind(&"ADDR".parse()?).serve(app).await?
   → becomes:
   let listener = tokio::net::TcpListener::bind("ADDR").await?;
   axum::serve(listener, app).await?
6. Final trim
```

### 13.3 `downloadCombinedRustProject(projectId, projectName, steps)`

```
1. Filter steps: only those with real target_pattern (skip placeholder "Click 'Transform Step'")
2. sanitizeRustCode() each step's target_pattern
3. If no valid chunks → fall back to generateRustCodeFromJava() with uploaded source
4. Join all chunks with \n\n
5. Check for fn main() / async fn main()
6. No main + Axum service detected → prepend default Axum 0.7 main() boilerplate:
     use axum::{routing::get, Router};
     #[tokio::main]
     async fn main() {
         let app = Router::new().route("/health", get(|| async { "OK" }));
         let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
         axum::serve(listener, app).await.unwrap();
     }
7. Multiple main() found → deduplicate via regex, keep first only
8. Deduplicate `use` import lines using Set<string>
9. Final sanitizeRustCode() pass
10. Prepend watermark: // Generated by EMA Migration Engine (project_name)
11. Blob → <a href=URL download=filename> → click → revokeObjectURL
    Downloads as: {clean_project_name}_migrated_main.rs
```

### 13.4 `downloadCargoToml(projectName)`

Generates production-ready `Cargo.toml`:
```toml
[package]
name = "{clean_project_name}"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = "0.7"
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tracing = "0.1"
tracing-subscriber = "0.3"
```

---

## 14. Electron Desktop Application

### 14.1 Why `.cjs` AND `.js` for both `main` and `preload`?

`package.json` sets `"type": "module"` → all `.js` files are ES modules by default. But some Electron tooling and older Node.js contexts require CommonJS `require()`. The `.cjs` extension forces CommonJS regardless of `"type"` setting.

- **`electron/main.cjs`** — ACTUAL ENTRY (referenced in `package.json "main"`)
- **`electron/main.js`** — ES module version (alt / documentation)
- **`electron/preload.cjs`** — ACTUAL PRELOAD (referenced in `webPreferences.preload`)
- **`electron/preload.js`** — ES module version (alt)

### 14.2 BrowserWindow Configuration

```javascript
new BrowserWindow({
  width: 1366, height: 868,
  minWidth: 1024, minHeight: 700,
  title: "ALCHEMI — Automated Legacy Code Transformation Engine",
  backgroundColor: "#09090b",   // dark zinc-950 — matches TailwindCSS dark theme
  autoHideMenuBar: true,        // hides OS native menu bar
  webPreferences: {
    preload: path.join(__dirname, "preload.cjs"),
    nodeIntegration: false,     // React UI CANNOT call require() or access Node.js
    contextIsolation: true,     // Prevents prototype pollution between renderer and preload
    sandbox: true,              // Maximum Chromium sandboxing
  }
})
```

**Security model:** `nodeIntegration: false` + `contextIsolation: true` + `sandbox: true` = the React app has ZERO access to Node.js or the OS. The preload script can use `contextBridge.exposeInMainWorld()` to safely expose specific APIs.

### 14.3 Content Loading

```javascript
const isDev = !app.isPackaged;
if (isDev) {
  mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:5173");
} else {
  mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
}
```

`vite.config.ts` sets `base: "./"` so all asset URLs are relative → works with `file://` protocol.

### 14.4 `electron:dev` Command

```bash
concurrently "vite" "wait-on http://localhost:5173 && electron ."
```
- Starts Vite dev server (HMR on :5173)
- `wait-on` polls until 200 OK from `http://localhost:5173`
- Only then launches Electron (avoids "page not found" during Vite startup)

### 14.5 electron-builder Targets

```json
"linux":   ["AppImage", "tar.gz"]   → dist-desktop/
"win":     ["nsis", "portable"]     → dist-desktop/
appId:     "com.alchemi.transformation"
executableName: "alchemi-ui"
```

---

## 15. Deployment Infrastructure

### 15.1 Vercel Build

```json
buildCommand:    "npm run build"
outputDirectory: "dist"
```

`npm run build` = `prisma generate && tsc -b && vite build`

**Order is critical:**
1. `prisma generate` — generates `@prisma/client` TypeScript types from schema
2. `tsc -b` — type-checks entire project (fails build on type errors)
3. `vite build` — bundles React app → `dist/`

### 15.2 `.vercelignore`

```
backend/
```

Rust backend excluded from Vercel entirely. Intended to run as self-hosted service (fly.io, Docker, Railway, etc.) or locally.

### 15.3 `vercel-build` Script

Separate from `build` — ensures `prisma generate` runs in Vercel's CI environment before TypeScript compilation. Without it, `@prisma/client` types don't exist and `tsc` fails.

### 15.4 SPA Catch-All

```json
{
  "source": "/((?!api/|assets/|favicon.ico).*)",
  "destination": "/index.html"
}
```
All paths not matching API routes or static files → `index.html` → React Router handles client-side.

---

## 16. Dev Mode

The `"baanbhaba"` account is a hidden developer superuser hardcoded in `useAuthStore.ts`:

```typescript
if (cleanUser.toLowerCase() === "baanbhaba" && cleanPass === "baanbhaba") {
  set({
    isAuthenticated: true,
    username: "baanbhaba",
    isDevMode: true,           // ← THE KEY FLAG
    token: "baanbhaba-dev-session-active",
  });
  return true;
}
```

**When `isDevMode === true`:**

| Feature | Normal Mode | Dev Mode |
|:--------|:-----------|:---------|
| Project list | `GET /api/v1/projects` | `localProjectsStore` in-memory |
| Create project | `POST /api/v1/projects` | `localProjectsStore[id] = newProject` |
| Core audit | `POST /api/v1/analyze/core` | `analyzeCoreWithNvidia()` → NVIDIA NIM |
| Impact audit | `POST /api/v1/analyze/impact` | `analyzeImpactWithNvidia()` → NVIDIA NIM |
| Blueprint | `GET /api/v1/projects/:id/blueprint` | Generated from uploaded source file list |
| AI Blueprint | Not accessible | `generateBlueprintWithNvidia()` via button |
| Step approval | `POST .../approve` backend | Mutates `localBlueprintsStore` directly |
| Readiness | `GET .../readiness` backend | `calculateDynamicReadinessScore()` in-browser |
| Consensus | `GET .../consensus` backend | `calculateDynamicConsensus()` in-browser |

The Dev Mode badge appears in `Header.tsx` when `isDevMode === true`.

---

## 17. Mock & Fallback System

### 17.1 Three-Tier Strategy (Applied to Every API Call)

```
TIER 1: Dev Mode shortcut
         → isDevMode check → use local store OR call AI directly
TIER 2: Real backend call
         → fetchApi() → Rust backend (Vercel API functions in prod)
TIER 3: Graceful fallback
         → mock data from mockData.ts OR dynamic computation from source code
```

ALCHEMI **never shows a broken empty state**. Every function has fallback behavior.

### 17.2 `mockData.ts` (25KB)

- **`MOCK_PROJECTS`** — 2 pre-configured `ProjectSummary` objects:
  - `proj-legacy-monolith` — "PaymentGateway Legacy Monolith" (Spring Boot 2.4, Java 8, 87% readiness)
- **`MOCK_CORE_AUDITS`** — `{[projectId]: CoreAudit}` for demo projects
- **`MOCK_IMPACT_AUDITS`** — `{[projectId]: ImpactAudit}`
- **`MOCK_CONSENSUS`** — `{[projectId]: ConsensusResult}`
- **`MOCK_READINESS_SCORES`** — `{[projectId]: ReadinessScore}`

### 17.3 Dynamic Fallback from Uploaded Source

When backend is unavailable AND project is not in `MOCK_*` maps:
```
getCoreAudit() fallback:
  1. getPersistedSourceCode(projectId) → sessionStorage
  2. detectJavaStack(code)              → pattern-based stack detection
  3. detectJavaDeprecatedUsages(code)   → line-by-line deprecated API scan
  4. Build CoreAudit from detected data
  5. CoreAuditSchema.parse(result)      → validate before returning
```

---

## 18. Source Code Persistence

### Three Storage Layers

| Layer | Variable | Scope | Lifetime |
|:------|:---------|:------|:---------|
| **In-memory** | `sourceCodeStore: Record<string,string>` | Module (`project.ts`) | Page session |
| **sessionStorage** | `"ema_source_code_store"` → JSON | Browser | Until tab close |
| **Database** | `uploaded_sources.rawCode` | PostgreSQL | Permanent |

**`getPersistedSourceCode(projectId)`** — Priority:
1. `sourceCodeStore[projectId]` (in-memory, fastest)
2. `JSON.parse(sessionStorage["ema_source_code_store"])[projectId]`
3. Returns `""` if neither found

**`savePersistedSourceCode(projectId, code)`** — writes to both:
- `sourceCodeStore[projectId] = code`
- Reads + merges + writes `sessionStorage["ema_source_code_store"]`

**`localProjectsStore`** — in-memory, pre-seeded with `MOCK_PROJECTS`, accepts new projects via `createProject()`

**`localBlueprintsStore`** — in-memory, holds fetched/generated blueprints; step mutations (approve/reject/edit) directly mutate this cache in dev mode

---

## 19. Testing Suite

### 19.1 Vitest Configuration (in `vite.config.ts`)

```typescript
test: {
  globals: true,                              // no need to import describe/it/expect
  environment: "jsdom",                       // browser DOM simulation
  setupFiles: "./src/tests/setup.ts",         // loads jest-dom matchers
}
```

`setup.ts`:
```typescript
import "@testing-library/jest-dom";  // adds .toBeInTheDocument(), .toHaveTextContent(), etc.
```

### 19.2 Test Files

**`exportRustCode.test.ts`** (6 tests):
- `stripRustComments()` removes `//` comments
- `stripRustComments()` removes `/* */` block comments
- `stripRustComments()` preserves `://` inside strings like `"http://example.com"`
- `sanitizeRustCode()` extracts code from markdown fences
- `sanitizeRustCode()` removes `import_axum_prelude!()` macro
- `sanitizeRustCode()` upgrades `axum::Server::bind` to `TcpListener::bind` + `axum::serve`

**`readinessAndConsensus.test.ts`** (8 tests):
- `calculateDynamicReadinessScore()` returns `overall` between 0-100
- Score decreases with more EOL stack items
- Score decreases with high-risk API items
- Score increases with approved blueprint steps
- `calculateDynamicConsensus()` generates `conflicts[]` array
- High-risk API → `resolved: false` on conflict
- High DB risk → `resolved: false` on DB conflict
- `unified_confidence` is average of both agent confidences

**`BlueprintPage.test.tsx`** (5 tests):
- "Approve All" button disabled when no steps viewed
- Button enables when all steps marked viewed via `markAllStepsViewed()`
- Opening step accordion calls `markStepViewed()`
- Reject modal requires non-empty reason (form validation)
- Edit modal saves `what_changes` + `target_pattern`

**`liveNvidiaIntegration.test.ts`** (4 tests):
- AI proxy endpoint reachable (200 response)
- Response has `choices[0].message.content`
- Content is valid JSON
- Non-Java input returns error JSON (guardrail test)

**`nvidiaBlueprintVerification.test.ts`** (5 tests):
- Blueprint has `project_id`
- Each step has: `id`, `file_or_module`, `what_changes`, `why`, `target_pattern`, `risk_level`, `depends_on`, `status`
- `status` always `"pending"` on generation
- `risk_level` always `"low"` | `"medium"` | `"high"`
- `depends_on` always an array

---

## 20. Build System

### 20.1 TypeScript Configuration Hierarchy

```
tsconfig.json (root references)
├── tsconfig.app.json    → React frontend
│   target: ES2020 | lib: ES2020,DOM | jsx: react-jsx | moduleResolution: bundler | strict: true
└── tsconfig.node.json   → Vite config + API functions
    target: ES2022 | module: ESNext | moduleResolution: bundler
```

### 20.2 Vite Configuration Deep Dive

```typescript
defineConfig({
  plugins: [
    react(),        // Babel JSX transform + React Fast Refresh
    tailwindcss(),  // Tailwind v4: no PostCSS needed, processed inside Vite build
  ],
  base: "./",       // CRITICAL: relative paths for Electron file:// protocol
  server: {
    proxy: {
      "/api": { target: "http://localhost:8080", changeOrigin: true, secure: false },
      "/nvidia-api": { target: "https://integrate.api.nvidia.com/v1", changeOrigin: true, rewrite: ... },
      "/aiml-api": { target: "https://api.aimlapi.com/v1", changeOrigin: true, rewrite: ... }
    }
  },
  test: { globals: true, environment: "jsdom", setupFiles: "./src/tests/setup.ts" }
})
```

`base: "./"` without this: production build generates `/assets/index.js` (absolute path) which breaks Electron's `file://` protocol. With `"./"` it becomes `./assets/index.js` (relative).

### 20.3 Oxlint

`.oxlintrc.json` (245 bytes) — Rust-native linter, 50x faster than ESLint:
```bash
npm run lint  →  oxlint
```

### 20.4 `postinstall` Hook

```json
"postinstall": "prisma generate"
```
Runs automatically after every `npm install`. Generates `node_modules/@prisma/client` TypeScript types from `schema.prisma`. Without this, `tsc` fails because the types don't exist.

### 20.5 Electron-Builder Config (in `package.json`)

```json
{
  "appId": "com.alchemi.transformation",
  "productName": "ALCHEMI Legacy Code Transformation Engine",
  "executableName": "alchemi-ui",
  "directories": { "output": "dist-desktop" },
  "files": ["dist/**/*", "electron/**/*"],
  "linux": { "target": ["AppImage", "tar.gz"], "category": "Development" },
  "win": { "target": ["nsis", "portable"] }
}
```

---

## 21. Environment Variables

| Variable | Where Set | Consumer | Purpose |
|:---------|:----------|:---------|:--------|
| `VITE_API_BASE_URL` | `.env` / `.env.local` | `src/api/client.ts` | Base URL for all frontend API calls (default: `/api/v1`) |
| `VITE_USE_MOCKS` | `.env` | Reserved (not currently used) | Global mock toggle |
| `VITE_NVIDIA_API_KEY` | `.env` | Reserved (not sent to browser in prod) | Dev-only direct NVIDIA key |
| `VITE_AIML_API_KEY` | `.env` | Reserved | AIML API key |
| `DATABASE_URL` | `.env`, `backend/.env` | Prisma Client, SQLx PgPool | PostgreSQL connection string (`sslmode=require&channel_binding=require`) |
| `POSTGRES_URL` | `.env` | Vercel Postgres | Vercel-specific alias for `DATABASE_URL` |
| `NVIDIA_API_KEY` | `backend/.env`, Vercel env | Rust agents + `api/ai/chat.ts` | **SERVER-ONLY** NVIDIA NIM API key — never in browser bundle |
| `DEEPSEEK_API_KEY` | `backend/.env` | Rust backend fallback | Alt AI key when not using NVIDIA |
| `PORT` | `backend/.env` | `backend/src/main.rs` | Axum server port (default: `8080`) |
| `VITE_DEV_SERVER_URL` | Runtime | `electron/main.cjs` | Dev server URL for Electron (default: `http://localhost:5173`) |

**Security boundary:** Variables prefixed with `VITE_` are bundled into the browser JavaScript and visible to users. Variables WITHOUT `VITE_` prefix (`NVIDIA_API_KEY`, `DATABASE_URL`) are server-only — Vite strips them from the bundle.

---

## 22. Readiness Scoring

### 22.1 The Weighted Formula

```
Overall Score = 
  architecture_understanding   × 0.20  (20%)
+ migration_feasibility        × 0.20  (20%)
+ dependency_resolution        × 0.15  (15%)
+ api_compatibility            × 0.15  (15%)
+ breaking_change_risk         × 0.15  (15%)  ← higher = safer
+ configuration_completeness   × 0.10  (10%)
+ rollback_availability        × 0.05  ( 5%)
```

### 22.2 Dimension Formulas (`calculateDynamicReadinessScore`)

```typescript
// clamp(min, max, value) = Math.max(min, Math.min(max, value))

architecture_understanding =
  clamp(50, 100, 96 - deprecatedCount×4 - eolCount×5 - deprecatedStackCount×2)

dependency_resolution =
  clamp(40, 100, 95 - dependencyRisks.length×8 - eolCount×6 - deprecatedStackCount×3)

api_compatibility =
  clamp(40, 100, 98 - highRiskApi×15 - medRiskApi×6)

configuration_completeness =
  clamp(50, 100, 94 - highRiskConfig×12 - medRiskConfig×5)

migration_feasibility =
  clamp(30, 100, 88 + approvedSteps×4 - rejectedSteps×10)

breaking_change_risk =
  clamp(30, 100, 95 - highSeverityBlast×15 - medSeverityBlast×6)

rollback_availability =
  clamp(50, 100, 96 - highDbRisk×10)

overall = Math.round( arch×0.20 + feasibility×0.20 + deps×0.15
                     + api×0.15 + risk×0.15 + config×0.10 + rollback×0.05 )
```

**Score decreases with:** deprecated API usages, EOL stack items, high-risk API surface, high blast radius, high DB impact, rejected blueprint steps (×10 penalty each)

**Score increases with:** approved blueprint steps (×4 boost each)

**Score persistence:** After computation, `localProjectsStore[projectId].readiness_score = dynamicReadiness.overall` so DashboardPage shows accurate computed score.

---

## 23. Consensus Engine

### 23.1 Two Competing Agents

| Agent | Role | Philosophical Bias |
|:------|:-----|:-------------------|
| **Core Analysis Agent** | AST scanning, stack detection | "Modernization push" — aggressive transformation |
| **Impact Analysis Agent** | Breaking change assessment | "Stability push" — cautious, non-breaking migration |

### 23.2 `calculateDynamicConsensus()` — Conflict Generation

**Conflict 1 (always generated) — API surface:**
```
Topic:           "Target Migration Pattern & API Contract for {primaryApi}"
Core Position:   "Convert {primaryFile} to native Rust Axum async handlers"
Impact Position: "Ensure zero breaking API contract changes ({risk} risk)"
Resolved:        (apiRisk !== "high")   ← unresolved if HIGH risk
```

**Conflict 2 (if deprecated_usages or dependency_risks exist) — Modernization:**
```
Topic:           "Modernization Strategy: {mainPattern}"
Core Position:   "Refactor '{mainPattern}' to '{replacement}'"
Impact Position: "Verify backward compatibility across all dependents"
Resolved:        (no risks with >1 known_breaking_changes)
```

**Conflict 3 (if database_impacts exist) — Database:**
```
Topic:           "Database Integration ({dbComponent})"
Core Position:   "Migrate JPA/ORM to SQLx async Rust drivers"
Impact Position: "Assess risk for schema locks and transactions ({risk} risk)"
Resolved:        (dbImpacts[0].risk !== "high")
```

**Unified confidence:**
```typescript
unified_confidence = (coreAudit.confidence + impactAudit.confidence) / 2
// e.g. (0.92 + 0.90) / 2 = 0.91
```

**Iteration decision:**
```typescript
should_iterate_again = hasUnresolved || unified_confidence < 0.85
iteration = hasUnresolved ? 2 : 1
```

---

## 24. Human-in-the-Loop Safeguards

### 24.1 The Step Inspection Gate

`useUiStore.viewedSteps: Record<string, string[]>` tracks which step IDs have been opened per project.

**Step gets marked viewed when:**
- `StepCard.tsx` mounts/expands → calls `markStepViewed(projectId, step.id)`

**Bulk approve gate:**
```typescript
const allStepsViewed = blueprint.steps.every(step =>
  viewedSteps[projectId]?.includes(step.id)
);
// "Approve All & Execute" button: disabled={!allStepsViewed}
```

**Why this matters:** Without this gate, a developer could upload code → get blueprint → click "Approve All" → trigger AI transformation without ever reading what was going to change. The gate makes human oversight mandatory, not optional.

### 24.2 Additional Safety Layers

- **`ConfirmBulkApproveModal.tsx`** — additional confirmation dialog before actual bulk execution even after all steps are viewed
- **`StepRejectModal.tsx`** — throws error if `reason.trim().length === 0` (rejection reason is mandatory)
- **Step editing** — `updateBlueprintStep()` allows modifying `target_pattern` and `what_changes` before approval

---

## 25. Static Analysis Engine

Three pure TypeScript functions in `src/api/project.ts` for client-side Java code analysis:

### 25.1 `detectJavaStack(javaCode): DetectedStackItem[]`

| Code Pattern | Technology | Version | Status |
|:------------|:----------|:--------|:-------|
| `record `, `sealed class`, `permits ` | Java | 17.0+ | current |
| `var `, `List.of(`, `Map.of(` | Java | 11.0 | deprecated |
| (none of above) | Java | 1.8.0 | eol |
| `@SpringBootApplication` + `jakarta.` | Spring Boot | 3.2.0 | current |
| `@SpringBootApplication` + `javax.` | Spring Boot | 2.4.0 | eol |
| `javax.persistence` / `jakarta.persistence` / `Entity` | JPA / Hibernate ORM | 5.4 / 6.2 | deprecated / current |
| `javax.servlet` / `jakarta.servlet` | Servlet API | 3.1 / 5.0 | eol / current |
| `sun.misc.Unsafe` | sun.misc.Unsafe (Internal) | 1.8 | eol |
| `java.util.Date` / `java.util.Calendar` | Legacy Date/Time API | 1.0 | deprecated |
| `Thread.stop` / `.suspend` / `.resume` | Deprecated Thread Control | 1.2 | deprecated |

### 25.2 `detectJavaDeprecatedUsages(javaCode, fileName): DeprecatedUsage[]`

Line-by-line scan across 17 patterns:

| Pattern | Recommended Replacement |
|:--------|:-----------------------|
| `new Date(` | `LocalDate.of()` or `Instant.now()` |
| `.getYear()` | `LocalDate.getYear()` |
| `.getMonth()` | `LocalDate.getMonthValue()` |
| `.getDate()` | `LocalDate.getDayOfMonth()` |
| `Calendar.getInstance()` | `ZonedDateTime.now()` or `LocalDateTime.now()` |
| `SimpleDateFormat` | `DateTimeFormatter` (thread-safe) |
| `.stop()` | `Thread.interrupt()` with cooperative cancellation |
| `.suspend()` | `ReentrantLock` / `CountDownLatch` |
| `.resume()` | `Condition.signal()` / `LockSupport.unpark()` |
| `javax.persistence` | `jakarta.persistence.*` (Jakarta EE 10+) |
| `javax.servlet` | `jakarta.servlet.*` (Jakarta EE 10+) |
| `javax.ws.rs` | `jakarta.ws.rs.*` |
| `sun.misc.Unsafe` | `java.lang.foreign.MemorySegment` / `VarHandle` |
| `SecurityManager` | OS container security (Docker / AppArmor) |
| `new Integer(` / `new Double(` | `Integer.valueOf()` or primitives |
| `StringBuffer` | `StringBuilder` or `StringJoiner` |
| `Vector<` / `Hashtable<` | `ArrayList` / `ConcurrentHashMap` |

### 25.3 `detectJavaImpactAudit(javaCode, fileName): ImpactAudit`

| Detection | Pattern | Impact |
|:----------|:--------|:-------|
| REST API | `@RestController` / `@GetMapping` / `HttpServlet` | `api_surface` medium risk |
| No web | Default | `api_surface` CLI low risk |
| JPA/DB | `EntityManager` / `javax.persistence` / `DataSource` | `database_impacts` high/medium risk |
| No DB | Default | `database_impacts` in-memory low risk |
| Config | `application.properties` / `System.getProperty` | `config_impacts` low risk |
| Unsafe | `sun.misc.Unsafe` | `dependency_risks` FFM migration |
| javax.* | `javax.` prefix | `dependency_risks` Jakarta namespace |
| Blast | File with `javax.`/`Unsafe` | `blast_radius` high severity |
| Blast | Default | `blast_radius` medium severity |

---

## 26. Component Architecture

```
App.tsx (QueryClientProvider + HashRouter)
└── ProtectedLayout (auth guard)
    └── Layout.tsx
        ├── Header.tsx
        │   ├── Logo / ALCHEMI brand
        │   ├── Project Switcher dropdown
        │   ├── [DEV] badge (isDevMode only)
        │   ├── Theme Toggle (sun/moon icon → toggleDarkMode())
        │   └── Profile Dropdown (username, Logout button)
        ├── Sidebar.tsx
        │   ├── ALCHEMI wordmark
        │   ├── Nav link: Dashboard (/)
        │   ├── Nav link: Core Audit (/projects/:id/core-audit)
        │   ├── Nav link: Impact Audit (/projects/:id/impact-audit)
        │   ├── Nav link: Readiness (/projects/:id/readiness)
        │   ├── Nav link: Blueprint (/projects/:id/blueprint)
        │   ├── Nav link: Report (/projects/:id/report)
        │   ├── Divider
        │   ├── Nav link: Integrations (/integrations)
        │   ├── Nav link: Settings (/settings)
        │   └── Nav link: Account (/account)
        ├── HamburgerDrawer.tsx (mobile, isHamburgerOpen)
        └── <main> scrollable content area
            ├── DashboardPage
            │   ├── PipelineNarrativeBanner
            │   ├── Metric cards (project count, avg readiness, stage distribution)
            │   ├── "New Project" button → Modal.tsx
            │   │   └── name input + repo URL input + Java source textarea
            │   └── Project list (Card per project + Badge + readiness + navigate)
            ├── CoreAuditPage
            │   ├── PipelineNarrativeBanner
            │   ├── LoadingSkeleton (while React Query fetches)
            │   ├── ErrorState (on error, with retry button)
            │   ├── Architecture Summary card
            │   ├── Detected Stack table (tech / version / status Badge)
            │   ├── Deprecated Usages table (file / line / pattern / replacement)
            │   ├── Dependency Graph section
            │   └── MermaidDiagram.tsx (renders AI-generated flow diagram)
            ├── ImpactAuditPage
            │   ├── API Surface table (endpoint / consumers / risk Badge)
            │   ├── Database Impacts table
            │   ├── Config Impacts table
            │   ├── Dependency Risks table (library / versions / breaking changes)
            │   └── Blast Radius table (change / files / severity Badge)
            ├── ReadinessPage
            │   ├── Overall Score ring/gauge
            │   ├── 7-dimension breakdown table (score + weight percentage)
            │   ├── Consensus Results
            │   │   ├── Conflict cards (topic / core pos / impact pos / resolved Badge)
            │   │   ├── Unified confidence display
            │   │   └── Iteration count + should_iterate_again flag
            │   └── "Proceed to Blueprint" navigation button
            ├── BlueprintPage
            │   ├── PipelineNarrativeBanner
            │   ├── "Generate AI Blueprint (NVIDIA 70B)" button
            │   ├── X of Y steps viewed counter
            │   ├── Expand All / Collapse All controls
            │   ├── StepCard[] per blueprint step
            │   │   ├── Header: step number, file_or_module, risk Badge, status Badge
            │   │   ├── Accordion (tracks view via markStepViewed on expand)
            │   │   └── When expanded:
            │   │       ├── What Changes section
            │   │       ├── Why section
            │   │       ├── Target Code preview / diff
            │   │       ├── "Transform Step" → triggerTransformation() → AI
            │   │       ├── "Approve" → approveBlueprintStep()
            │   │       ├── "Edit" → StepEditModal.tsx
            │   │       └── "Reject" → StepRejectModal.tsx (reason required)
            │   └── "Approve All & Execute" (disabled until all steps viewed)
            │       └── ConfirmBulkApproveModal.tsx → approveAllBlueprintSteps()
            ├── ReportPage
            │   ├── PipelineNarrativeBanner
            │   ├── Summary stats (total units, approved, rejected, high-risk)
            │   ├── DiffViewer.tsx (Java ↔ Rust side-by-side colorized)
            │   ├── ValidationBadge.tsx (build pass/fail per unit)
            │   ├── Download buttons:
            │   │   ├── downloadCombinedRustProject() → .rs file
            │   │   └── downloadCargoToml() → Cargo.toml
            │   └── RollbackSection.tsx
            │       ├── Shell rollback commands (copyable)
            │       └── SQL undo statements (copyable)
            ├── IntegrationsPage
            │   ├── Rust backend status (GET /api/v1/health)
            │   ├── NVIDIA NIM API status
            │   ├── AIML API status
            │   └── Database connection status
            ├── AccountPage
            │   ├── User info (username, role, isDevMode indicator)
            │   └── Dev API key management input + setDevApiConfig()
            ├── SettingsPage
            │   ├── Theme toggle
            │   ├── Error simulation toggle (toggleSimulateApiError)
            │   ├── Backend URL config
            │   └── Cache clearing
            └── LoginPage
                ├── ALCHEMI branding
                ├── Username input
                ├── Password input
                └── Sign In → useAuthStore.login()
```

---

## 27. Routing Architecture

### 27.1 Why HashRouter

1. **Electron `file://` protocol** — `BrowserRouter` would try `file:///projects/abc` (nonexistent file). HashRouter keeps everything after `#` client-side.
2. **Vercel static hosting** — SPA catch-all rewrite handles any un-matched path, but HashRouter sidesteps server routing entirely.

### 27.2 Route Guard Implementation

```typescript
const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout><Routes>...</Routes></Layout>;
};
```

`replace` = doesn't push to browser history → back button doesn't loop back to protected route.

### 27.3 `useParams` Usage

Every project-specific page reads `:id` as `projectId`:
```typescript
const { id } = useParams<{ id: string }>();
// Used for: getCoreAudit(id), getImpactAudit(id), getBlueprint(id), etc.
```

---

## 28. NPM Scripts

| Script | Command | What It Does |
|:-------|:--------|:-------------|
| `npm run dev` | `vite` | Vite dev server on port 5173 with HMR |
| `npm run build` | `prisma generate && tsc -b && vite build` | Production build: types → type-check → bundle → `dist/` |
| `npm run vercel-build` | Same as build | Vercel CI build command |
| `npm run test` | `vitest run` | Run all tests once (no watch) |
| `npm run lint` | `oxlint` | Rust-native linting across all TS/JS |
| `npm run preview` | `vite preview` | Serve `dist/` locally for production preview |
| `npm run electron:dev` | `concurrently "vite" "wait-on http://localhost:5173 && electron ."` | Dev server + Electron simultaneously |
| `npm run electron:build` | `npm run build && electron-builder` | Production bundle + package Electron |
| `npm run electron:build:linux` | `rm -rf dist-desktop && npm run build && electron-builder --linux AppImage tar.gz` | Linux AppImage + tar.gz → `dist-desktop/` |
| `npm run electron:build:win` | `rm -rf dist-desktop && npm run build && electron-builder --win nsis portable` | Windows NSIS installer + portable .exe → `dist-desktop/` |
| `npm postinstall` | `prisma generate` | Auto-runs after `npm install` → generates `@prisma/client` types |
| `cd backend && cargo run` | Rust | Start Axum backend on port 8080 |
| `cd backend && cargo test` | Rust | Run Rust unit tests |
| `cd backend && cargo build --release` | Rust | Compile optimized production binary |

---

## 29. Strategic Rationale

| Element | Why It Exists | How It Helps |
|:--------|:-------------|:-------------|
| **Rust backend (Axum + Tokio)** | Zero-cost async, no GC pauses | Scans massive 100k+ line Java monoliths without memory bloat |
| **React 19 + Vite 8** | Concurrent features + fastest dev iteration | Suspense + transitions improve perceived performance on slow AI calls |
| **TailwindCSS 4** | CSS-in-build, zero runtime injection | No FOUC, tiny bundle, consistent design without a component library |
| **Zustand 5** | Minimal boilerplate | `viewedSteps` tracking would be extremely painful in Redux |
| **TanStack Query 5** | Server state ≠ UI state | Free caching, deduplication, stale-while-revalidate for all API calls |
| **Zod 4** | AI responses are untrusted JSON | If NVIDIA returns garbage, Zod throws before corrupting React state |
| **Prisma 7 + PostgreSQL** | Relational integrity for migration artifacts | FK constraints enforce: steps → blueprints → projects (with CASCADE) |
| **`sanitizeRustCode()`** | AI wraps output in markdown | If not stripped, downloaded `.rs` file would not compile |
| **Step Inspection Gate** | Prevent accidental bulk-approval | Developer cannot claim ignorance of what changes were made |
| **Electron 34** | Enterprise devs in air-gapped environments | Full offline functionality, native window management |
| **HashRouter** | Works on both `file://` and HTTP | Single routing setup for web + desktop deployments |
| **`postinstall` Prisma** | Types must be generated from schema | Without it, TypeScript compilation fails — types don't exist in node_modules |
| **NVIDIA AI Proxy** | API key security | Key never appears in browser bundle or page source |
| **3-tier fallback** | Demo mode without infrastructure | Full product demonstration with zero running infrastructure |
| **`dotenvy` in Rust** | Environment-first config | Same binary works in dev/staging/prod by changing env vars |
| **`serde` derive macros** | No boilerplate JSON encoding | Compiler verifies serialization correctness at compile time |
| **Permissive CORS in Rust** | Dev: Vite on :5173, Rust on :8080 | Without CORS headers, browsers block cross-origin requests in dev |

---

## 30. Architecture Decisions & Trade-offs

| Decision | Trade-off | Reasoning |
|:---------|:---------|:----------|
| **In-memory stores** | Lost on page refresh | Acceptable for dev mode; production uses PostgreSQL |
| **`sessionStorage` for source** | Tab-close clears it | Better than `localStorage` (too long-lived); source re-upload per session is fine |
| **`HashRouter`** | URLs look like `/#/projects/abc` | Required for Electron; small UX cost |
| **Client-side Java detection** | Less accurate than JVM AST | Works offline without JVM; good for demo + fallback |
| **Tailwind v4** | Less online documentation than v3 | v4 is significantly faster (Rust-based via Vite plugin), no config file needed |
| **Dual `.js`/`.cjs` Electron** | Redundant code | Required: `"type": "module"` in package.json changes how Node.js interprets `.js` |
| **Temperature `0.1`** | Less creative AI | Deterministic/consistent output required for code generation |
| **Permissive CORS `Any`** | No origin restriction | Dev convenience; production Rust should restrict origins |
| **`baanbhaba` hardcoded creds** | Security smell | Intentional dev convenience; should be feature-flagged before public deployment |
| **`confidence` self-reported** | AI rates its own accuracy | Useful heuristic; not independently verified |

---

## 31. Appendices

### Appendix A — Key Constants & Magic Values

| Constant | Value | Location | Purpose |
|:---------|:------|:---------|:--------|
| `AI_PROXY` | `"/api/v1/ai/chat"` | `nvidiaEngine.ts` | All frontend AI calls route here |
| Default AI model | `"meta/llama-3.1-70b-instruct"` | `nvidiaEngine.ts`, `transform.ts`, Rust | Model for ALL AI operations |
| `staleTime` | `300_000` ms (5 min) | `App.tsx` QueryClient | React Query cache freshness window |
| Auth store key | `"ema-auth-store"` | `useAuthStore.ts` | sessionStorage key |
| Source store key | `"ema_source_code_store"` | `project.ts` | sessionStorage key for Java code |
| Dev credential | `baanbhaba / baanbhaba` | `useAuthStore.ts` | Hidden developer superuser |
| Dev token | `"baanbhaba-dev-session-active"` | `useAuthStore.ts` | Identifies active dev session |
| Rust backend port | `8080` | `backend/src/main.rs` | Configurable via `PORT` env var |
| Vite dev port | `5173` | Vite default | Standard Vite dev server port |
| Electron min size | `1024 × 700` | `electron/main.cjs` | Minimum usable window |
| Electron bg color | `"#09090b"` | `electron/main.cjs` | Dark zinc-950 — matches Tailwind dark theme |
| Toast auto-dismiss | `4000` ms | `useUiStore.ts` | How long notifications stay visible |
| API retry count | `1` | `App.tsx` QueryClient | One retry before showing error |
| AI max tokens | `900` (default), `1000` (blueprint) | `nvidiaEngine.ts` | Token limits per AI call type |
| AI temperature | `0.1` (frontend), `0.2` (Rust) | Both | Near-deterministic output |

### Appendix B — Rust ↔ TypeScript Struct Mirror

| TypeScript Type | Rust Struct | Stored In |
|:---------------|:------------|:----------|
| `CoreAudit` | `pub struct CoreAudit` | `core_audits` table |
| `DetectedStackItem` | `pub struct DetectedStackItem` | `core_audits.detected_stack jsonb` |
| `DeprecatedUsage` | `pub struct DeprecatedUsage` | `core_audits.deprecated_usages jsonb` |
| `DependencyGraph` | `pub struct DependencyGraph` | `core_audits.dependency_graph jsonb` |
| `Diagram` | `pub struct Diagram` | `core_audits.diagrams jsonb` |
| `ImpactAudit` | `pub struct ImpactAudit` | `impact_audits` table |
| `ApiSurfaceItem` | `pub struct ApiSurfaceItem` | `impact_audits.api_surface jsonb` |
| `ImpactItem` | `pub struct ImpactItem` | `impact_audits.database_impacts jsonb` |
| `DependencyRisk` | `pub struct DependencyRisk` | `impact_audits.dependency_risks jsonb` |
| `BlastRadiusItem` | `pub struct BlastRadiusItem` | `impact_audits.blast_radius jsonb` |

Both TypeScript (Zod) and Rust (serde) validate against identical JSON wire format.

### Appendix C — All In-Memory Module-Level Variables

| Variable | File | Type | Initialized With | Purpose |
|:---------|:-----|:-----|:----------------|:--------|
| `localProjectsStore` | `project.ts` | `Record<string, ProjectSummary>` | `MOCK_PROJECTS` reduced | Project store for dev/fallback |
| `sourceCodeStore` | `project.ts` | `Record<string, string>` | `{}` | Java source code cache per project |
| `liveCoreAudits` | `project.ts` | `Record<string, CoreAudit>` | `{}` | AI-generated core audit cache |
| `liveImpactAudits` | `project.ts` | `Record<string, ImpactAudit>` | `{}` | AI-generated impact audit cache |
| `localBlueprintsStore` | `review.ts` | `Record<string, Blueprint>` | `{}` | Blueprint cache (mutated by approve/reject/edit) |
| `simulateErrorsGlobal` | `client.ts` | `boolean` | `false` | Error simulation state |

---

*End of Document — ALCHEMI · This Is Us · Iteration CLAUDE*  
*Every file, function, route, model, variable, algorithm, and decision documented above.*  
*Generated: 2026-08-07 · Corpus: `baanbhaba/ema` · Workspace: `/home/baanbhaba/projects/demux`*
