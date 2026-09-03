# Dashboard UI conventions

FoxG foundation kits (**Fast-Next**, **Fast-Nuxt**, **Fast-Rio**) share the same dashboard UX. Each kit implements the design in its own frontend stack — there is no shared UI package.

## Layout

- **Sidebar** (left): navigation links
- **Header** (top): theme toggle, user menu, logout
- **Main content**: page-specific UI

## Routes

| Path | Purpose | Auth |
|------|---------|------|
| `/login` | Centered login / signup | Public |
| `/` | Dashboard home (health checks) | Required |
| `/sample/notes` | Canonical notes CRUD | Required |
| `/admin` | Superuser placeholder | Superuser only |

## Visual language

- **Default theme:** dark
- **Toggle:** light/dark persisted in localStorage via `ThemeToggle`
- **Palette:** zinc/slate backgrounds, sky (`#0ea5e9`) primary accent
- **Components:** shadcn-vue (Reka UI + Tailwind CSS v4)
- **Sample Notes:** table/card CRUD styled like the [full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template) Items page

## Navigation items

1. Dashboard → `/`
2. Sample Notes → `/sample/notes`
3. Admin → `/admin` (visible only when `is_superuser`)

## Auth

- JWT via `POST /base/login/access-token`
- Profile via `GET /base/login/me`
- Dev signup via `POST /private/users/` (local only)
- Unauthenticated users redirect to `/login`
- Frontend: `composables/useAuth.ts` + `middleware/auth.global.ts`

## Kit-specific implementation

| Kit | Shell location | UI library |
|-----|----------------|------------|
| Fast-Next | `frontend/src/components/layout/`, `frontend/src/app/(dashboard)/` | shadcn/ui (React) |
| Fast-Nuxt | `frontend/components/layout/`, `frontend/pages/(dashboard)/` | shadcn-vue (`frontend/components/ui/`) |
| Fast-Rio | `frontend/src/components/sidebar.py`, `frontend/src/components/root_component.py` | Reflex components |

### Fast-Nuxt file map

| Path | Purpose |
|------|---------|
| `pages/(dashboard).vue` | Authenticated layout wrapper (sidebar + header) |
| `pages/login.vue` | Public login page |
| `components/layout/AppSidebar.vue` | Left navigation |
| `components/layout/Header.vue` | Top bar |
| `components/layout/UserNav.vue` | User menu + logout |
| `components/layout/ThemeToggle.vue` | Light/dark switch |
| `components/auth/LoginForm.vue` | Login/signup form |
| `components/ui/` | shadcn-vue primitives (Button, Table, Card, …) |
| `components.json` | shadcn-vue CLI config |

Add new shadcn-vue components from `frontend/`:

```bat
npx shadcn-vue@latest add <component>
```

Do not copy UI code between kits. Match behavior and visuals only. Shared-layer (non-UI) changes transfer to all four kits — see [fast-template/README.md](../../README.md).
