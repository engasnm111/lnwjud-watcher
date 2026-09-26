<p align="center">
  <img src="../public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# Architecture

## สำหรับผู้ใช้ทั่วไป / For users

ถ้าต้องการแค่ติดตั้งและเชื่อมต่อ ให้เริ่มจาก [README](../README.md) และ [คู่มือเลือก Provider](providers/README.md) ก่อน เอกสารหน้านี้อธิบายโครงสร้างภายในสำหรับผู้ดูแลและนักพัฒนา.

## Scope
lnwjud Watcher is a read-only monitoring client delivered from one codebase to Desktop, Web/PWA, Android, and iOS. It connects to a lnwjud runtime through a versioned Watcher Protocol over HTTPS plus WebSocket.

## Trust boundary

```text
lnwjud runtime (source of truth)
  -> sanitized Watcher API /api/v1
  -> HTTPS snapshot + WSS event stream
  -> lnwjud-watcher
       -> Electron Desktop
       -> Web/PWA
       -> Capacitor Android
            -> local sanitized widget cache -> Android AppWidget providers
       -> Capacitor iOS
```

Watcher does not start tunnels and does not expose MCP. Remote access providers (Local/LAN, zrok, Cloudflare Tunnel, Tailscale Serve/Funnel, ngrok, Custom HTTPS) terminate in front of the Watcher API managed by lnwjud.

## Layers
- **domain**: stable monitoring entities and status vocabulary.
- **data/protocol**: Zod schemas and protocol-version validation.
- **data/transport**: HTTP snapshot and reconnecting WebSocket client.
- **data/connections**: non-secret connection profiles; session-only access token handling.
- **features**: Overview, Goals, Agents, Activity, Settings.
- **shared**: layout, status components, formatting, and platform-neutral utilities.
- **Android widgets**: a tiny Capacitor bridge stores only sanitized display state in private SharedPreferences; AppWidget providers read that cache. The Watcher Session token is never copied into widget state.

## Protocol rules
1. Every snapshot includes `protocolVersion`, runtime version, stable instance identity, server timestamp, and an additive `workspaces[]` read model covering every Active Project and its active Durable Goals.
2. Every stream event has an id, timestamp, kind, status, actor, summary, and optional sanitized evidence.
3. Unknown event kinds are tolerated, but malformed envelopes are rejected.
4. Protocol major-version mismatch fails closed with an actionable compatibility message.
5. Progress is evidence-based from milestone counts; the client never invents completion percentages.
6. "Analyzing" is observable summarized activity only; hidden chain-of-thought is never requested or displayed.

## Release model
- `main`: released/integrated history.
- `dev`: active integration branch.
- Current public release: `v0.2.3`; 1.0 is reserved for a stable protocol and signed mobile distribution path.
