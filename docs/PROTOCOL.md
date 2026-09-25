<p align="center">
  <img src="../public/brand/lnwjud-watcher-logo-transparent.png" width="180" alt="LNWJUD Watcher" />
</p>

# Watcher Protocol v1

## สำหรับผู้ใช้ทั่วไป / For users

ผู้ใช้ทั่วไปไม่ต้องเรียก API เอง: เปิด LNWJUD v5.6.0+, ใช้ local pairing endpoint เพื่อรับ Watcher endpoint/token แล้วกรอกในแอป Watcher. รายละเอียดการเชื่อมต่ออยู่ใน [README](../README.md).

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
`WS /events` streams validated event envelopes after the initial snapshot. Clients reconnect with bounded exponential backoff, refresh the authoritative snapshot after reconnect, and re-sync the snapshot after live activity so Goal/Agent/Git state cannot remain stale while the socket stays healthy.

## Authentication
The snapshot request requires a dedicated Watcher bearer token in the HTTP Authorization header. For WebSocket connections, the client sends an initial JSON auth frame immediately after the socket opens; the token is never placed in the WebSocket URL. The server confirms successful authentication with `{ "type": "ready", "protocolVersion": 1 }`; clients must not report realtime as connected before receiving that acknowledgement. Watcher keeps the token in session storage only and does not persist it in local storage.

LNWJUD Desktop exposes a separate pairing endpoint on loopback only (default `http://127.0.0.1:17891/api/v1/pair`) so the local operator can obtain the current endpoint/token. Never tunnel or reverse-proxy the pairing port; remote access exposes only the authenticated Watcher API port.

Remote endpoints must use HTTPS/WSS. Cleartext HTTP/WS is accepted only for loopback development (localhost, 127.0.0.1, or ::1).

## Provider metadata
The client recognizes these endpoint deployment types for user guidance only: `local`, `zrok`, `cloudflare`, `tailscale-serve`, `tailscale-funnel`, `ngrok`, and `custom`. Provider selection does not change protocol semantics.

## Security invariant
Watcher Protocol v1 is read-only. There are no command, approval, pause/resume, filesystem, shell, or MCP mutation endpoints in this contract.
