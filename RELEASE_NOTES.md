<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="LNWJUD Watcher" />
</p>

# LNWJUD Watcher v0.3.0

v0.3.0 makes Watcher substantially more truthful about what LNWJUD can observe, adds richer Git/activity visibility, introduces a copy-friendly pairing experience through LNWJUD v5.6.1, and adds a mandatory GitHub-release update path across Watcher platforms.

### Parallel projects and goals
- One Protocol v1 snapshot can carry every Active Project instead of only the selected workspace.
- Each project carries all active Durable Goals (up to the runtime's bounded 50-goal host view), active-operation count, and sanitized Git state.
- Goal, Agent, and Activity views keep workspace identity so parallel work does not collapse into one current task.
- The existing top-level `goal` and `git` fields remain the selected-project compatibility view for older Protocol v1 clients.

### Runtime observability
- Agent counts now represent work observable by the LNWJUD Runtime. `@lnwjud` is RUNNING while LNWJUD has an in-flight tool operation even when no Durable Goal is active.
- The UI explicitly explains that ChatGPT reasoning between tool calls is outside the Runtime and therefore cannot truthfully be reported as an active agent.
- Overview now shows active operations plus a separate "last runtime work" timestamp and relative age such as minutes/hours ago.
- Git visibility now includes branch, short commit, clean/dirty state, changed-file count, latest commit subject, and latest commit time.

### Easier Session-token pairing
- Onboarding and Settings now include the local pairing link plus an explanation of where the Session token comes from.
- LNWJUD v5.6.1 changes `http://127.0.0.1:17891/api/v1/pair` from raw browser JSON into a local-only pairing page with one-click Session-token and endpoint copy.
- JSON pairing remains available for integrations and non-HTML clients, including `?format=json`.
- Web/PWA now remembers the Session token in browser-local storage for 60 days; packaged Desktop and mobile apps keep it on that device across restarts until the user clears it. Existing session-only tokens migrate automatically once.
- Port 17891 remains loopback-only and must never be exposed through a tunnel.

### Mandatory update prompt
- Watcher checks the latest stable GitHub Release on startup, every 30 minutes, and whenever the app returns to the foreground.
- When a newer version is available, Watcher shows a non-dismissible update modal before normal use continues.
- Web/PWA asks the service worker to update and refreshes the app.
- Android opens the matching release APK; Android still requires the normal operating-system installation confirmation.
- Windows and Linux open the matching release asset. macOS and iOS open the GitHub release page so the user can follow normal platform signed-install/distribution flow.
- Update URLs are accepted only from trusted GitHub/GitHubusercontent HTTPS origins.

### Android release signing
- The release workflow now builds `assembleRelease` rather than publishing an ephemeral debug APK.
- v0.3.0 starts a persistent Android release-signing identity so future APK releases can update over v0.3.0 without changing signatures.
- Users who installed the older v0.2.0 debug APK may need to uninstall it once before installing v0.3.0 because Android does not allow an APK signed by a different key to replace the installed app.

### Runtime requirement
The full v0.3.0 observability and pairing experience requires **LNWJUD v5.6.1 or later**.

### Release artifacts
- `lnwjud-watcher-windows-x64.exe`
- `lnwjud-watcher-macos-arm64.dmg`
- `lnwjud-watcher-macos-x64.dmg`
- `lnwjud-watcher-linux-x64.AppImage`
- `lnwjud-watcher-web.zip`
- `lnwjud-watcher-android.apk`
- `lnwjud-watcher-ios-simulator.zip`

### Security boundary
Watcher remains intentionally read-only. The update feature does not add shell, filesystem mutation, MCP mutation, approval, provider credential, or hidden-reasoning access. Pairing remains local-only.

Windows/macOS community artifacts are not claimed as Authenticode-signed / Apple-notarized unless the release evidence explicitly says otherwise. See [Install & run](docs/INSTALL.md) for platform limitations.
