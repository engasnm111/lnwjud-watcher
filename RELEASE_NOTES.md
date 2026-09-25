<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# lnwjud Watcher v0.2.0

v0.2.0 is the first feature update after the canonical v0.1.0 baseline. It focuses on mobile observability, Android home-screen widgets, and a normal signed APK upgrade path that can be tested directly from v0.1.0.

### Android home-screen widgets
- **Status widget:** shows whether lnwjud is working or idle, the current/last work summary, and how long ago the last observable work happened.
- **Goal widget:** shows the active project, current Durable Goal/task, milestone progress, and last-work age.
- **Agents widget:** shows the active-agent count, up to two current agent tasks, and how long ago Watcher last synchronized.
- Widget state is cached locally by the native Android app. The Watcher Session token is never written into widget storage.
- Widgets refresh immediately while the app receives snapshots and also receive the normal Android periodic widget refresh.

### Mobile UI polish
- Activity cards keep explicit horizontal and vertical spacing between status, timestamps, project chips, titles, details, and metadata.
- Long shell commands, UUIDs, paths, and task identifiers wrap safely inside narrow cards instead of pushing the page outside the viewport.
- Activity remains progressive: 20 cards render at a time with automatic near-viewport loading and a manual fallback, while the runtime snapshot remains bounded to 100 recent events.

### APK update path
- Public Android version is now **0.2.0**.
- v0.2.0 uses the same persistent Android release-signing identity as v0.1.0.
- Release CI assigns a monotonically increasing internal Android `versionCode`, so the signed v0.2.0 APK can install over the signed v0.1.0 APK.
- Watcher checks GitHub Release on startup, every 30 minutes, and when returning to the foreground. v0.1.0 → v0.2.0 is detected as a normal semantic-version upgrade.
- Android still requires the user to confirm installation. lnwjud Watcher cannot silently replace an APK.

### Existing observability
- Multi-project and multi-goal monitoring, milestone progress, active operations, agents, blockers, Git state, pairing, and recent activity remain read-only.
- Active goals with zero observable runtime operations are presented as waiting/idle instead of falsely appearing busy.
- ISO-8601 timestamps with timezone offsets remain supported.

### Runtime requirement
The full v0.2.0 experience requires **lnwjud v5.6.1 or later**.

### Release artifacts
- `lnwjud-watcher-windows-x64.exe`
- `lnwjud-watcher-macos-arm64.dmg`
- `lnwjud-watcher-macos-x64.dmg`
- `lnwjud-watcher-linux-x64.AppImage`
- `lnwjud-watcher-web.zip`
- `lnwjud-watcher-android.apk`
- `lnwjud-watcher-ios-simulator.zip`

### iOS note
The repository still publishes an iOS **Simulator** artifact rather than a normally installable physical-device build. Native iOS Home Screen widgets therefore remain outside this v0.2.0 device release; Android widgets are fully included in the APK.

### Security boundary
lnwjud Watcher remains intentionally read-only. It does not add shell, filesystem mutation, MCP mutation, approval, provider credentials, or hidden-reasoning access. Pairing remains local-only.

Windows/macOS community artifacts are not claimed as Authenticode-signed / Apple-notarized unless release evidence explicitly says otherwise. See [Install & run](docs/INSTALL.md) for platform limitations.
