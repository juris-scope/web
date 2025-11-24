# JuriScope — AI-Powered Contract Intelligence (MERN: Vite + Express + MongoDB)

JuriScope is an extensible legal-tech platform for ingesting contracts, extracting clause/risk signals, benchmarking anomalies, and surfacing actionable insights via a polished enterprise UI. The current iteration provides a production-ready MERN scaffold with clear extension points for custom NLP / ML models.

## Why JuriScope?

Contracts are dense, heterogeneous, and risk-laden. JuriScope aims to accelerate review by:
1. Centralizing uploads & parsing (DOCX / PDF / TXT) into a structured representation.
2. Highlighting clauses, risk categories, and transaction anomalies (model hooks ready, placeholders active).
3. Providing dashboard drill-down metrics & per-file analysis context for faster triage.
4. Offering an opinionated UI/UX tuned for legal workflows (clarity > decoration, focus states, skeleton loading, descriptive empty states).
5. Enabling optional LLM augmentation (Gemini) for clause improvement suggestions and redline rationale.

## Current Feature Set

### Dashboards & Visualization
- Overview dashboard: KPI cards + future analytic aggregates (`/api/analytics`).
- Chart components (Recharts) for clause mix, risk distribution, anomaly trends, gauge scoring.
- Additional stats panel & skeleton loading states for perceived performance.

### Profile & User Workspace 
- Multi-tab profile: Personal Info, Security & Privacy, Preferences, Usage Statistics.
- Session management placeholders (enumeration, forced sign-out patterns prepared).
- Password strength meter + security settings scaffolding for future auth integration.
- Avatar upload & serving via static Express route (`/uploads/*`).

### UI / UX Design
- Tailwind CSS design system with consistent semantic color tokens (Deep Navy `#001F3F`, Burnt Orange `#FF851B`).
- Reusable primitives: `Button`, `DashboardCard`, `FeatureCard`, `FileUploadZone`, `Navbar`.
- Accessibility-minded states: focus rings, skeleton loaders, error boundaries (ready for expansion).
- Responsive layout (mobile → widescreen) validated by component breakpoints.

### AI & Augmentation
- Optional Gemini integration (`gemini-1.5-flash`) for clause improvement suggestions.
- Fallback deterministic suggestions when API unavailable → deterministic pipeline preserves reproducibility.
- Clear abstraction layer to swap / stack models (future: risk scoring, summarization, negotiation playbooks).

### Extensibility Hooks
- `models2/` directory seeds tokenizer/config artifacts for future custom-trained transformers.
- Service layer pattern encourages adding `services/<model>.js` with shared error normalization.
- Route modularity: isolated routers (`analyzeRoutes`, `analyticsRoutes`, `uploadRoutes`, `user.routes.js`) for incremental horizontally-scalable microservice extraction.
- Frontend `utils/api.js` centralizes request logic (easy injection of auth headers / tracing / retries).

### Engineering & DX
- Vite frontend: lightning-fast HMR for React dev.
- Nodemon backend: rapid iteration on API/service changes.
- Structured environment config with `.env.example` to reduce onboarding friction.
- Clear separation of presentation (components) vs. data orchestration (pages + utils).

## High-Level Architecture

```
┌──────────────┐      Upload / Analyze      ┌──────────────┐
│  Frontend    │  ───────────────────────▶  │   Backend    │
│  (Vite/React)│                           │ (Express/API) │
│  UI Layer    │ ◀───────────────────────  │ Models/Services│
└─────┬────────┘   Metrics / Profile        └──────┬───────┘
      │                                           │
      ▼                                           ▼
  Components & State                         MongoDB Persistence
      │                                           │
      ▼                                           ▼
   Recharts / Tailwind                     Future ML Model Layer (models2/)
```

## Requirements

- Node.js 18+
- MongoDB (local or remote)

## Quick Start

```zsh
# Backend
cd backend
npm install
cp .env.example .env   # set MONGO_URI, CORS_ORIGIN, optional GEMINI_API_KEY
npm run dev             # starts on :3000

# Frontend (new terminal)
cd frontend
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev             # starts on :5173
```
Open http://localhost:5173

## Backend Setup (Detailed)
1. Install dependencies: `npm install`.
2. Duplicate env: `cp .env.example .env` then edit.
3. Run dev: `npm run dev` (nodemon) or production: `npm start`.
4. Optional Gemini: `echo "GEMINI_API_KEY=your_real_key_here" >> .env`.

Primary API routes:
- `POST /api/upload` — ingest contract file.
- `POST /api/analyze/clause|risk|anomaly` — ML hook placeholders.
- `GET /api/analytics` — dashboard metrics (extendable).
- User demo endpoints: profile, avatar, preferences, sessions, statistics, export.

## Frontend Setup (Detailed)
1. Install deps: `npm install`.
2. Configure API origin: `.env` with `VITE_API_URL`.
3. Run dev: `npm run dev`.

Key Routes:
- `/` Dashboard (cards, charts, highlights).
- `/explore` Upload + analysis workspace.
- `/profile` Settings & usage stats.
- Future: drafting assistant, negotiation diffing.

## Data & Models
- MongoDB schemas define contract, clause, risk, report objects (see `backend/models/*`).
- `models2/` holds tokenizer + config artifacts for integrating transformer-based pipelines later.
- Extend by adding processing phase post-upload before persisting analysis report.

## AI Integration Pattern
1. Receive raw text / parsed sections.
2. Apply deterministic preprocessing (tokenization, segmentation).
3. Call external model (Gemini or custom) with safety/timeouts.
4. Normalize responses into stable shape for UI consumption.
5. Cache / store summary objects for analytics aggregation.

## Roadmap (Indicative)
- [ ] Wire real clause/risk/anomaly models using `models2/` artifacts.
- [ ] Add authentication + RBAC for multi-user tenancy.
- [ ] Implement contract diffing & version lineage.
- [ ] Add bulk export (CSV/JSON) and redline generator.
- [ ] Integrate policy rules engine for auto-flag thresholds.
- [ ] Observability: structured logging + tracing (OpenTelemetry).
- [ ] Optional vector search against precedent clauses.

## Contributing
1. Fork & branch naming: `feature/<short-desc>`.
2. Keep PRs atomic (UI vs. backend separation preferred).
3. Update README or in-code docs when adding new model/service.

## Scripts Summary
- Backend: `npm run dev` (nodemon), `npm start` (prod), `npm run seed` (if added later).
- Frontend: `npm run dev`, `npm run build`, `npm run preview`.

## Notes
- Multer stores uploads under `backend/uploads/` (git-ignored).
- Gemini suggestions degrade gracefully when key absent.
- Placeholder analyze endpoints intentionally simple → focus on contract ingestion + future model swap.

## License / Usage
No explicit license added yet. Avoid committing proprietary contracts or real API keys. Add a LICENSE file before external distribution.

---
Questions / ideas? Open an issue or propose a roadmap item. Happy building.

