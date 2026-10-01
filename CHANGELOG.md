<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# Changelog

## 0.2.9 - 2026-10-01

- Automatically normalizes schemeless Watcher endpoints (e.g., `*.shares.zrok.io` or `localhost:17890`) by inferring HTTPS for remote hosts and HTTP for loopback addresses, preventing unhandled URL parsing crashes.
- Safely catches invalid endpoints in WebSocket transport and profile storage, surfacing clean connection error states instead of blank-screen lockouts.
- Added a root ErrorBoundary with reload and reset options for robust failure recovery.
- Updated Android alert monitor to safely normalize schemeless endpoints when syncing background inactivity notifications.

## 0.2.8 - 2026-09-30

- Goal progress percentages now count completed milestones only; acceptance criteria remain final completion checks and no longer dilute or double-count the numeric progress.

## 0.2.7 - 2026-09-28

- Prevented a stale update prompt from flashing after an Android APK upgrade while the previous service worker is being retired.
- Stopped native apps from registering the Web/PWA service worker; the hosted Web/PWA keeps automatic updates.
- Cleared an old update result immediately on foreground recheck and ignored responses from superseded checks.

## 0.2.6 - 2026-09-28

- Replaced the Android notification checkbox with an accessible gold toggle matching LNWJUD's switch style.
- Kept the existing notification permission request and saved on/off preference behavior.

## 0.2.5 - 2026-09-27

- Rendered Goal readiness from LNWJUD v5.6.6 acceptance criteria and active tasks, and separated open Goals from observable runtime work.
- Added Alerts Center, Project Details, Connection Health, and Activity filters.
- Added opt-in Android inactivity reminders that verify a fresh authenticated snapshot, cancel after Goal closure, and suppress repeated notifications for the same inactivity episode.
- Displayed configured MCP plugin names and lifecycle from the additive Watcher Protocol v1 fields.
- Prevented installed apps from offering an update to their already installed version.

## 0.2.4 - 2026-09-27

- Kept the hosted Web/PWA usable by removing native GitHub Release gating; service-worker updates remain automatic.
- Added a Ready to finish goal state and Overview count when all milestones are complete but the runtime still reports the goal active.
- Stored the Watcher Session token for up to one year across platforms, migrated valid older values, and added targeted connection-error guidance linking to Settings.
- Added native macOS Apple silicon/Intel DMG signature and runtime smoke checks, plus packaged Windows/Linux runtime checks.
- Added a Linux tar.gz fallback and release SHA-256 manifest.
- Clarified that custom plugin agent names are unavailable until LNWJUD exposes them in Watcher Protocol.

## 0.2.3 - 2026-09-26

Shared activity metadata and release consistency update.

- Added shared `StatusMeta` so Live Activity, Overview timeline, and Activity timeline use the same status + timestamp component.
- Unified status/time spacing, typography, and color across Desktop, Web/PWA, Android, and iOS.
- Updated package, iOS marketing version, release notes, install docs, architecture/product docs, demo data, and issue template to v0.2.3.
- Kept Android in-app update behavior: download the trusted GitHub APK inside Watcher, then hand off to Android for install confirmation.

## 0.2.1 - 2026-09-26

Corrective Android/mobile release.

- Added a guaranteed 10 px timestamp content buffer so Activity status/time cannot visually touch on compressed narrow-screen WebView layouts.
- Kept timestamp text on one line while preserving safe wrapping for long activity details.
- Polished the three Android launcher widgets and their launcher-preview sizing.
- Added the native Android in-app APK downloader/installer handoff for trusted GitHub release URLs.
- Added mobile UI and Android widget visual previews to README and README_TH.
- Bumped Android/iOS/package marketing version to 0.2.1 while retaining the same Android release signing identity for in-place upgrades.

## 0.2.0 - 2026-09-26

Mobile observability and signed Android upgrade release.

- Added three Android home-screen widgets: Status, Goal, and Agents.
- Widgets show current work, active goal/agent counts, milestone progress, latest activity age, and last-sync age from locally cached Watcher state.
- Widget storage deliberately excludes the Watcher Session token.
- Activity status/time and project/title areas now preserve explicit spacing on narrow screens; long commands, UUIDs, and paths wrap inside cards.
- Activity remains progressive at 20 cards per batch over the runtime's bounded 100-event recent history.
- Android public version is 0.2.0, using the same release-signing identity as v0.1.0 with a higher CI-generated internal versionCode for in-place signed upgrades.
- v0.1.0 → v0.2.0 is a normal GitHub Release semantic-version update path; Android still requires user install confirmation.
- iOS remains a Simulator release artifact; native physical-device WidgetKit distribution is not claimed in v0.2.0.

## 0.1.0 - 2026-09-26

First canonical full release of lnwjud Watcher.

- Read-only Watcher Protocol v1 client for lnwjud v5.6.1+ with runtime validation, authenticated snapshot access, and realtime WebSocket activity.
- Multi-project and multi-goal monitoring across every Active Project, including active operations, observable agents, activity, blockers, milestone progress, and project-scoped Git state.
- Runtime observability distinguishes work visible inside lnwjud from ChatGPT reasoning outside runtime tool calls.
- Fixed stale-running presentation: active durable goals with zero observable operations render as waiting, while agents/runtime render idle; genuinely terminal goals remain excluded from active-goal snapshots.
- Overview shows branch, short commit, clean/dirty state, changed-file count, latest commit subject/time, and last runtime work age.
- Copy-friendly local pairing UI at `127.0.0.1:17891/api/v1/pair`, with JSON mode retained for integrations.
- Session token persistence across restarts: Web/PWA stores it for 60 days; packaged desktop/mobile builds keep it on-device until cleared in Settings.
- Mandatory GitHub Release update flow for Web/PWA, Android, Windows, macOS, Linux, and iOS handoff, including commit-SHA detection for refreshed canonical v0.1.0 builds.
- Android keeps the public version at 0.1.0 while using a monotonically increasing internal `versionCode` so newly published signed APKs can replace older v0.1.0 builds.
- Activity cards now use explicit vertical rhythm and safe wrapping on narrow screens, with progressive 20-item rendering over the runtime's bounded 100-event snapshot.
- Desktop distribution for Windows portable EXE, macOS DMG, and Linux AppImage, with tray/background behavior.
- Hosted GitHub Pages Web/PWA plus Android APK and iOS Simulator artifacts.
- Native Android/iOS launcher and splash assets now use lnwjud Watcher branding instead of platform-template artwork; mobile navigation and onboarding layouts are tuned for phone safe areas and small screens.
- Persistent Android release-signing identity for future in-place APK upgrades from v0.1.0 onward.
- Remote access guidance for local/LAN, zrok, Cloudflare, Tailscale Serve/Funnel, ngrok, and custom HTTPS.
- ISO-8601 protocol timestamps accept timezone offsets emitted by Git, preventing valid `+HH:MM` commit dates from breaking snapshot validation.
- Thai/English localization, onboarding, install guides, provider documentation, and community files.
- Watcher remains strictly read-only; pairing port 17891 remains loopback-only.
