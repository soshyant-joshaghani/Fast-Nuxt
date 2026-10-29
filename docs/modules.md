# Modules

Product features live in **app modules** — one ownership boundary per feature.

Before creating a new pattern, inspect the **canonical `sample` module** (notes CRUD). It is the reference implementation for how features are structured in Fast-Nuxt.

## Locations

| Layer | Path |
|-------|------|
| Backend | `backend/app/modules/apps/<name>/` |
| Frontend client | `frontend/lib/modules/apps/<name>/api.ts` |
| Nuxt route | `frontend/pages/(dashboard)/<path>/index.vue` |
| Backend tests | `tests/backend/apps/<name>/` |
| Frontend tests | `tests/frontend/` (as needed) |

Platform code (not your product): `modules/base/` (auth), `modules/system/` (health).

Shared frontend utilities: `frontend/lib/modules/base/`.

Auth state: `frontend/composables/useAuth.ts`.

## Backend layers

Use only what the feature needs:

```
Router → Service → Repository → Database
```

| File | When |
|------|------|
| `router.py` | Always — HTTP endpoints |
| `service.py` | Business rules, validation, orchestration |
| `repository.py` | Database queries |
| `models.py` | SQLModel tables |
| `schemas.py` | API input/output |

Register the router in `backend/app/modules/apps/router.py`.

Naming and cross-module rules: [conventions.md](conventions.md).

## Scaffold

```bat
__ctrl__\fast-nuxt-ctrl.bat app create myfeature
```

Creates backend router, frontend `api.ts` stub, Nuxt route stub, and backend test. Extend using the sample module as reference.

## Canonical example: `sample`

The **notes** module is the reference implementation. Inspect before building anything new:

| Step | Location |
|------|----------|
| Model | `backend/app/modules/apps/sample/models.py` |
| Migration | `backend/app/alembics/core/versions/002_sample_notes.py` |
| Repository | `backend/app/modules/apps/sample/repository.py` |
| Service | `backend/app/modules/apps/sample/service.py` |
| Router | `backend/app/modules/apps/sample/router.py` |
| API client | `frontend/lib/modules/apps/sample/api.ts` |
| Nuxt UI | `frontend/pages/(dashboard)/sample/notes/index.vue` |
| Tests | `tests/backend/apps/sample/test_notes.py` |

UI: http://dashboard.localhost/sample/notes

## Frontend API clients

TypeScript clients live in `frontend/lib/modules/apps/<name>/api.ts`:

- Import `API_BASE_URL` from `~/lib/config/backend`
- Use `fetch` with auth headers from `useAuth().getToken()` or `~/lib/modules/base/utils/auth-fetch`
- Export typed functions (`listNotes`, `createNote`, etc.) — see sample module

Keep routes thin: `index.vue` imports from the module's `api.ts` and handles UI state with Vue `ref`/`computed`.

Use shadcn-vue components from `~/lib/modules/base/ui/` for tables, forms, buttons, and dialogs.

## Rules

- Keep feature code in the feature module — avoid scattering helpers globally.
- Simple features stay simple — do not add empty layers for ceremony.
- Add a migration when the schema changes (see [database.md](database.md)).
- Add tests for meaningful behavior (see [testing.md](testing.md)).
- Use npm for frontend-only dependencies (3D libraries, charts, etc.) in the `frontend` workspace.
