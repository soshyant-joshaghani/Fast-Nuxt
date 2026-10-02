# safe/ — keys, addresses, prod env (local only)

| Pattern | Purpose |
|---------|---------|
| `*-privatekey.pem` | SSH private key |
| `*-address.txt` | VM IP / hostname (first line) |
| `*-env.env` | Production secrets → uploaded as `~/projects/fast-nuxt/.env` |

| Files | Server id |
|-------|-----------|
| `ar-fast-nuxt-bamdad-*` | `fast-nuxt` |

Copy the `*.example` stubs, drop the `.example` suffix, and fill real values.

`*.pem`, `*.env`, `*-address.txt` are gitignored.

Upload env to VM:

```bat
fast-nuxt-ctrl.bat env
```

That copies `safe/ar-fast-nuxt-bamdad-env.env` → `~/projects/fast-nuxt/.env`.
