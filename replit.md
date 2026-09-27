# SoundCloud Official Download Link API

A small REST API that resolves public SoundCloud track URLs and returns an official download link only when SoundCloud marks the track as downloadable.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required secret for live SoundCloud resolution: `SOUNDCLOUD_CLIENT_ID`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for the REST contract
- `artifacts/api-server/src/routes/soundcloud.ts` — SoundCloud URL validation and official eligibility checks
- `artifacts/api-server/src/routes/index.ts` — API route registration
- `soundcloud-public-endpoints.md` — passive endpoint inventory used to scope the integration

## Architecture decisions

- The API returns SoundCloud's official `download_url`; it does not rip, transcode, proxy, or bypass access controls.
- Only HTTPS URLs hosted on SoundCloud are accepted, and returned download URLs are restricted to SoundCloud/CDN hostnames.
- SoundCloud credentials are read from Replit Secrets and never hardcoded or returned in responses.
- Missing credentials fail explicitly with `503 soundcloud_credentials_missing`.

## Product

- `POST /api/soundcloud/resolve` checks track metadata and official download eligibility.
- `GET /api/soundcloud/download-link?url=...` returns an official download URL for eligible tracks.
- Non-downloadable tracks return a clear `403 track_not_downloadable` response.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
