# SoundCloud mobile public endpoint inventory

Source: `https://m.soundcloud.com/`

Captured: 2026-09-27

Scope: passive inspection of the public landing HTML, its Next.js build manifest, public JavaScript bundles, and `robots.txt`. This is a bundle-declared/publicly discoverable inventory, not a claim about undocumented private APIs or authenticated capabilities. Values such as IDs, tokens, client keys, and cookies are intentionally omitted.

## Service bases

| Service | Base |
|---|---|
| Public data API | `https://api-mobi.soundcloud.com` |
| Auth API | `https://api-auth.soundcloud.com` |
| Secure/token service | `https://secure.soundcloud.com` |
| GraphQL | `https://graph.soundcloud.com` |
| Waveform data | `https://wis.sndcdn.com` |
| People directory | `https://directory.soundcloud.com` |
| Mobile proxy | `https://m.soundcloud.com` |
| Link shortener | `https://shrinklink.soundcloud.com` |
| Support API | `https://soundcloud.zendesk.com/api/v2` |

## Public data API

Unless a different method is shown, these are `GET` routes.

### Discovery, search, and playback

- `GET /charts`
- `GET /featured_tracks/:kind/:genre`
- `GET /search`
- `GET /search/:bucket`
- `GET /search/queries`
- `GET /stream`
- `GET /recent-tracks/:tagName`
- `GET /playlists/discovery`
- `GET /audio-ads`

### Tracks

- `GET /tracks/:urn`
- `GET /tracks?ids=...`
- `GET /tracks/:id/related`
- `GET /tracks/:id/playlists_without_albums`
- `GET /tracks/:id/albums`
- `GET /tracks/:id/likers`
- `GET /tracks/:id/reposters`
- `GET /tracks/:id/comments`
- `GET /users/:id/track_likes`
- `PUT /users/:meUserId/track_likes/:targetItemId`
- `DELETE /users/:meUserId/track_likes/:targetItemId`
- `GET /me/track_likes/ids`
- `PUT /me/track_reposts/:targetItemId`
- `DELETE /me/track_reposts/:targetItemId`
- `GET /me/track_reposts/ids`

### Playlists and sets

- `GET /playlists/:id`
- `GET /playlists/:id/likers`
- `GET /playlists/:id/reposters`
- `PUT /users/:meUserId/playlist_likes/:targetItemId`
- `DELETE /users/:meUserId/playlist_likes/:targetItemId`
- `GET /me/playlist_likes/ids`
- `PUT /me/playlist_reposts/:targetItemId`
- `DELETE /me/playlist_reposts/:targetItemId`
- `GET /me/playlist_reposts/ids`

### Users and profiles

- `GET /users/:id`
- `GET /users/:id/albums`
- `GET /users/:id/comments`
- `GET /users/:id/followers`
- `GET /users/:id/followings`
- `GET /users/:id/likes`
- `GET /users/:id/playlists`
- `GET /users/:id/playlists_without_albums`
- `GET /users/:id/relatedartists`
- `GET /users/:id/spotlight`
- `GET /users/:id/toptracks`
- `GET /users/:id/tracks`
- `GET /users/:id/web-profiles`
- `GET /stream/users/:id/reposts`
- `POST /me/followings/:targetItemId`
- `DELETE /me/followings/:targetItemId`
- `GET /users/:meUserId/followings/ids`
- `GET /users/who_to_follow`

### Current user, history, and settings data

- `GET /me`
- `PUT /me`
- `GET /me/settings/privacy`
- `PUT /me/settings/privacy`
- `GET /me/library/all`
- `POST /me/play-history`
- `DELETE /me/play-history`
- `GET /me/play-history/contexts`
- `GET /me/play-history/tracks`
- `GET /enabled-features`

### Other data routes found in the bundle

- `GET /comments/:id`
- `GET /mixed-selections`
- `GET /tpub/publish`
- `GET /tsub/subscribe`
- `GET /tsub/token`

## Authentication and account routes

Base: `https://api-auth.soundcloud.com`

- `GET /settings`
- `GET /settings/2fa/backup_code/count`
- `POST /settings/2fa/backup_code/regenerate`
- `POST /settings/set-up-2fa`
- `POST /settings/2fa/totp/enable`
- `POST /settings/2fa/totp/disable`
- `POST /settings/2fa/backup_code/disable`
- `POST /settings/2fa/email_otp/enable`
- `POST /settings/2fa/email_otp/disable`
- `POST /oauth/authorize`
- `POST /sign-out`

Base: `https://secure.soundcloud.com`

- `POST /oauth/token`

## GraphQL and utility routes

- `POST https://graph.soundcloud.com/graphql`
  - Bundle-declared operations include `resolvePermalink` and `FollowAndAuthorizeShares`.
- `GET https://wis.sndcdn.com/:key`
  - Waveform data.
- `GET https://directory.soundcloud.com/:people/:key`
  - People-directory lookup.
- `POST https://m.soundcloud.com/api/code-exchange`
- `POST https://shrinklink.soundcloud.com/create`
- `POST https://soundcloud.zendesk.com/api/v2/tickets.json`

## Public embed and partner routes

- `GET https://soundcloud.com/oembed?url=<encoded-url>&format=<format>`
- `GET https://w.soundcloud.com/player/?url=<api-resource-url>&auto_play=false&show_artwork=true&visual=true&origin=<origin>`
- `GET https://api-partners.soundcloud.com/twitter/tracks/soundcloud:sounds:<id>/vmap`

The actual audio/transcoding URLs are generated dynamically from track metadata and are not a fixed endpoint list.

## Mobile page-route families from the Next.js manifest

- `/`
- `/discover`
- `/discover/[discoverPermalink]`
- `/discover/sets/[systemPlaylistPermalink]`
- `/charts`, `/charts/[kind]`
- `/search`, `/search/[category]`
- `/tags/[[...tagParts]]`
- `/signin`, `/signin/callback`, `/signin/post-signin-redirect`, `/signin/reset/success`
- `/upload`, `/download`, `/feed`, `/explore`
- `/messages`, `/messages/[conversationId]`
- `/notifications`
- `/settings`, `/settings/language`, `/settings/twoFA`
- `/you`
- `/you/albums`, `/you/comments`, `/you/followers`, `/you/following`
- `/you/history`, `/you/insights/overview`, `/you/library`, `/you/likes`
- `/you/mastering`, `/you/reposts`, `/you/releases`, `/you/sets`, `/you/stats`
- `/you/subscriptions`
- `/[user]`
- `/[user]/albums`, `/[user]/comments`, `/[user]/followers`, `/[user]/following`
- `/[user]/likes`, `/[user]/popular-tracks`, `/[user]/reposts`, `/[user]/sets`, `/[user]/tracks`
- `/[user]/sets/[playlist]`
- `/[user]/sets/[playlist]/likes`
- `/[user]/sets/[playlist]/reposts`
- `/[user]/sets/[playlist]/[secretToken]`
- `/[user]/sets/[playlist]/[secretToken]/likes`
- `/[user]/sets/[playlist]/[secretToken]/reposts`
- `/[user]/[track]`
- `/[user]/[track]/albums`, `/[user]/[track]/comments`, `/[user]/[track]/likes`
- `/[user]/[track]/recommended`, `/[user]/[track]/reposts`, `/[user]/[track]/sets`
- `/[user]/[track]/[secretToken]`
- `/[user]/[track]/[secretToken]/albums`
- `/[user]/[track]/[secretToken]/comments`
- `/[user]/[track]/[secretToken]/likes`
- `/[user]/[track]/[secretToken]/recommended`
- `/[user]/[track]/[secretToken]/reposts`
- `/[user]/[track]/[secretToken]/sets`
- Legal/content pages: `/community-guidelines`, `/digital-services-act`, `/go-terms-of-use`, `/imprint`, `/law-enforcement-guidelines`, `/terms-of-use`, `/terms-of-use-pro`, `/transparency-reports`, `/pages/[...pageName]`

## Notes

- `robots.txt` points crawlers to the canonical `soundcloud.com` sitemap rather than a mobile-host sitemap.
- The mobile frontend currently exposes the data API as `api-mobi.soundcloud.com`; this can change with a new frontend build.
- Route templates are not authorization proof. A route may require login, an OAuth cookie, CSRF/session state, or specific query parameters.