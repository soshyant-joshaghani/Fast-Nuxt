# Development

## Launchpad workflow

Fast-Nuxt is designed so you focus on product requirements, not repeated architecture decisions:

```text
Clone → setup-local → dev run all
    → give AI your feature requirements
    → AI reads AGENTS.md + inspects sample module
    → AI extends modules inside existing architecture
    → test all → deploy
```

You provide: product rules, features, UI requirements, integrations.
Fast-Nuxt provides: structure, conventions, control CLI, testing, deployment path.
AI helps implement the product inside the guardrails. See [AGENTS.md](../AGENTS.md).

## First run

```bat
copy .env.example .env
__ctrl__\fast-nuxt-ctrl.bat setup-local
__ctrl__\fast-nuxt-ctrl.bat dev run all
```

`setup-local` creates `.venv`, installs Python deps from `requirements.txt`, and runs `npm install` for the workspace.

Choose Full or Slim: [runtime-profiles.md](runtime-profiles.md)

## Hot reload

- **API:** uvicorn `--reload` on port 8000 (host)
- **UI:** Nuxt HMR via `npm run dev` on port 3000 (host)
- **Infra:** Docker Compose (`compose.dev.yml`)

Edit Python and Vue/TypeScript files; services restart automatically.

## Manual run (without `__ctrl__`)

Prefer `__ctrl__` for normal development. Use manual commands only when debugging individual services.

Infra only (full — includes Redis):

```bat
docker compose -f compose.dev.yml up -d db redis proxy adminer
```

Infra only (slim — no Redis):

```bat
docker compose -f compose.dev.yml up -d db proxy adminer
```

API only:

```bat
cd backend
set PYTHONPATH=.
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Frontend only:

```bat
cd frontend
npm run dev
```

Worker (full stack):

```bat
cd backend
..\.venv\Scripts\python.exe -m arq app.worker.worker.WorkerSettings
```

## npm workspace

Root `package.json` defines an npm workspace with the `frontend` package:

```bat
npm run dev       # Nuxt dev server (port 3000)
npm run build     # Nuxt production build (.output/)
npm run test      # Vitest (tests/frontend/)
```

Install dependencies after clone: `__ctrl__\fast-nuxt-ctrl.bat setup-local` or `npm install` from repo root.

## Configuration

| What | Where |
|------|-------|
| Secrets, DB/Redis credentials | `.env` |
| App settings | `backend/app/core/config.py` |
| CORS, hosts, domain | `compose.dev.yml` / `compose.yml` |
| Frontend to API URL | `NUXT_PUBLIC_API_BASE_URL` env var |
| Nuxt dev API proxy | Nitro proxy `/api` to `http://localhost:8000` (see `nuxt.config.ts`) |

Do not read `os.environ` scattered across app code — use `settings` from `core/config.py`.

Set `NUXT_PUBLIC_API_BASE_URL=/api/v1` in `frontend/.env.development` for local dev (default). In production, set the full API URL at build time — see [deployment.md](deployment.md).

## Private dev routes

When `ENVIRONMENT=local`, FastAPI exposes `/api/v1/private/*` (signup without auth, job ping test). Not available in production.

## Nuxt ecosystem

The frontend is Nuxt 3 + Vue 3 + shadcn-vue. Install npm packages in the `frontend` workspace for:

- 3D/WebGL: Three.js, Babylon.js, TresJS
- Charts: Chart.js, ECharts, Unovis
- UI: additional shadcn-vue components via `npx shadcn-vue@latest add <component>`

Keep backend logic in Python; use TypeScript/Vue for UI and client-side code.

## shadcn-vue

Add UI primitives from the `frontend/` directory:

```bat
cd frontend
npx shadcn-vue@latest add button
```

Generated components land in `frontend/components/ui/`. Config: `components.json`.
