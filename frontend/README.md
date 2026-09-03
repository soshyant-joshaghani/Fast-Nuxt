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

Config: `components.json`. UI primitives live in `components/ui/`.

## Structure

| Path | Purpose |
|------|---------|
| `pages/` | Routes (`login.vue`, `(dashboard)/…`) |
| `components/layout/` | Dashboard shell |
| `composables/useAuth.ts` | JWT auth state |
| `lib/modules/apps/<name>/api.ts` | Feature HTTP clients |
