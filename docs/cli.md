# CLI (`__ctrl__`)

`__ctrl__/` is the **control layer** for fast-nuxt — the official interface for dev, test, deploy, and SSH ops. Prefer these commands over ad-hoc `docker compose` or manual process management.

Entry points:

```bat
__ctrl__\fast-nuxt-ctrl.bat <command>
```

```bash
__ctrl__/fast-nuxt-ctrl.sh <command>
```

Full reference: [`__ctrl__/README.md`](../__ctrl__/README.md)

## Local setup

```bat
fast-nuxt-ctrl.bat setup-local
fast-nuxt-ctrl.bat setup-local --force   # recreate .venv
```

Creates project `.venv`, installs `requirements.txt`, and runs `npm install` for the workspace.

## Development

```bat
fast-nuxt-ctrl.bat dev run all
fast-nuxt-ctrl.bat dev run all --slim
fast-nuxt-ctrl.bat dev stop all
fast-nuxt-ctrl.bat dev down all
fast-nuxt-ctrl.bat dev purge infra
fast-nuxt-ctrl.bat dev reset all
```

| Target | Meaning |
|--------|---------|
| `infra` | Docker: db, redis (full), proxy, adminer + migrations |
| `apps` | Host: uvicorn :8000, ARQ worker (full), Nuxt :3000 |
| `all` | Both (run order: infra → apps; stop: apps → infra) |

See [runtime-profiles.md](runtime-profiles.md) for `--slim`.

## Module scaffold

```bat
fast-nuxt-ctrl.bat app create myfeature
```

## Tests

```bat
fast-nuxt-ctrl.bat test all
fast-nuxt-ctrl.bat test backend
fast-nuxt-ctrl.bat test frontend
```

## Production (SSH from laptop)

```bat
fast-nuxt-ctrl.bat setup
fast-nuxt-ctrl.bat pubkey
fast-nuxt-ctrl.bat clone
fast-nuxt-ctrl.bat env
fast-nuxt-ctrl.bat start
fast-nuxt-ctrl.bat stop
fast-nuxt-ctrl.bat update
fast-nuxt-ctrl.bat status
fast-nuxt-ctrl.bat connect
```

## Local prod smoke (Docker Desktop)

```bat
fast-nuxt-ctrl.bat prod start
fast-nuxt-ctrl.bat prod stop
fast-nuxt-ctrl.bat prod reset
```

On-VM scripts: `__ctrl__/remote/` (invoked by SSH commands above).
