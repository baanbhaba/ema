# ALCHEMI — Automated Legacy Code Transformation Engine
## Comprehensive Architectural Specification, Technical Reference, and Codebase Blueprint

---

## 1. Executive Summary & Platform Identity

**ALCHEMI** (Automated Legacy Code Transformation Engine) is an enterprise-grade automated transformation platform and human-in-the-loop review system designed to orchestrate complex legacy codebase migrations. Primarily tailored for modernizing enterprise Java applications (Java 8/11 Spring Boot monoliths) into high-performance, memory-safe Rust microservices (powered by Axum and Tokio) or modern Java 21 LTS services, ALCHEMI combines multi-agent static AST analysis, dynamic impact assessment, weighted readiness scoring, interactive blueprinting, and automated code synthesis.

### Core System Goals & Value Proposition
1. **Zero-Downtime Migration Blueprinting**: Automatically dissects legacy codebases to produce topographically ordered, step-by-step transformation blueprints where prerequisite modules are refactored before downstream dependents.
2. **Multi-Agent Consensus & Readiness Gatekeeping**: Evaluates codebase risk across 7 weighted dimensions (Architecture, Feasibility, Dependencies, API Compatibility, Breaking Risk, Configuration, Rollback) and resolves conflicts between Core AST Analysis and Impact Risk Analysis before code transformation begins.
3. **Human-in-the-Loop Safeguards**: Enforces manual developer inspection of every blueprint step before allowing bulk transformation, allowing granular edits, rejections with feedback, or AI re-generation.
4. **NVIDIA 70B AI-Powered Code Synthesis**: Leverages enterprise AI models (Meta Llama 3.1 70B Instruct via NVIDIA NIM API proxy) to synthesize clean, idiomatically correct Rust code with automated comment stripping, Axum 0.7 syntax upgrading, and Cargo.toml packaging.
5. **Dual Runtime Support**: Operates as a responsive web app (Vite + React 19) or as a desktop executable powered by Electron with isolated preload sandboxing.

---

## 2. Technology Stack & Ecosystem Breakdown

ALCHEMI's technical stack is built with high-performance, modern, and type-safe frameworks across every tier:

```
+-----------------------------------------------------------------------------------+
|                                  USER INTERFACE                                   |
|   React 19 | TypeScript 6 | Vite 8 | TailwindCSS 4 | Zustand 5 | React Query 5     |
+-----------------------------------------------------------------------------------+
                                         |
                     +-------------------+-------------------+
                     |                                       |
                     v                                       v
+------------------------------------------+   +------------------------------------+
|            NATIVE DESKTOP CONTAINER      |   |        SERVERLESS API LAYER        |
| Electron 34 | Builder 25 | Preload Bridge|   | Vercel Functions | Node.js TS      |
+------------------------------------------+   +------------------------------------+
                                                             |
                     +---------------------------------------+
                     |
                     v
+-----------------------------------------------------------------------------------+
|                             RUST BACKEND ENGINE                                   |
|   Axum 0.7 | Tokio Async Runtime | SQLx PostgreSQL Pool | Tower-HTTP | Tracing   |
+-----------------------------------------------------------------------------------+
                                         |
                     +-------------------+-------------------+
                     |                                       |
                     v                                       v
+------------------------------------------+   +------------------------------------+
|             DATABASE LAYER               |   |            AI SERVICE              |
| Prisma 7.9 ORM | PostgreSQL 15+          |   | NVIDIA NIM API Proxy (Llama 3.1 70B)|
+------------------------------------------+   +------------------------------------+
```

### 2.1 Frontend Stack
- **Framework**: `React 19.2.8` — Declarative UI rendering with concurrent features and server component compatibility.
- **Language**: `TypeScript ~6.0.2` — Strict typing across all data structures, API responses, and store interfaces.
- **Build Tool & Dev Server**: `Vite 8.2.0` — Ultra-fast HMR and optimized production bundling.
- **Styling**: `TailwindCSS 4.3.3` with `@tailwindcss/vite` plugin and utility helpers (`clsx`, `tailwind-merge`).
- **State Management**: `Zustand 5.0.14` — Lightweight global state management for UI states, theme, notifications, and blueprint step review tracking.
- **Data Fetching & Caching**: `@tanstack/react-query 5.101.4` — Server-state management, automated cache invalidation, and async mutation handling.
- **Iconography**: `lucide-react 1.28.0` — Clean vector icons for enterprise dashboards.
- **Diagram Rendering**: `mermaid 11.16.0` — Client-side rendering of architecture and flow diagrams.
- **Schema Validation**: `zod 4.4.3` — Runtime validation of API contracts and audit responses.
- **Testing & Quality**: `vitest 4.1.10`, `@testing-library/react 16.3.2`, `jsdom 30.0.1`, `oxlint 1.75.0` (high-speed linter).

### 2.2 Backend Engine (Rust Stack)
- **Language & Compiler**: `Rust 1.75+` — Memory safety, zero-cost abstractions, and concurrent execution without garbage collection overhead.
- **Web Framework**: `Axum 0.7` — Ergonomic, modular web framework built on top of `Hyper` and `Tower`.
- **Async Runtime**: `Tokio 1.0` — Multi-threaded asynchronous event loop for non-blocking I/O operations.
- **Database Driver**: `sqlx 0.8` — Asynchronous PostgreSQL pool with compile-time checked SQL queries.
- **Middleware**: `tower-http 0.6` — Permissive CORS handling and request logging.
- **Serialization**: `serde` & `serde_json` — High-speed JSON serialization and deserialization.
- **Telemetry & Logging**: `tracing` & `tracing-subscriber` — Structured logging for agent execution and route handling.

### 2.3 Serverless API & Deployment Layer
- **Vercel Serverless Functions**: `@vercel/node 5.9.5` — Node.js runtime API endpoints hosted under `/api/*`.
- **Secure AI Proxy**: `api/ai/chat.ts` — Server-side endpoint proxying requests to NVIDIA NIM API (`https://integrate.api.nvidia.com/v1/chat/completions`) or AIML API, ensuring API keys are never exposed in browser bundles.

### 2.4 Database & ORM
- **Database**: PostgreSQL 15+ — Relational database storing users, projects, uploaded source files, core audits, impact audits, readiness scores, blueprints, steps, transformations, migration reports, and audit logs.
- **ORM**: `Prisma 7.9.1` with `@prisma/client` and `@prisma/adapter-pg` — Type-safe client queries and database schema migrations.

### 2.5 Desktop Application (Electron Stack)
- **Desktop Container**: `electron 34.2.0` — Native window wrapper exposing desktop features.
- **Builder & Packaging**: `electron-builder 25.1.8` — Generates platform-native binaries (`AppImage`, `tar.gz` for Linux; `NSIS`, `portable` for Windows).
- **Concurrency & Helper Scripts**: `concurrently 9.2.0`, `wait-on 8.0.3` — Launches Vite dev server and opens Electron window automatically once server is live.

---

## 3. Comprehensive Workspace File System Tree

Below is the complete tree layout of the `/home/baanbhaba/projects/demux` workspace. Every single directory and file is documented with its role and function:

```
/home/baanbhaba/projects/demux/
├── .env                              # Environment variable configuration (VITE_API_BASE_URL, keys)
├── .env.example                      # Example environment configuration template
├── .env.local                        # Local developer environment overrides
├── .git/                             # Git repository metadata
├── .gitignore                        # Git ignore patterns (node_modules, dist, target, envs)
├── .oxlintrc.json                    # Oxlint linter rules and configuration
├── .vercel/                          # Vercel deployment cache and project settings
├── .vercelignore                     # Vercel deployment ignore patterns
├── README.md                         # Project overview, setup guide, and execution commands
├── package.json                      # Workspace dependencies, scripts, build config, electron-builder settings
├── package-lock.json                 # Lockfile for npm dependencies
├── tsconfig.json                     # Root TypeScript configuration reference
├── tsconfig.app.json                 # TypeScript compiler options for React application
├── tsconfig.node.json                # TypeScript compiler options for Vite & Node scripts
├── vite.config.ts                    # Vite configuration, dev proxy, TailwindCSS plugin integration
├── vercel.json                       # Vercel serverless function rewrites and headers
├── prisma.config.ts                  # Custom Prisma configuration settings
├── index.html                        # React HTML entry point, meta tags, fonts, root container
├── prisma/                           # Database Schema & Migrations
│   └── schema.prisma                 # 12 Prisma data models defining relational database schema
├── public/                           # Static assets served at root
│   ├── favicon.svg                   # Application favicon
│   └── icons.svg                     # Vector SVG sprites
├── api/                              # Vercel Node.js Serverless Function API Routes
│   ├── tsconfig.json                 # TypeScript configuration for API functions
│   ├── ai/
│   │   └── chat.ts                   # POST /api/v1/ai/chat — Secure NVIDIA NIM AI model proxy endpoint
│   └── projects/
│       ├── index.ts                  # GET /api/v1/projects, POST /api/v1/projects
│       └── [id]/
│           ├── index.ts              # GET /api/v1/projects/:id, DELETE /api/v1/projects/:id
│           ├── audit.ts              # GET /api/v1/projects/:id/audit — Returns Core & Impact audits
│           ├── readiness.ts          # GET /api/v1/projects/:id/readiness — Returns Readiness Score
│           ├── consensus.ts          # GET /api/v1/projects/:id/consensus — Returns Multi-Agent Consensus
│           ├── blueprint.ts          # GET /api/v1/projects/:id/blueprint, POST approve-all
│           ├── transform.ts          # POST /api/v1/projects/:id/transform — Triggers code transformation
│           ├── report.ts             # GET /api/v1/projects/:id/report — Returns Migration Report
│           └── blueprint/
│               └── steps/
│                   └── [stepId].ts   # PATCH, POST approve/reject for individual step
├── backend/                          # Rust High-Performance Backend Engine
│   ├── Cargo.toml                    # Rust crate dependencies, compiler settings
│   ├── Cargo.lock                    # Cargo dependency lockfile
│   └── src/
│       ├── main.rs                   # Axum HTTP server entry point, database connection, routes, CORS
│       ├── db/
│       │   ├── mod.rs                # Database module export and pool creator
│       │   └── repository.rs         # Database repository with raw SQL queries and upsert logic
│       ├── models/
│       │   ├── mod.rs                # Models module export
│       │   └── contracts.rs          # Rust structs for JSON contracts (CoreAudit, ImpactAudit, etc.)
│       └── agents/
│           ├── mod.rs                # Agents module export
│           ├── core_analysis.rs      # Core Analysis Agent: AST parsing, AI prompt engineering, fallback logic
│           └── impact_analysis.rs    # Impact Analysis Agent: API surface assessment, dependency risk matrix
├── electron/                         # Native Desktop App Wrapper
│   ├── main.js                       # Main process entry (ES module version)
│   ├── main.cjs                      # Main process entry (CommonJS version with BrowserWindow config)
│   ├── preload.js                    # Sandbox preload script (ES module version)
│   └── preload.cjs                   # Sandbox preload script (CommonJS version)
├── src/                              # React Frontend Application Source Code
│   ├── main.tsx                      # App entry point, renders <App /> inside React StrictMode
│   ├── App.tsx                       # Main Router setup, QueryClientProvider, global Layout wrapper
│   ├── App.css                       # Application CSS rules and custom animations
│   ├── index.css                     # TailwindCSS v4 imports, global dark theme colors, typography
│   ├── assets/                       # Static UI image assets
│   │   ├── hero.png                  # Dashboard banner graphics
│   │   ├── react.svg                 # React logo
│   │   └── vite.svg                  # Vite logo
│   ├── lib/
│   │   └── prisma.ts                 # Prisma Client singleton instance with `@prisma/adapter-pg`
│   ├── types/
│   │   └── contracts.ts              # Master Zod validation schemas & inferred TypeScript types
│   ├── store/
│   │   ├── useAuthStore.ts           # Zustand authentication store (user state, roles, dev mode)
│   │   └── useUiStore.ts             # Zustand UI store (theme, sidebar, step review tracking, toasts)
│   ├── utils/
│   │   └── exportRustCode.ts         # Rust code sanitization, comment stripping, project exporter, Cargo.toml generator
│   ├── api/                          # Frontend API Client & Service Layer
│   │   ├── client.ts                 # `fetchApi` fetch wrapper, error simulation, base URL builder
│   │   ├── project.ts                # Project CRUD, stack detection, deprecated AST scanning, readiness & consensus calculators
│   │   ├── transform.ts              # Code transformation execution and diff calculation
│   │   ├── review.ts                 # Step approval, rejection, and edit client methods
│   │   ├── report.ts                 # Migration report generation & rollback script assembly
│   │   ├── nvidiaEngine.ts           # Client integration with AI server proxy (`analyzeCoreWithNvidia`, etc.)
│   │   └── mockData.ts               # Seed mock data for development mode and fallbacks
│   ├── components/                   # Reusable Modular React UI Components
│   │   ├── layout/
│   │   │   ├── Layout.tsx            # Main shell: Header + Sidebar + Dynamic Drawer + Content Area
│   │   │   ├── Header.tsx            # Top bar: project switcher, theme toggle, dev mode badge, profile dropdown
│   │   │   ├── Sidebar.tsx           # Navigation sidebar with stage links and progress indicators
│   │   │   └── HamburgerDrawer.tsx   # Mobile responsive navigation drawer
│   │   ├── common/
│   │   │   ├── Button.tsx            # Standardized accessible UI button component
│   │   │   ├── Card.tsx              # Bordered glassmorphism card wrapper component
│   │   │   ├── Badge.tsx             # Status indicators (pending, approved, rejected, risk levels)
│   │   │   ├── Modal.tsx             # Accessible backdrop modal dialog wrapper
│   │   │   ├── MermaidDiagram.tsx    # Dynamic client-side rendering component for Mermaid graphs
│   │   │   ├── LoadingSkeleton.tsx   # Animated loading skeleton state
│   │   │   ├── ErrorState.tsx        # Fallback error container with retry action trigger
│   │   │   └── PipelineNarrativeBanner.tsx # Dynamic banner displaying current stage & progress
│   │   ├── blueprint/
│   │   │   ├── StepCard.tsx          # Card component rendering blueprint step detail, diff preview, actions
│   │   │   ├── StepEditModal.tsx     # Modal dialog for editing step target code and description
│   │   │   ├── StepRejectModal.tsx   # Modal dialog for entering rejection reason
│   │   │   └── ConfirmBulkApproveModal.tsx # Confirmation dialog prior to executing bulk transformation
│   │   └── report/
│   │       ├── DiffViewer.tsx        # Side-by-side colorized diff viewer (Java vs Rust)
│   │       ├── ValidationBadge.tsx   # Visual indicator for build status and unit test results
│   │       └── RollbackSection.tsx   # Rollback strategy panel with instant copyable shell/SQL scripts
│   ├── pages/                        # View Pages corresponding to Router Paths
│   │   ├── DashboardPage.tsx         # / — Project overview, metrics, quick upload modal, recent projects
│   │   ├── CoreAuditPage.tsx         # /projects/:id/core — Architecture summary, stack, deprecated usages, Mermaid graph
│   │   ├── ImpactAuditPage.tsx       # /projects/:id/impact — API surface, DB impacts, dependency risks, blast radius
│   │   ├── ReadinessPage.tsx         # /projects/:id/readiness — Weighted readiness breakdown & consensus resolution
│   │   ├── BlueprintPage.tsx         # /projects/:id/blueprint — Step-by-step human review & bulk approval
│   │   ├── ReportPage.tsx            # /projects/:id/report — Final diffs, validation status, export triggers, rollback
│   │   ├── IntegrationsPage.tsx     # /integrations — Backend connection status, AI providers, database status
│   │   ├── AccountPage.tsx           # /account — User credentials, API keys, developer mode toggles
│   │   ├── SettingsPage.tsx          # /settings — Global configuration, theme toggles, error simulation controls
│   │   └── LoginPage.tsx             # /login — Authentication interface
│   └── tests/                        # Vitest Unit & Integration Test Suite
│       ├── setup.ts                  # Test environment initialization
│       ├── BlueprintPage.test.tsx    # React component tests for step review enforcement
│       ├── liveNvidiaIntegration.test.ts # E2E tests verifying AI prompt/response integrity
│       ├── nvidiaBlueprintVerification.test.ts # Schema validation tests for AI generated steps
│       ├── exportRustCode.test.ts    # Tests for comment stripping, sanitization, Axum version upgrading
│       └── readinessAndConsensus.test.ts # Math and logic unit tests for readiness score & consensus algorithms
```

---

## 4. In-Depth File-by-File Technical Breakdown

This section details the internal mechanics, exports, and purpose of every critical file in ALCHEMI.

### 4.1 Master Type System & Schema Validation (`src/types/contracts.ts`)
- **Purpose**: Defines runtime schemas via `zod` and exports static TypeScript types. Guarantees that data flowing between the Rust backend, Vercel endpoints, AI proxies, and React UI strict matches expected contracts.
- **Key Schemas & Exports**:
  - `CoreAuditSchema` / `CoreAudit`: Contains `architecture_summary`, `detected_stack` (`DetectedStackItem[]`), `deprecated_usages` (`DeprecatedUsage[]`), `dependency_graph`, `diagrams`, and `confidence`.
  - `ImpactAuditSchema` / `ImpactAudit`: Contains `api_surface` (`ApiSurfaceItem[]`), `database_impacts`, `config_impacts`, `dependency_risks`, `blast_radius`, and `confidence`.
  - `ReadinessScoreSchema` / `ReadinessScore`: Overall score (0-100) and weighted breakdown (Architecture, Dependencies, API Compatibility, Configuration, Feasibility, Risk, Rollback).
  - `ConsensusResultSchema` / `ConsensusResult`: Multi-agent iteration count, list of `Conflict` objects (topic, core position, impact position, resolved flag), and unified confidence score.
  - `BlueprintSchema` / `BlueprintStepSchema`: Blueprint definition containing an array of `BlueprintStep` items (`id`, `file_or_module`, `what_changes`, `why`, `target_pattern`, `risk_level`, `depends_on`, `status`: `'pending' | 'approved' | 'rejected'`, `rejection_reason`).
  - `MigrationReportSchema`: Comprehensive report structure aggregating audits, blueprints, code diffs, unit validation results, and rollback plans.

### 4.2 State Management (`src/store/`)
1. **`useAuthStore.ts`**:
   - Manages authenticated user state (`user`, `isAuthenticated`, `isDevMode`).
   - Includes developer mode toggle which enables live AI generation triggers using user context (`baanbhaba`) and bypasses backend errors during client prototyping.
2. **`useUiStore.ts`**:
   - Manages UI theme (`isDarkMode`, `toggleDarkMode` which adds/removes `.dark` from `document.documentElement`).
   - Manages drawer and mobile sidebar states (`isHamburgerOpen`).
   - **Step Review Gatekeeper (`viewedSteps`)**: Tracks which blueprint step IDs have been opened and inspected by the user per project ID. Unlocks the "Approve All & Execute" button only after all steps are inspected.
   - **Step Expansion State (`expandedSteps`)**: Controls accordion expansion for blueprint steps.
   - **Error Simulation (`isSimulatingApiError`)**: Toggles synthetic API failures to test frontend error boundary components (`ErrorState.tsx`).
   - **Toast Notifications (`notifications`)**: Queue of auto-dismissing toast notifications (`addNotification`, `notifyBackendRequired`).

### 4.3 Code Sanitization & Exporter Engine (`src/utils/exportRustCode.ts`)
- **Purpose**: Prepares generated Rust code for standalone compilation, formats output, and provides file downloads.
- **Functions**:
  1. `stripRustComments(code: string)`: State-machine based parser that removes single-line (`//`) and block (`/* ... */`) comments while preserving slashes inside string literals (e.g. `"http://0.0.0.0:3000"`).
  2. `sanitizeRustCode(rawCode: string)`:
     - Extracts code inside markdown code blocks (````rust ... ````).
     - Strips non-existent mock macros (`import_axum_prelude!()`).
     - Upgrades obsolete Axum 0.6 server syntax (`axum::Server::bind(...)`) to modern Axum 0.7 syntax (`tokio::net::TcpListener::bind(...)` + `axum::serve(...)`).
  3. `downloadCombinedRustProject(projectId, projectName, steps)`:
     - Aggregates code across all approved blueprint steps.
     - Automatically injects a standard Axum 0.7 `main()` entrypoint if none exists.
     - Deduplicates `use` import lines.
     - Triggers browser download of `<project_name>_migrated_main.rs`.
  4. `downloadCargoToml(projectName)`:
     - Generates a production-ready `Cargo.toml` manifest containing key dependencies (`axum = "0.7"`, `tokio = { version = "1.0", features = ["full"] }`, `serde`, `serde_json`, `tracing`, `tracing-subscriber`).

### 4.4 Rust Backend Engine (`backend/src/`)
1. **`main.rs`**:
   - Initializes Tokio multi-threaded async runtime.
   - Connects to PostgreSQL using `db::create_pool().await`.
   - Attaches `tower_http::cors::CorsLayer` for cross-origin requests.
   - Exposes HTTP endpoints:
     - `GET /api/v1/health` -> `health_check` handler (returns DB connection status).
     - `POST /api/v1/analyze/core` -> `run_core_analysis` handler.
     - `POST /api/v1/analyze/impact` -> `run_impact_analysis` handler.
   - Automatically updates project stage to `'readiness'` and readiness score upon successful persistence.
2. **`agents/core_analysis.rs`**:
   - Implements `CoreAnalysisAgent`.
   - Sends structured prompt to NVIDIA NIM API (`https://integrate.api.nvidia.com/v1/chat/completions`) or DeepSeek API.
   - Parses incoming JSON into `CoreAudit` struct.
   - Includes high-precision fallback generator if AI API credentials are missing or unreachable.
3. **`agents/impact_analysis.rs`**:
   - Implements `ImpactAnalysisAgent`.
   - Scans Java AST manifest for API endpoints, database access layers, and breaking risks.
   - Returns parsed `ImpactAudit` struct.
4. **`db/repository.rs`**:
   - Executes raw parameterised SQL queries against PostgreSQL.
   - Upserts `core_audits` and `impact_audits` tables using `serde_json::to_value` for `jsonb` column serialization.

### 4.5 Database Schema (`prisma/schema.prisma`)
The system utilizes 12 primary database tables:
1. `User` (`users`): System users, roles (`developer`), hashed passwords, API keys.
2. `Project` (`projects`): Stores project metadata, current stage, readiness score, relation to audits and blueprints.
3. `UploadedSource` (`uploaded_sources`): Raw Java source files and parsed JSON AST data.
4. `CoreAudit` (`core_audits`): Scanned stack, deprecated usages, dependency graph, Mermaid diagram definitions.
5. `ImpactAudit` (`impact_audits`): API surface risk, DB impacts, config risks, dependency risk matrix, blast radius.
6. `ReadinessAssessment` (`readiness_assessments`): Overall readiness score, breakdown, consensus iteration count, conflicts.
7. `Blueprint` (`blueprints`): Transformation blueprint container per project.
8. `BlueprintStep` (`blueprint_steps`): Individual migration steps with file target, pattern, risk level, status (`pending`, `approved`, `rejected`).
9. `Transformation` (`transformations`): Historical records of transformed code units, model used (`meta/llama-3.1-70b-instruct`).
10. `MigrationReport` (`migration_reports`): Final generated migration summary, diff entries, validation metrics, rollback plan.
11. `RustExport` (`rust_exports`): Exported combined Rust code and Cargo manifests.
12. `AuditHistory` (`audit_history`): Audit trail of user and agent actions.

### 4.6 Vercel Serverless Function Endpoints (`api/`)
- `api/ai/chat.ts`: POST proxy for AI completion requests. Holds `NVIDIA_API_KEY` on the server side so client browsers never expose secret tokens.
- `api/projects/index.ts`: GET project list or POST new project.
- `api/projects/[id]/index.ts`: GET project metadata or DELETE project.
- `api/projects/[id]/audit.ts`: GET aggregated Core & Impact audits.
- `api/projects/[id]/readiness.ts`: GET computed readiness score.
- `api/projects/[id]/consensus.ts`: GET multi-agent consensus status.
- `api/projects/[id]/blueprint.ts`: GET blueprint steps or POST bulk approve all steps.
- `api/projects/[id]/blueprint/steps/[stepId].ts`: PATCH step details, or POST approve/reject actions.
- `api/projects/[id]/transform.ts`: POST execution of single step code transformation.
- `api/projects/[id]/report.ts`: GET complete migration report.

---

## 5. End-to-End Execution Workflow & Data Pipeline

The ALCHEMI migration pipeline processes legacy code through 7 distinct lifecycle stages:

```
[ Stage 1: Ingestion ] ---> [ Stage 2: Core Audit ] ---> [ Stage 3: Impact Audit ]
                                                                 |
                                                                 v
[ Stage 6: Synthesis ] <--- [ Stage 5: Blueprint ] <--- [ Stage 4: Readiness ]
          |
          v
[ Stage 7: Validation & Export ]
```

### Stage 1: Ingestion & Parsing
- User uploads Java source code directly via UI modal (`DashboardPage.tsx`) or connects a GitHub repository URL.
- The source code is persisted in `UploadedSource` and stored in `sessionStorage` (`ema_source_code_store`).

### Stage 2: Core AST Analysis
- The `CoreAnalysisAgent` (Rust backend or client proxy `nvidiaEngine.ts`) analyzes the AST structure.
- **Stack Detection**: Identifies EOL Java versions (e.g. Java 1.8), deprecated frameworks (Spring Boot 2.4), and internal APIs (`sun.misc.Unsafe`).
- **Deprecated Usage Scanning**: Flags line-by-line usages such as `new Date()`, `Calendar.getInstance()`, `Thread.stop()`, and `javax.persistence.*`.
- **Mermaid Graphing**: Generates visual component dependency flow diagrams.

### Stage 3: Impact & Blast Radius Assessment
- The `ImpactAnalysisAgent` scans the codebase for breaking risk factors.
- **API Surface**: Maps REST endpoints and consumer impact.
- **Database Layer**: Assesses JPA/Hibernate driver upgrades and SQL schema changes.
- **Blast Radius**: Calculates file modification severity (`low`, `medium`, `high`).

### Stage 4: Readiness Scoring & Multi-Agent Consensus
- **Readiness Score Calculation**: Computes a weighted overall readiness percentage:
  $$\text{Score} = 0.20(\text{Arch}) + 0.20(\text{Feasibility}) + 0.15(\text{Deps}) + 0.15(\text{API}) + 0.15(\text{Risk}) + 0.10(\text{Config}) + 0.05(\text{Rollback})$$
- **Consensus Engine**: Compares positions between Core Agent (modernization push) and Impact Agent (stability push). Generates structured `Conflict` items and determines if additional iterations (`should_iterate_again`) are required.

### Stage 5: Blueprint Human Review
- The system generates topographically sorted `BlueprintStep` items where base dependencies precede derived components.
- **Review Requirement Guard**: The UI tracks user inspection of each step. The "Approve All & Execute" action remains locked until all steps have been viewed or marked reviewed.
- **Live AI Generation**: Developers can click "Generate AI Blueprint (NVIDIA 70B)" to query Meta Llama 3.1 70B for real-time target code proposals.

### Stage 6: Code Transformation & Rust Synthesis
- Approved steps are transformed into idiomatic Rust using Axum 0.7 routing and Tokio async handlers.
- Generated code passes through `sanitizeRustCode` to strip markdown fences, purge invalid macros, and format imports.

### Stage 7: Validation, Reporting & Rollback Strategy
- Aggregates code diffs into `DiffViewer.tsx`.
- Displays validation status badges (`ValidationBadge.tsx`).
- Provides instant downloads for `<project>_migrated_main.rs` and `Cargo.toml`.
- Outputs automated rollback shell scripts and SQL transaction undo statements (`RollbackSection.tsx`).

---

## 6. Component Architecture & UI Hierarchy

```
App.tsx (Router, QueryClientProvider)
 └── Layout.tsx (Global Navigation Shell)
      ├── Header.tsx (Project Switcher, Theme Toggle, Dev Mode, Notifications)
      ├── Sidebar.tsx (Stage Progression Navigation links)
      ├── HamburgerDrawer.tsx (Mobile Drawer Menu)
      └── Main Content Area
           ├── DashboardPage.tsx (Project Metrics, Quick Ingest Modal)
           ├── CoreAuditPage.tsx (Stack Table, Deprecations, Mermaid Component)
           ├── ImpactAuditPage.tsx (API Surface, Blast Radius Table)
           ├── ReadinessPage.tsx (Weighted Score Gauge, Consensus Conflicts)
           ├── BlueprintPage.tsx (Step Cards, Inspection Enforcer, Edit/Reject Modals)
           ├── ReportPage.tsx (Side-by-Side Diffs, Validation Badges, Exports, Rollback)
           ├── IntegrationsPage.tsx (NVIDIA NIM & Database Connection Status)
           ├── AccountPage.tsx (User Settings, Dev Key Management)
           └── SettingsPage.tsx (Global Preferences, Error Simulation Toggles)
```

---

## 7. Strategic Architectural Rationale: Why Every Element Exists

| Element / Technology | Why We Need It | How It Helps the Platform |
| :--- | :--- | :--- |
| **Rust Backend (Axum + Tokio)** | High-concurrency performance and zero memory overhead. | Enables scanning massive legacy enterprise monoliths without garbage collection pauses. |
| **Zustand (`useUiStore`)** | Lightweight client-side state without boilerplate. | Enforces user review tracking (`viewedSteps`) and manages instant UI theme switching across pages. |
| **Prisma ORM & PostgreSQL** | Strict relational modeling for complex migration artifacts. | Maintains strict foreign key relations between Projects, Audits, Blueprints, Steps, and Reports with cascading deletions. |
| **NVIDIA 70B AI Integration** | High-parameter LLM reasoning for legacy code refactoring. | Provides intelligent Java-to-Rust type mapping, converting Java classes to Rust structs and methods to async functions. |
| **Server AI Proxy (`api/ai/chat.ts`)** | Protects API credentials. | Prevents secret API keys from leaking to client-side browser JavaScript bundles. |
| **`sanitizeRustCode` & `stripRustComments`** | AI outputs often contain markdown formatting or obsolete syntax. | Automatically fixes Axum 0.6 vs 0.7 breaking syntax changes and strips markdown code fences so exported code compiles cleanly. |
| **Topological Step Sorting** | Legacy migrations break if dependents are refactored before base libraries. | Orders migration steps so foundational modules are approved and transformed before downstream services. |
| **Step Inspection Enforcement** | Prevents accidental bulk-approval of dangerous code changes. | Guarantees human oversight by requiring developers to open and review step details prior to execution. |
| **Electron Desktop Container** | Enterprise developers often require offline/local desktop applications. | Provides native desktop window management with isolated sandboxing while re-using 100% of the web codebase. |

---

## 8. Development, Testing & Operational Commands

### 8.1 Prerequisites
- **Node.js**: `v18+` or `v20+`
- **Rust**: `1.75+` with `cargo` installed
- **PostgreSQL**: `15+` running locally or on cloud provider

### 8.2 Execution Commands

```bash
# 1. Install Workspace Dependencies & Generate Prisma Client
npm install

# 2. Run Vite Frontend Development Server (Port 5173)
npm run dev

# 3. Run High-Performance Rust Backend Engine (Port 8080)
cd backend
cargo run

# 4. Start Electron Desktop Application concurrently with Dev Server
npm run electron:dev

# 5. Run Vitest Unit & Integration Test Suite
npm run test

# 6. Execute Oxlint Fast Linter
npm run lint

# 7. Build Desktop Packages (Linux AppImage / Tarball)
npm run electron:build:linux

# 8. Build Desktop Packages (Windows NSIS / Portable Executable)
npm run electron:build:win
```

---

## 9. Verification & Quality Assurance Summary

ALCHEMI enforces automated quality assurance through Vitest test suites:
- **`exportRustCode.test.ts`**: Verifies comment stripping without corrupting string literals, removes markdown fences, and verifies Axum 0.7 API upgrade transformers.
- **`readinessAndConsensus.test.ts`**: Validates mathematical score weighting formulas and multi-agent conflict resolution logic.
- **`BlueprintPage.test.tsx`**: Verifies UI review gatekeeping rules and modal interactions.
- **`liveNvidiaIntegration.test.ts` & `nvidiaBlueprintVerification.test.ts`**: Validates prompt structure and JSON schema compliance for NVIDIA AI completions.

---

### End of Technical Reference Document — ALCHEMI Transformation Engine
*This specification represents the complete authoritative reference for the ALCHEMI codebase.*
