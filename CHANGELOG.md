<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# Changelog

## 0.1.0 - 2026-09-26

First canonical full release of lnwjud Watcher.

- Read-only Watcher Protocol v1 client for lnwjud v5.6.1+ with runtime validation, authenticated snapshot access, and realtime WebSocket activity.
- Multi-project and multi-goal monitoring across every Active Project, including active operations, observable agents, activity, blockers, milestone progress, and project-scoped Git state.
- Runtime observability distinguishes work visible inside lnwjud from ChatGPT reasoning outside runtime tool calls.
- Overview shows branch, short commit, clean/dirty state, changed-file count, latest commit subject/time, and last runtime work age.
- Copy-friendly local pairing UI at `127.0.0.1:17891/api/v1/pair`, with JSON mode retained for integrations.
- Session token persistence across restarts: Web/PWA stores it for 60 days; packaged desktop/mobile builds keep it on-device until cleared in Settings.
- Mandatory GitHub Release update flow for Web/PWA, Android, Windows, macOS, Linux, and iOS handoff.
- Desktop distribution for Windows portable EXE, macOS DMG, and Linux AppImage, with tray/background behavior.
- Hosted GitHub Pages Web/PWA plus Android APK and iOS Simulator artifacts.
- Persistent Android release-signing identity for future in-place APK upgrades from v0.1.0 onward.
- Remote access guidance for local/LAN, zrok, Cloudflare, Tailscale Serve/Funnel, ngrok, and custom HTTPS.
- ISO-8601 protocol timestamps accept timezone offsets emitted by Git, preventing valid `+HH:MM` commit dates from breaking snapshot validation.
- Thai/English localization, onboarding, install guides, provider documentation, and community files.
- Watcher remains strictly read-only; pairing port 17891 remains loopback-only.
