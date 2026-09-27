# SoundCloud Official Download Link API

A small REST API for resolving public SoundCloud track URLs. It returns an official SoundCloud download URL only when SoundCloud marks the track as downloadable.

This project does not rip streams, convert audio, bypass authentication, or process tracks that SoundCloud does not officially make downloadable.

## Endpoints

### Check track eligibility

```http
POST /api/soundcloud/resolve
Content-Type: application/json
```

```json
{
  "url": "https://soundcloud.com/artist/track"
}
```

### Get an official download link

```http
GET /api/soundcloud/download-link?url=https%3A%2F%2Fsoundcloud.com%2Fartist%2Ftrack
```

The endpoint returns the official SoundCloud download URL only for eligible tracks.

## Configuration

Set this environment variable in Vercel:

```text
SOUNDCLOUD_CLIENT_ID=your-authorized-soundcloud-client-id
```

Without it, SoundCloud routes intentionally return `503 soundcloud_credentials_missing`.

## Local development

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
```

The local API is available under `/api`.

## Deploy to Vercel

1. Import this GitHub repository into Vercel.
2. Keep the repository root as the project root.
3. Add `SOUNDCLOUD_CLIENT_ID` under Project Settings → Environment Variables.
4. Deploy.

`vercel.json` routes `/api/*` requests to the Express app and uses the existing pnpm workspace build.