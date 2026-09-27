<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# lnwjud Watcher v0.2.6

v0.2.6 replaces the Android notification checkbox with a gold switch matching LNWJUD's toggle style. The permission request and saved notification setting continue to work the same way.

### Included monitoring features

- A completed checklist no longer implies a Goal is finished. With LNWJUD v5.6.6, Watcher shows acceptance criteria, active tasks, and the runtime's `completionReady` decision. The Goal stays open until `finish_goal` succeeds.
- Alerts Center, Project Details, Connection Health, and Activity filters add direct paths to stalled work and connection diagnostics.
- Android users can opt in to an inactivity notification after 5 or 10 minutes without observed Goal work. The native monitor checks a fresh authenticated snapshot before posting, suppresses repeats for one inactivity episode, and removes notifications when a Goal closes or becomes ready. Android may delay background checks.
- The Agents screen lists user-configured MCP server names and connection state received from LNWJUD v5.6.6. Names from external hosts remain unavailable when the host does not expose them.
- Native apps offer an update only when its release version is newer than the installed version. Web/PWA continues to update through its service worker.
- Watcher continues to remember the endpoint and Session token on this device for up to one year and guides users to Settings after authentication or network errors.

### Desktop packages

- macOS community DMGs use an ad-hoc signature with the Electron entitlements needed to launch. CI checks packaged startup on native Apple silicon and Intel runners.
- Windows and Linux CI check packaged startup. Linux includes a tar.gz package for systems where AppImage/FUSE cannot run.
- All release downloads include a `SHA256SUMS.txt` manifest.

macOS builds remain **without Apple Developer ID and notarization**. macOS may require first-launch approval in **System Settings → Privacy & Security → Open Anyway**. If it reports a damaged app, compare the DMG with the published SHA-256. For a matching checksum when **Open Anyway** is unavailable, the [install guide](docs/INSTALL.md) gives a per-app quarantine fallback. See also [Apple's first-launch guidance](https://support.apple.com/en-gb/102445).

### Compatibility and artifacts

The full experience requires **LNWJUD v5.6.6 or later** and Watcher Protocol v1. Basic monitoring remains compatible with LNWJUD v5.6.1+.

- `lnwjud-watcher-windows-x64.exe`
- `lnwjud-watcher-macos-arm64.dmg`
- `lnwjud-watcher-macos-x64.dmg`
- `lnwjud-watcher-linux-x64.AppImage`
- `lnwjud-watcher-linux-x64.tar.gz`
- `lnwjud-watcher-web.zip`
- `lnwjud-watcher-android.apk`
- `lnwjud-watcher-ios-simulator.zip`
- `SHA256SUMS.txt`

The iOS archive is for Simulator only; physical iPhone and iPad users should use the hosted Web/PWA.

Watcher remains a read-only client. It does not expose shell execution, file mutation, approvals, pause/resume controls, or hidden model reasoning.
