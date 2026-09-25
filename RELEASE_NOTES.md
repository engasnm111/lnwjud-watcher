<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# lnwjud Watcher v0.1.0

v0.1.0 is the first canonical full release of lnwjud Watcher. It combines the complete monitoring, pairing, multi-project observability, update, desktop/mobile distribution, and release-signing work into one supported baseline.

### Parallel projects and goals
- One Protocol v1 snapshot can carry every Active Project instead of only the selected workspace.
- Each project carries all active Durable Goals, active-operation count, and sanitized Git state.
- Goal, Agent, and Activity views keep workspace identity so parallel work does not collapse into one current task.
- The top-level `goal` and `git` fields remain the selected-project compatibility view for Protocol v1 clients.

### Runtime observability
- Agent counts represent work observable by the lnwjud Runtime.
- Active Durable Goals with zero observable runtime operations are normalized to `waiting`, and their agents/runtime to `idle`, preventing finished-or-paused work from looking actively busy while preserving completed history.
- The UI distinguishes runtime-visible work from ChatGPT reasoning between tool calls.
- Overview shows active operations, last runtime work, branch, short commit, clean/dirty state, changed-file count, latest commit subject, and latest commit time.
- ISO-8601 timestamps with timezone offsets such as `+07:00` are accepted by the Watcher protocol parser.

### Session-token pairing
- Onboarding and Settings explain the local pairing page and Session token.
- lnwjud v5.6.1 exposes `http://127.0.0.1:17891/api/v1/pair` as a local-only copy-friendly page while retaining JSON mode via `?format=json`.
- Web/PWA remembers the Session token for 60 days; packaged desktop/mobile builds keep it on-device across restarts until cleared.
- Port 17891 stays loopback-only and must never be exposed through a tunnel.

### Distribution and updates
- Windows portable EXE, macOS DMG, Linux AppImage, Android APK, Web/PWA, and iOS Simulator artifacts are produced from the shared application.
- Android/iOS native launcher and splash assets use the lnwjud Watcher brand; mobile bottom navigation is pinned above the device safe area and onboarding is compact/responsive across small phones.
- Desktop wrappers support tray/background behavior.
- Watcher checks the latest stable GitHub Release on startup, every 30 minutes, and when returning to the foreground. Canonical `v0.1.0` rebuilds are detected by comparing the release commit SHA with the build SHA embedded in the installed client. Early v0.1.0 APKs from before this mechanism need one manual install of this refreshed build first.
- Web/PWA refreshes through the service worker; native/desktop platforms open the matching trusted GitHub asset or release page.
- Android uses the persistent v0.1.0 signing identity plus a monotonically increasing internal `versionCode`, allowing refreshed v0.1.0 APKs to install over older signed builds. Android still requires normal user installation approval.
- Activity cards use explicit spacing and safe wrapping on narrow phones, render 20 items at a time, and progressively load older activity near the viewport; the Runtime snapshot remains bounded to the newest 100 events.

### Runtime requirement
The full v0.1.0 experience requires **lnwjud v5.6.1 or later**.

### Release artifacts
- `lnwjud-watcher-windows-x64.exe`
- `lnwjud-watcher-macos-arm64.dmg`
- `lnwjud-watcher-macos-x64.dmg`
- `lnwjud-watcher-linux-x64.AppImage`
- `lnwjud-watcher-web.zip`
- `lnwjud-watcher-android.apk`
- `lnwjud-watcher-ios-simulator.zip`

### Security boundary
lnwjud Watcher remains intentionally read-only. It does not add shell, filesystem mutation, MCP mutation, approval, provider credential, or hidden-reasoning access. Pairing remains local-only.

Windows/macOS community artifacts are not claimed as Authenticode-signed / Apple-notarized unless release evidence explicitly says otherwise. See [Install & run](docs/INSTALL.md) for platform limitations.
