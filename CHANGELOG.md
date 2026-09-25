<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="LNWJUD Watcher" />
</p>

# Changelog

## 0.3.0 - 2026-09-25

Observability, parallel-work, pairing, and update-safety release.

- Added multi-project/multi-goal Watcher state: every Active Project can expose all active Durable Goals, project-scoped operations/agents/activity, and per-project Git state in one additive Protocol v1 snapshot.
- Clarified Agent semantics: Watcher reports only work observable inside the LNWJUD Runtime, not ChatGPT reasoning between tool calls.
- Added active-operation count and a live relative "last runtime work" age separate from connection/snapshot freshness.
- Expanded Git visibility with branch, commit, clean/dirty state, changed-file count, latest commit subject, and latest commit time.
- Added a shared Session-token help block to onboarding and Settings on every Watcher platform.
- LNWJUD v5.6.1 pairing now renders a copy-friendly local UI while preserving JSON pairing for integrations.
- Added a mandatory GitHub Release update gate: startup/foreground/30-minute checks, Web/PWA refresh update, and platform-specific release/download handoff for Android/Desktop/macOS/Linux/iOS.
- Switched Android release artifacts from ephemeral debug APKs to a release-signed APK with a persistent signing identity for future in-place upgrades from v0.3.0 onward.
- Kept Watcher read-only and kept pairing port 17891 local-only.

## 0.2.0 - 2026-09-25

Beginner-friendly desktop and remote monitoring release.

- Added one-click desktop distribution: Windows portable EXE, macOS DMGs, and Linux AppImage.
- Added close-to-tray/background behavior for the desktop wrapper while preserving the read-only Watcher boundary.
- Added hosted GitHub Pages Web/PWA as the simplest browser and iPhone/iPad path.
- Added bilingual install instructions for Windows, macOS, Linux, Android, iPhone/iPad, Web/PWA, pairing, and remote access.
- Expanded bilingual provider guides, including complete zrok download/extract/PATH/token/enable/share steps.
- Clarified Cloudflare Tunnel as a free-plan-capable public option, with Quick Tunnel limitations and stable-domain requirements documented.
- Standardized README/document branding, download cards, About/topics, and GitHub community files.

## 0.1.0 - 2026-09-25

Initial public preview release.

- Web/PWA, Android, and iOS from one shared React/TypeScript + Capacitor codebase.
- Approved Watcher gold eye/radar branding with self-hosted Prompt Thai/Latin typography.
- Complete Thai/English app localization and onboarding.
- Read-only Watcher Protocol v1 client with runtime validation.
- Reconnecting authenticated live activity stream with explicit server `ready` acknowledgement, authoritative snapshot re-sync after live activity/reconnect, and 5-second degraded fallback refresh.
- Evidence-based goal progress plus Overview, Goals, Agents, Activity, Settings, and first-run connection flow.
- Local/LAN, zrok, Cloudflare, Tailscale Serve/Funnel, ngrok, and custom HTTPS guidance.
- Provider detection/install helper scripts for Windows and POSIX hosts where safe.
- Session-only client bearer token handling, HTTPS-only remote endpoints, and local-only pairing guidance.
- Consumer-first README and provider troubleshooting documentation.
- Hardened SHA-pinned GitHub Actions for quality, Android, iOS Simulator, and tagged release artifacts.
