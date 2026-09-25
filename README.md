<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="300" alt="LNWJUD Watcher" />
</p>

<h1 align="center">LNWJUD Watcher</h1>

<p align="center">
  <strong>Read-only live monitoring for LNWJUD on Web/PWA, Android, and iOS.</strong><br />
  See runtime health, Durable Goal progress, agents, blockers, Git state, and observable activity without exposing LNWJUD's command surface.
</p>

<p align="center">
  <a href="README_TH.md"><strong>ภาษาไทย</strong></a>
  ·
  <a href="https://github.com/engasnm111/lnwjud"><strong>LNWJUD</strong></a>
  ·
  <a href="https://github.com/engasnm111/lnwjud-watcher/releases/latest"><strong>Latest Release</strong></a>
</p>

<p align="center">
  <a href="https://github.com/engasnm111/lnwjud-watcher/releases/latest"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/engasnm111/lnwjud-watcher" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img alt="Targets" src="https://img.shields.io/badge/Web%20%7C%20Android%20%7C%20iOS-Watcher-d5a63a" />
  <img alt="Protocol" src="https://img.shields.io/badge/Watcher%20Protocol-v1-d5a63a" />
</p>

---

## Current version

**LNWJUD Watcher v0.1.0** is designed for **LNWJUD v5.6.0 or later**.

### What's new in v0.1.0

- **Authenticated realtime:** initial snapshot plus WebSocket live events with automatic reconnect.
- **No false connected state:** Watcher reports realtime as connected only after LNWJUD validates the token and sends the Protocol v1 `ready` acknowledgement.
- **Authoritative live state:** accepted live activity triggers a deduplicated snapshot re-sync so Goal, Agent, and Git state do not silently go stale.
- **Automatic fallback:** if realtime is unavailable, Watcher refreshes snapshots every 5 seconds while the app is open.
- **Three targets:** Web/PWA, Android, and iOS share the same React/TypeScript application.
- **English + Thai UI:** the product UI supports both languages; this README stays English-first and the Thai guide lives in [README_TH.md](README_TH.md).
- **Read-only by design:** no shell, filesystem mutation, MCP mutation, approve/reject actions, or hidden chain-of-thought access.

## What is LNWJUD Watcher?

LNWJUD Watcher is a companion app for [LNWJUD](https://github.com/engasnm111/lnwjud). It is meant for people who want to check whether LNWJUD is still working, what goal is active, which agents are active, whether anything is blocked, and what observable work happened recently—without keeping the LNWJUD machine in front of them.

Watcher consumes **Watcher Protocol v1** from the LNWJUD runtime. It never reads the LNWJUD database directly.

## Targets

| Target | Use | v0.1.0 |
| --- | --- | --- |
| **Web / PWA** | Browser or Add to Home Screen | Production web bundle |
| **Android** | Installable APK | Android artifact from release CI |
| **iOS** | Native Capacitor shell | Simulator artifact; device/App Store signing requires Apple credentials |

## Quick setup

### English

#### 1. Run LNWJUD v5.6.0 or later

LNWJUD Desktop starts the read-only Watcher API with the Desktop runtime.

On the LNWJUD machine, open:

```text
http://127.0.0.1:17891/api/v1/pair
```

The pairing response gives you:

- the local Watcher endpoint;
- the dedicated Watcher access token;
- the Watcher protocol version.

> **Do not expose port 17891 to the internet.** It is a loopback-only pairing endpoint.

#### 2. Choose how Watcher reaches LNWJUD

| Situation | Recommended option |
| --- | --- |
| Watcher runs on the same computer | **Local** |
| Private access between your devices | **Tailscale Serve** |
| Simple outbound public HTTPS | **zrok** |
| Existing Cloudflare/domain setup | **Cloudflare Tunnel** |
| Existing ngrok setup | **ngrok** |
| Your own VPS/reverse proxy | **Custom HTTPS** |

Expose only the Watcher API on **port 17890**. You do not need to expose the MCP gateway.

#### 3. Connect Watcher

On first run:

1. choose English or Thai;
2. choose a connection/provider;
3. enter the Watcher endpoint and token;
4. open Overview.

### ภาษาไทย — ตั้งค่าเบื้องต้น

#### 1. เปิด LNWJUD v5.6.0 ขึ้นไป

LNWJUD Desktop จะเปิด Watcher API แบบ read-only ให้อัตโนมัติพร้อมตัวโปรแกรม จากเครื่องที่รัน LNWJUD ให้เปิด:

```text
http://127.0.0.1:17891/api/v1/pair
```

จะได้ **Watcher endpoint**, **Watcher access token** และ **protocol version**

> **ห้ามเปิด port 17891 ออกอินเทอร์เน็ต** เพราะเป็น pairing endpoint ที่ออกแบบให้ใช้เฉพาะในเครื่อง

#### 2. เลือกวิธีที่ Watcher จะเชื่อมกลับมา

| ใช้งานแบบไหน | แนะนำ |
| --- | --- |
| Watcher อยู่เครื่องเดียวกับ LNWJUD | **Local** |
| ต้องการ private ระหว่างอุปกรณ์ | **Tailscale Serve** |
| ต้องการ public HTTPS แบบเริ่มง่าย | **zrok** |
| มี Cloudflare/domain อยู่แล้ว | **Cloudflare Tunnel** |
| ใช้ ngrok อยู่แล้ว | **ngrok** |
| มี VPS/reverse proxy ของตัวเอง | **Custom HTTPS** |

ถ้าใช้งานจากระยะไกล ให้ expose เฉพาะ Watcher API port **17890** ไม่ต้อง expose MCP gateway

#### 3. เปิด Watcher

ครั้งแรกให้เลือกภาษา เลือก provider แล้วกรอก endpoint + Watcher token จากนั้นเข้า **Overview** ได้เลย

> คู่มือภาษาไทยฉบับเต็ม: **[README_TH.md](README_TH.md)**

Provider guides:

- [Local / LAN](docs/providers/local.md)
- [zrok](docs/providers/zrok.md)
- [Cloudflare Tunnel](docs/providers/cloudflare.md)
- [Tailscale Serve / Funnel](docs/providers/tailscale.md)
- [ngrok](docs/providers/ngrok.md)
- [Custom HTTPS](docs/providers/custom-https.md)
- [Provider chooser](docs/providers/README.md)

## Realtime behavior

```text
Initial snapshot
      ↓
WebSocket auth
      ↓
server "ready" acknowledgement
      ↓
live observable activity
      ↓
authoritative snapshot re-sync
```

If the socket disconnects, Watcher reconnects automatically. While realtime is degraded it falls back to a 5-second snapshot refresh. Manual Refresh remains available.

## What you can see

- runtime online/offline state;
- current Durable Goal and milestone progress;
- current task and blockers;
- active observable agents/workers;
- sanitized Git branch/commit/clean state;
- structured recent activity;
- live/reconnecting/fallback connection state.

Watcher does **not** expose hidden model reasoning.

## Security boundary

```text
LNWJUD runtime
   ↓ sanitized Watcher Protocol v1
HTTPS snapshot + authenticated WSS
   ↓
LNWJUD Watcher
Web / Android / iOS
```

Key rules:

- LNWJUD is the source of truth.
- Watcher is read-only.
- Pairing stays loopback-only on port 17891.
- Remote Watcher traffic uses HTTPS/WSS.
- The dedicated Watcher token is separate from MCP/tunnel credentials.
- The client keeps the bearer token session-only.
- Protocol v1 exposes no shell, file mutation, MCP mutation, or approval surface.

See [Protocol v1](docs/PROTOCOL.md) and [Architecture](docs/ARCHITECTURE.md).

## Download / install

Use the [latest LNWJUD Watcher release](https://github.com/engasnm111/lnwjud-watcher/releases/latest).

Release artifacts are produced by the repository release workflow for the supported targets. iPhone device/App Store installation still requires Apple signing credentials.

## Troubleshooting

**401 / Unauthorized**

Pair again on the LNWJUD machine and use the current Watcher token.

**Snapshot works, realtime does not**

Your tunnel or reverse proxy must support WebSocket upgrade at `/api/v1/events`.

**A phone cannot open a Local URL**

`127.0.0.1` on the phone points to the phone itself. Use Tailscale or another HTTPS provider.

**Should port 17891 be public?**

No. Only expose port 17890 when remote access is required.

## Development

Requires Node.js 22–24.

```bash
npm ci
npm run dev
```

Release gates:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx cap sync
```

Engineering docs:

- [Architecture](docs/ARCHITECTURE.md)
- [Protocol v1](docs/PROTOCOL.md)
- [Product truth](PRODUCT.md)
- [Design system](DESIGN.md)
- [v0.1.0 release checklist](docs/V0.1.0-RELEASE-PLAN.md)

Branch model:

- `dev` — development/integration
- `main` — released/integrated history
- release flow — `dev → PR → main → tag`

## License

MIT
