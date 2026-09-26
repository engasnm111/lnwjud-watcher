<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# lnwjud Watcher v0.2.1

v0.2.1 is a corrective mobile release for the v0.2.x line. It keeps the Android widgets introduced in v0.2.0, fixes the remaining narrow-screen Activity spacing issue, and ships the in-app Android updater polish already prepared on `dev`.

### Mobile Activity spacing
- The status pill and timestamp now keep an explicit **10 px content buffer** in addition to the flex column gap, preventing the two labels from visually touching on narrow Android displays such as iQOO-class devices.
- Timestamp text is kept on one line while long commands, UUIDs, paths, and task identifiers continue to wrap safely inside their cards.
- Activity remains progressive: 20 cards render at a time over the runtime's bounded 100-event recent history.

### Android widgets
- **Status widget:** runtime state, current/last work, active counts, last-work age, and last-sync age.
- **Goal widget:** active project, Durable Goal/task, milestone progress, and last-work age.
- **Agents widget:** active-agent count, current agent tasks, and last-sync age.
- Widget state is cached locally without storing the Watcher Session token.
- Widget layouts were polished for launcher previews and multiple Android widget sizes.

### Android update flow
- Android can download the release APK **inside lnwjud Watcher** and opens the system installer only when the APK is ready.
- The download path accepts only trusted HTTPS GitHub/GitHubusercontent URLs.
- Android still requires the normal system install confirmation; Watcher does not silently replace an APK.
- v0.2.1 keeps the same persistent release-signing identity and uses a higher CI-generated `versionCode`, so it can install over signed v0.2.0/v0.1.0 builds.

### Documentation
- README and README_TH now include visual previews of the mobile Activity UI and the three Android home-screen widgets so new users can understand the product before installing it.

### Runtime requirement
The full v0.2.1 experience requires **LNWJUD v5.6.1 or later**.

### Release artifacts
- `lnwjud-watcher-windows-x64.exe`
- `lnwjud-watcher-macos-arm64.dmg`
- `lnwjud-watcher-macos-x64.dmg`
- `lnwjud-watcher-linux-x64.AppImage`
- `lnwjud-watcher-web.zip`
- `lnwjud-watcher-android.apk`
- `lnwjud-watcher-ios-simulator.zip`

### iOS note
The repository still publishes an iOS **Simulator** artifact rather than a normally installable physical-device build. Native iOS Home Screen widgets therefore remain outside this device release; Android widgets are included in the APK.

### Security boundary
lnwjud Watcher remains intentionally read-only. It does not add shell, filesystem mutation, MCP mutation, approval, provider credentials, or hidden-reasoning access. Pairing remains local-only.

Windows/macOS community artifacts are not claimed as Authenticode-signed / Apple-notarized unless release evidence explicitly says otherwise. See [Install & run](docs/INSTALL.md) for platform limitations.
