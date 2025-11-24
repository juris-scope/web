# JuriScope — MERN Stack (Vite + Express + MongoDB)

JuriScope is an AI-powered contract analysis platform scaffolded with a clean, professional legal-tech UI and a ready-to-extend backend. This repo contains a full MERN setup with Vite (React) on the frontend and Express/MongoDB on the backend.

## Structure

```
frontend/
	src/
		assets/
		components/
		pages/
		utils/
backend/
	config/
	controllers/
	routes/
	uploads/
	.env.example
```

## Requirements

- Node.js 18+
- MongoDB (local or remote)

## Setup — Backend

1) Install dependencies
```zsh
cd backend
npm install
```

2) Configure environment
```zsh
cp .env.example .env
# edit .env if needed (MONGO_URI, CORS_ORIGIN)
```

3) Start the server (port 3000)
```zsh
npm run dev
# or
npm start
```

### (Optional) Enable Gemini Suggestions

Add your API key to `.env` (do NOT commit real keys):
```zsh
echo "GEMINI_API_KEY=your_real_key_here" >> .env
```
The backend will automatically enrich clause suggestions using the `gemini-1.5-flash` model. Fallback deterministic suggestions are used if the key is absent or a request fails.

API routes:
- `POST /api/upload` — file upload (PDF, DOCX, TXT, max 10MB)
- `GET /api/analytics` — dashboard metrics (placeholder)
- `POST /api/analyze/clause|risk|anomaly` — placeholder endpoints for future model integration

## Setup — Frontend

1) Install dependencies
```zsh
cd ../frontend
npm install
```

2) (Optional) Create `.env` and set API URL
```zsh
echo "VITE_API_URL=http://localhost:3000" > .env
```

3) Run the dev server (port 5173)
```zsh
npm run dev
```

Open http://localhost:5173

## Frontend Highlights

- Light theme, enterprise-ready aesthetic
- Brand colors: Deep Navy `#001F3F`, Burnt Orange `#FF851B`
- Tailwind CSS
- Pages & routes:
	- `/` Dashboard with metrics and feature highlights
	- `/explore` Analysis page with language selector and drag-and-drop upload
- Components: Navbar, Button, DashboardCard, FeatureCard, FileUploadZone
- Responsive, with loading and error states

## Profile/Settings Page

- Route: `/profile`
- Tabs: Personal Info, Security & Privacy, Preferences, Usage Statistics
- Charts: Recharts (already included)
- Avatar uploads saved under `backend/uploads/` and served from `/uploads/*` by backend

Backend endpoints (demo, no auth):
- GET `/api/user/profile` | PUT `/api/user/profile` | POST `/api/user/avatar`
- PUT `/api/user/password` | POST `/api/user/2fa/enable` | `/api/user/2fa/disable`
- GET `/api/user/sessions` | DELETE `/api/user/sessions/:id` | POST `/api/user/sessions/signout-others`
- PUT `/api/user/preferences` | GET `/api/user/statistics` | GET `/api/user/export-data`
- DELETE `/api/user/account`

Run locally:
```zsh
cd backend && npm install && npm run dev
# in another terminal
cd frontend && npm install && npm run dev
```

## Notes

- Model folders under `models2/` are not wired yet; backend exposes placeholder endpoints for future integration.
- Multer stores files under `backend/uploads/` (git-ignored).
- Gemini integration: clause suggestions enhanced when `GEMINI_API_KEY` is set.

## Scripts Summary

- Backend: `npm run dev` (nodemon) or `npm start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

