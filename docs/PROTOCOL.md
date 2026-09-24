# Watcher Protocol v1

Base URL: `https://<runtime-host>/api/v1`

## Snapshot
`GET /snapshot` returns the complete initial read model used to render the application.

Required top-level fields:
- `protocolVersion: 1`
- `serverTime`: ISO-8601 timestamp
- `runtime`: lnwjud version and health
- `instance`: stable id, user-facing name, platform
- `goal`: current durable goal or null
- `agents`: observable agent states
- `activity`: recent observable activity events
- `git`: sanitized repository baseline

## Live events
`WS /events` streams validated event envelopes after the initial snapshot. Clients reconnect with bounded exponential backoff and refresh the snapshot after reconnect.

## Authentication
The snapshot request accepts an optional bearer token in the HTTP Authorization header. For WebSocket connections, the client sends an initial JSON auth frame after the socket opens when a token is configured; the token is never placed in the WebSocket URL. Watcher does not persist bearer tokens in local storage in v0.1.0.

Remote endpoints must use HTTPS/WSS. Cleartext HTTP/WS is accepted only for loopback development (localhost, 127.0.0.1, or ::1).

## Provider metadata
The client recognizes these endpoint deployment types for user guidance only: `local`, `zrok`, `cloudflare`, `tailscale-serve`, `tailscale-funnel`, `ngrok`, and `custom`. Provider selection does not change protocol semantics.

## Security invariant
Watcher Protocol v1 is read-only. There are no command, approval, pause/resume, filesystem, shell, or MCP mutation endpoints in this contract.
