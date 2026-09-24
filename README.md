# LNWJUD Watcher

Read-only monitoring client for lnwjud, delivered from one React/TypeScript codebase to **Web/PWA, Android, and iOS**.

## v0.1.0 scope

- Responsive Overview, Goals, Agents, Activity, and Settings views.
- Runtime-validated Watcher Protocol v1 with HTTPS snapshot + reconnecting WebSocket events.
- Demo mode for UI/runtime simulation.
- Remote endpoint profiles for Local/LAN, **zrok**, Cloudflare Tunnel, Tailscale Serve, Tailscale Funnel, ngrok, and custom HTTPS.
- PWA installability plus Capacitor Android/iOS shells.
- Session-only access tokens; remote cleartext HTTP is rejected.
- No shell, filesystem mutation, MCP execution, pause/resume, approvals, or hidden model reasoning.

> Live data requires a lnwjud runtime that implements the read-only Watcher Protocol described in [docs/PROTOCOL.md](docs/PROTOCOL.md). This repository intentionally does not read lnwjud databases or internal files directly.

## Development

Requires Node.js 22–24.

```bash
npm ci
npm run dev
```

Quality gates:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Native shells:

```bash
npm run build
npx cap sync android
npx cap sync ios
```

Android builds require an Android SDK/JDK 21 environment. iOS device/App Store builds require macOS, Xcode, an Apple Developer identity, and signing configuration. CI validates an unsigned iOS Simulator build.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The central invariant is simple:

```text
lnwjud runtime -> sanitized Watcher Protocol -> lnwjud-watcher -> Web / Android / iOS
```

The runtime remains the source of truth. Watcher is a client only.

## Branching and release

- `dev` — active integration work.
- `main` — released history.
- Changes are merged from `dev` to `main` by pull request.
- Tags matching `v*` trigger Web, Android debug APK, and iOS Simulator release artifacts.

## Security

Treat every runtime payload as untrusted. Protocol data is validated before rendering. Access tokens are kept in session storage only and never added to the WebSocket URL. CI uses least-privilege token scopes and action commit-SHA pins.

## License

MIT.
