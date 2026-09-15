# Frontend (Nuxt)

Nuxt 3 dashboard for Fast-Nuxt. Uses shadcn-vue, Tailwind CSS v4, and `@vite-pwa/nuxt`.

## Dev

From repo root (recommended):

```bat
__ctrl__\fast-nuxt-ctrl.bat dev run all --slim
```

Or frontend only (requires API on `:8000` or Traefik):

```bat
cd frontend
npm run dev
```

## Environment

| Variable | Purpose |
|----------|---------|
| `NUXT_PUBLIC_API_BASE_URL` | Browser API base (default `/api/v1` in dev via Nitro proxy) |

Set in `frontend/.env.development` or via `__ctrl__` when starting apps.

## API proxy

In dev, Nitro proxies `/api` → `http://localhost:8000`. Client code should use relative `/api/v1` paths — see `lib/config/api-url.ts`.

## shadcn-vue

Add components from `frontend/`:

```bat
npx shadcn-vue@latest add <component>
```

Config: `components.json`. UI primitives live in `lib/modules/base/ui/`.

## Structure

| Path | Purpose |
|------|---------|
| `pages/` | Routes (`login.vue`, `(dashboard)/…`) |
| `lib/modules/base/` | Kit/platform shell + `ui/` primitives |
| `lib/modules/apps/<name>/api.ts` | Feature HTTP clients |
| `composables/useAuth.ts` | JWT auth state |

### Frontend modules (mandatory)

Under the frontend modules root there are **only**:

- `base/` — kit/platform (auth, users, shell, i18n, stores) + design primitives at `base/ui/`
- `apps/<domain>/` — product domains (API clients + UI), mirroring `backend/app/modules/apps/<domain>/`

There is **no** project `components/` folder as the app UI home. Modules are the component home.
Do not add `global/`, `shell/`, `layout/`, or a top-level `modules/ui/` peer of `base`/`apps`.
Where shadcn (or equivalent) is used: `ui` → `~/lib/modules/base/ui`, `components` alias → `~/lib/modules/base`.
