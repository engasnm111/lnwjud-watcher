<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="180" alt="LNWJUD Watcher" />
</p>

# LNWJUD Watcher v0.1.0

First public cross-platform release of the read-only LNWJUD Watcher.

### Web / Android / iOS
- One React/TypeScript UI ships as Web/PWA plus Capacitor Android and iOS shells.
- Responsive LNWJUD-family Watcher design using the approved gold eye/radar identity.
- Self-hosted Prompt typography for Thai and English.
- Thai/English first-run flow and in-app language switching.

### Live monitoring
- Watcher Protocol v1 client with runtime validation.
- Initial authoritative snapshot plus authenticated WebSocket live events.
- Realtime is marked connected only after the runtime confirms token authentication with a `ready` acknowledgement.
- Automatic authoritative snapshot re-sync after reconnect **and after live activity**, keeping Goal, Agent, and Git state current.
- 5-second visible-screen snapshot fallback while realtime is degraded.
- Manual refresh remains available.
- Evidence-based goal progress; hidden model reasoning is never requested or shown.

### Easy connection
- Guided setup for Local/LAN, zrok, Cloudflare Tunnel, Tailscale Serve/Funnel, ngrok, and Custom HTTPS.
- Windows and macOS/Linux helper scripts for provider detection/install guidance.
- Dedicated Watcher access token obtained from the local-only LNWJUD pairing endpoint.

### Runtime requirement
Real monitoring requires **LNWJUD v5.6.0 or later**, which provides the read-only Watcher snapshot/WebSocket server, protected Watcher token, local pairing endpoint, ActivityTracker subscriptions, and Desktop auto-start.

### Release artifacts
- `lnwjud-watcher-web.zip`
- `lnwjud-watcher-android-debug.apk`
- `lnwjud-watcher-ios-simulator.zip`

### Security boundary
Watcher v0.1.0 is intentionally read-only: no shell, file mutation, MCP command execution, approval, pause/resume, provider credentials, or hidden chain-of-thought surface.

The Android artifact is an evaluation/debug APK. The iOS artifact validates the Simulator/native shell; installation on a physical iPhone/App Store distribution requires Apple signing credentials.
