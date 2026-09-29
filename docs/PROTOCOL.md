<p align="center">
  <img src="../public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# Watcher Protocol v1

## สำหรับผู้ใช้ทั่วไป / For users

ผู้ใช้ทั่วไปไม่ต้องเรียก API เอง: เปิด LNWJUD v5.6.1+ (แนะนำ v5.6.6 เพื่อข้อมูล Goal และปลั๊กอินครบ), ใช้ local pairing endpoint เพื่อรับ Watcher endpoint/token แล้วกรอกในแอป Watcher. รายละเอียดการเชื่อมต่ออยู่ใน [README](../README.md).

Base URL: `https://<runtime-host>/api/v1`

## Snapshot
`GET /snapshot` returns the complete initial read model used to render the application.

Required top-level fields:
- `protocolVersion: 1`
- `serverTime`: ISO-8601 timestamp
- `runtime`: lnwjud version and health
- `instance`: stable id, user-facing name, platform
- `goal`: selected/primary-project durable goal compatibility view or null
- `workspaces`: every Active Project, with all active Durable Goals, active-operation count, and sanitized per-project Git state
- `agents`: observable agent states, tagged with workspace identity when known
- `activity`: recent observable activity events, tagged with workspace identity when known
- `git`: selected/primary-project sanitized Git compatibility view

`workspaces` is an additive Protocol v1 field. LNWJUD v5.6.1 keeps top-level `goal` and `git` so clients written for the original v1 shape can continue to render the selected project. New clients should use `workspaces[]` for parallel-project and multi-goal views.

LNWJUD v5.6.6 adds these optional Protocol v1 fields while retaining compatibility with older clients:

- `plugins[]`: each user-configured MCP server's display name, provider (`mcp`), enabled/connected/excluded flags, and lifecycle. Commands, paths, credentials, and server configuration are omitted. External agent hosts that do not expose plugin identity cannot supply their own plugin names.
- Every active Goal includes `lifecycle: "active"`, `completionReady`, `objective`, `currentPhase`, `acceptanceCriteria[]` with id/title/status, `activeTaskCount`, `createdAt`, `updatedAt`, and `lastCheckpointAt` when available. Text is bounded and sanitized.
- `completionReady` means all plan steps and acceptance criteria are complete, with no blockers or active tasks. It does **not** mean the Goal is closed: LNWJUD still requires explicit `finish_goal` and its terminal checks.
- Runtime and orchestrator `running` reflect observable work in progress. An open Goal with no active operation is waiting or idle, even if its checklist is complete.

Watcher v0.2.8 uses the new fields for Goal readiness, project details, alerts, and plugin names. Older LNWJUD versions remain readable with less detail.

## Live events
`WS /events` streams validated event envelopes after the initial snapshot. Clients reconnect with bounded exponential backoff, refresh the authoritative snapshot after reconnect, and re-sync the snapshot after live activity so Goal/Agent/Git state cannot remain stale while the socket stays healthy.

## Authentication
The snapshot request requires a dedicated Watcher bearer token in the HTTP Authorization header. For WebSocket connections, the client sends an initial JSON auth frame immediately after the socket opens; the token is never placed in the WebSocket URL. The server confirms successful authentication with `{ "type": "ready", "protocolVersion": 1 }`; clients must not report realtime as connected before receiving that acknowledgement. Watcher stores the dedicated Session token locally for up to one year to support one-time setup, removes it on expiry or when cleared in Settings, and never puts it in widgets, URLs, or logs.

LNWJUD Desktop exposes a separate pairing endpoint on loopback only (default `http://127.0.0.1:17891/api/v1/pair`) so the local operator can obtain the current endpoint/token. Never tunnel or reverse-proxy the pairing port; remote access exposes only the authenticated Watcher API port.

Remote endpoints must use HTTPS/WSS. Cleartext HTTP/WS is accepted only for loopback development (localhost, 127.0.0.1, or ::1).

## Provider metadata
The client recognizes these endpoint deployment types for user guidance only: `local`, `zrok`, `cloudflare`, `tailscale-serve`, `tailscale-funnel`, `ngrok`, and `custom`. Provider selection does not change protocol semantics.

## Security invariant
Watcher Protocol v1 is read-only. There are no command, approval, pause/resume, filesystem, shell, or MCP mutation endpoints in this contract.
