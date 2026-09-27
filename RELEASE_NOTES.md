<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# lnwjud Watcher v0.2.4

v0.2.4 corrects the Web/PWA update experience, clarifies active goals whose milestones are complete, and adds native package startup checks.

### What changed

- Web/PWA updates through its service worker. The website no longer blocks use with a GitHub Release download prompt.
- Goals with all milestones complete but still reported active by LNWJUD show **Ready to finish** instead of a generic waiting label. Overview counts these goals separately. Watcher does not claim that the runtime has closed them.
- The connection endpoint and Watcher Session token remain on this device for up to one year. Older valid tokens migrate to this expiry. Authentication, endpoint, and network errors show a Settings link with specific guidance.
- Agent names continue to come from LNWJUD. The current Watcher Protocol v1 reports delegated work as Codex and does not provide user-configured plugin names.

### Desktop packages

- macOS community DMGs use an ad-hoc signature with the Electron entitlements needed to launch. CI mounts and verifies each DMG, checks its signature, and starts the packaged runtime on native Apple silicon and Intel runners.
- Windows and Linux CI smoke test their packaged Electron runtimes. Linux adds a tar.gz package for systems where AppImage/FUSE cannot run.
- All release downloads include a `SHA256SUMS.txt` manifest.

macOS builds remain **without Apple Developer ID and notarization**. macOS may require first-launch approval in **System Settings → Privacy & Security → Open Anyway**. If it reports a damaged app, compare the DMG with the published SHA-256 and report a matching-checksum failure with the Mac model and macOS version. See the [install guide](docs/INSTALL.md) and [Apple's first-launch guidance](https://support.apple.com/en-gb/102445).

### Compatibility and artifacts

The full experience requires **LNWJUD v5.6.1 or later** and Watcher Protocol v1.

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
