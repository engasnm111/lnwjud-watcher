<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

<h1 align="center">lnwjud Watcher</h1>

<p align="center">
  <strong>Read-only live monitoring for LNWJUD on Desktop, Web/PWA, Android, and iOS.</strong><br />
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
  <img alt="Targets" src="https://img.shields.io/badge/Desktop%20%7C%20Web%20%7C%20Android%20%7C%20iOS-Watcher-d5a63a" />
  <img alt="Protocol" src="https://img.shields.io/badge/Watcher%20Protocol-v1-d5a63a" />
</p>

<h2 align="center">Download lnwjud Watcher</h2>
<p align="center">One-click desktop, Android, iPhone/iPad PWA, or browser. Current release: v0.2.1.</p>

<table align="center">
  <tr>
    <td align="center" width="33%">
      <a href="https://github.com/engasnm111/lnwjud-watcher/releases/latest/download/lnwjud-watcher-windows-x64.exe">
        <img src="assets/download/download-desktop.svg" width="300" alt="Download lnwjud Watcher Desktop" />
      </a><br />
      <sub>Windows portable EXE · <a href="https://github.com/engasnm111/lnwjud-watcher/releases/latest/download/lnwjud-watcher-macos-arm64.dmg">macOS Apple silicon</a> · <a href="https://github.com/engasnm111/lnwjud-watcher/releases/latest/download/lnwjud-watcher-macos-x64.dmg">macOS Intel</a> · <a href="https://github.com/engasnm111/lnwjud-watcher/releases/latest/download/lnwjud-watcher-linux-x64.AppImage">Linux</a></sub>
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/engasnm111/lnwjud-watcher/releases/latest/download/lnwjud-watcher-android.apk">
        <img src="assets/download/download-android.svg" width="300" alt="Download lnwjud Watcher for Android" />
      </a><br />
      <sub>Android APK · direct install</sub>
    </td>
    <td align="center" width="33%">
      <a href="https://engasnm111.github.io/lnwjud-watcher/">
        <img src="assets/download/download-ios.svg" width="300" alt="Open lnwjud Watcher Web/PWA for iPhone and iPad" />
      </a><br />
      <sub>iPhone/iPad: Safari → Add to Home Screen · <a href="https://engasnm111.github.io/lnwjud-watcher/">Web/PWA</a></sub>
    </td>
  </tr>
</table>

<p align="center"><a href="docs/INSTALL.md"><strong>Easy install guide / คู่มือติดตั้งแบบง่าย →</strong></a> · <a href="https://github.com/engasnm111/lnwjud-watcher/releases/latest"><strong>View all release files →</strong></a></p>

## See lnwjud Watcher at a glance

<table>
  <tr>
    <td width="50%" align="center"><strong>Mobile Activity</strong><br /><sub>Live observable work, status, timestamps, commands, and task IDs.</sub></td>
    <td width="50%" align="center"><strong>Android home-screen widgets</strong><br /><sub>Status, Goal, and Agents without opening the app.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="assets/screenshots/mobile-activity-preview.svg" width="360" alt="lnwjud Watcher mobile Activity UI" /></td>
    <td align="center"><img src="assets/screenshots/android-widgets-preview.svg" width="560" alt="lnwjud Watcher Android Status, Goal, and Agents widgets" /></td>
  </tr>
</table>

The widgets are designed for the quick question that matters most during long-running work: **what is it doing now, and how long ago did it last do anything?**

---

## Current version

**lnwjud Watcher v0.2.1** is designed for **LNWJUD v5.6.1 or later**.

### What's new in v0.2.1

- **iQOO/narrow-screen Activity spacing:** status and timestamp now have an explicit 10 px content buffer in addition to the layout gap, so they cannot visually touch even when the WebView compresses the header.
- **Polished Android widgets:** Status, Goal, and Agents layouts are tuned for launcher previews and practical home-screen sizes.
- **In-app Android update:** Watcher downloads the trusted GitHub APK inside the app, then opens Android's installer only when the file is ready. Android still requires the normal install confirmation.
- **Visual README:** the mobile Activity UI and Android widget family are now shown directly in the repository.

### v0.2.0 highlights

- **Parallel projects and goals:** one Watcher snapshot shows every Active Project and all active Durable Goals inside each project, so several jobs can run at the same time without the UI collapsing them into one “current goal”.
- **Clearer runtime tracking:** Watcher distinguishes observable LNWJUD runtime work from ChatGPT thinking outside the runtime, shows active-operation count, and adds a live “last runtime work” age. Active goals with zero observable operations are shown as waiting, and agents/runtime are idle instead of falsely appearing to run.
- **Richer Git status:** branch, current commit, clean/dirty state, changed-file count, latest commit subject, and latest commit time are shown on Overview.
- **Copy-friendly pairing:** LNWJUD v5.6.1 turns `127.0.0.1:17891/api/v1/pair` into a local-only UI with one-click Session token copy while preserving JSON mode.
- **Remembered pairing:** Web/PWA keeps the Session token for 60 days in browser-local storage. Packaged Desktop and mobile apps keep it on the device across restarts until you clear it in Settings.
- **Android home-screen widgets:** v0.2.0 adds three launcher widgets — Status, Goal, and Agents — showing current work, active counts, the latest activity, and how long ago the last work/sync happened without exposing the Watcher token.
- **Cleaner mobile Activity cards:** status/time and project/title blocks keep explicit spacing and long commands/IDs wrap safely on narrow screens.
- **Mandatory update prompt:** Watcher checks the latest GitHub Release on startup, every 30 minutes, and when the app becomes visible. v0.1.0 → v0.2.0 is a normal semantic-version upgrade path, so users can directly test the signed APK update flow.
- **Web/PWA update:** service-worker updates are refreshed automatically.
- **Stable Android upgrade identity:** v0.2.0 keeps the same persistent signing identity and a higher internal Android `versionCode`, so it can install over the signed v0.1.0 APK. Android still requires the normal user install confirmation; Watcher cannot silently replace an APK.
- **Progressive Activity feed:** Activity renders 20 cards at a time and automatically loads the next batch near the bottom (with a manual fallback button), while the runtime snapshot remains capped at 100 recent events.
- **Desktop/Linux/macOS/iOS handoff:** the forced update modal opens the matching GitHub asset or release page. Platform security still requires the normal OS confirmation/signing flow; Watcher does not silently execute downloaded binaries.

- **One-click desktop:** Windows portable EXE, macOS DMGs, and Linux AppImage run the production Watcher UI without Node.js/npm.
- **Tray background mode:** closing the desktop window hides Watcher to the tray/menu bar; the tray menu can show/hide or fully quit.
- **Hosted Web/PWA:** normal users can open the GitHub Pages build directly instead of running a dev server.
- **Practical iPhone path:** Safari → Add to Home Screen is documented as the normal physical-device path; the native release artifact remains Simulator-only until Apple signing is available.
- **Beginner install guide:** Windows, macOS, Linux, Android, iPhone/iPad, Web/PWA, pairing, and remote access are explained step-by-step in English + Thai.
- **Provider guides rebuilt:** zrok now covers download/extract/PATH/token/enable/share; Cloudflare is documented as the recommended stable public option when the user already has a Cloudflare-managed domain.
- **Repository polish:** About/topics, community files, consistent logo sizing, and platform download cards now match the main LNWJUD repository more closely.
- The monitoring surface remains **read-only**.

## What is lnwjud Watcher?

lnwjud Watcher is the read-only companion for [LNWJUD](https://github.com/engasnm111/lnwjud). It shows whether LNWJUD is still working, every active project and Durable Goal, milestone progress, observable agents/workers, blockers, per-project Git state, and recent activity.

Watcher consumes **Watcher Protocol v1**. It never reads the LNWJUD database directly.

## Quick setup

### English

1. Run **LNWJUD v5.6.1+**.
2. On the LNWJUD computer open `http://127.0.0.1:17891/api/v1/pair`.
3. Copy the Watcher endpoint/token. **Never expose port 17891.**
4. For same-PC use, connect to `http://127.0.0.1:17890`.
5. For remote/public use, choose a provider below and expose **only port 17890**.
6. In Watcher, enter the provider HTTPS URL plus the Watcher token.

### ภาษาไทย

1. เปิด **LNWJUD v5.6.1 ขึ้นไป**
2. บนเครื่อง LNWJUD เปิด `http://127.0.0.1:17891/api/v1/pair`
3. คัดลอก Watcher token และ **ห้ามเปิด port 17891 ออกอินเทอร์เน็ต**
4. ถ้าใช้เครื่องเดียวกันให้ใช้ `http://127.0.0.1:17890`
5. ถ้าจะดูจากนอกบ้านให้เลือก provider ด้านล่างและ expose เฉพาะ **17890**
6. ใน Watcher ใส่ HTTPS URL ของ provider + Watcher token

## Remote access — recommended order

| Situation | Recommended |
| --- | --- |
| Public, free-first, stable URL and you already own a Cloudflare-managed domain | **Cloudflare Tunnel — recommended** |
| Public and you do not own a domain | **zrok** |
| Private access between your own devices | **Tailscale Serve** |
| Public through Tailscale | **Tailscale Funnel** |
| Existing ngrok user | **ngrok** |
| Same computer | **Local** |
| Own VPS/reverse proxy | **Custom HTTPS** |

Cloudflare Tunnel is available on all Cloudflare plans. Quick Tunnels are free and temporary, but Cloudflare documents them as testing/development only. A stable hostname requires a Cloudflare account and a domain on Cloudflare.

Provider guides — every guide includes **English + Thai**:

- [Provider chooser / เลือก Provider](docs/providers/README.md)
- [Cloudflare Tunnel — recommended public](docs/providers/cloudflare.md)
- [zrok — public without your own domain](docs/providers/zrok.md)
- [Tailscale Serve / Funnel](docs/providers/tailscale.md)
- [ngrok](docs/providers/ngrok.md)
- [Local / LAN](docs/providers/local.md)
- [Custom HTTPS](docs/providers/custom-https.md)

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

If the socket disconnects, Watcher reconnects automatically and uses a 5-second snapshot fallback until realtime returns.

## What you can see

- runtime online/offline state;
- current Durable Goal and milestone progress;
- current task and blockers;
- observable agents/workers;
- sanitized Git branch/commit/clean state;
- structured recent activity;
- live/reconnecting/fallback connection state.

Watcher does **not** expose hidden model reasoning.

## Security boundary

- LNWJUD is the source of truth.
- Watcher is read-only.
- Pairing stays loopback-only on port 17891.
- Remote Watcher traffic uses HTTPS/WSS.
- The dedicated Watcher token is separate from MCP/tunnel/provider credentials.
- The client keeps the bearer token session-only.
- Protocol v1 exposes no shell, file mutation, MCP mutation, or approval surface.

See [Protocol v1](docs/PROTOCOL.md) and [Architecture](docs/ARCHITECTURE.md).

## Troubleshooting

**PowerShell says the provider script cannot be found**

```powershell
cd C:\path\to\lnwjud-watcher
Get-ChildItem .\scripts\providers\
```

Then run the helper from the repo root.

**401 / Unauthorized** — pair again locally and use the Watcher token, not the Cloudflare/zrok/ngrok provider token.

**Snapshot works, realtime does not** — your tunnel/reverse proxy must support WebSocket upgrade at `/api/v1/events`.

**A phone cannot open 127.0.0.1** — that address points to the phone itself. Use Cloudflare, zrok, Tailscale, ngrok, or another HTTPS provider.

## Development

Requires Node.js 22–24.

```bash
npm ci
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

Branch model: `dev → PR → main → tag`.

## Community

- [Contributing](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [MIT License](LICENSE)

## License

MIT
