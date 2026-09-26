<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# lnwjud Watcher v0.2.3

v0.2.3 consolidates repeated status/timestamp UI into one shared component so Live Activity and timeline cards render the same spacing, typography, and color across Desktop, Web/PWA, Android, and iOS.

### Shared activity metadata UI
- Added shared `StatusMeta` for the repeated status + timestamp pattern.
- Overview Live Activity, Overview Activity Timeline, and the Activity page now use the same component and CSS path.
- This removes the previous screen-specific markup/style drift that could make timestamp spacing and font treatment differ on narrow Android WebViews.

### Android widgets
- **Status widget:** runtime state, current/last work, active counts, last-work age, and last-sync age.
- **Goal widget:** active project, Durable Goal/task, milestone progress, and last-work age.
- **Agents widget:** active-agent count, current agent tasks, and last-sync age.
- Widget state is cached locally without storing the Watcher Session token.

### Android update flow
- Android downloads the trusted GitHub release APK **inside lnwjud Watcher** and opens the system installer only after the APK is ready.
- The download path accepts only trusted HTTPS GitHub/GitHubusercontent URLs.
- Android still requires the normal system install confirmation; Watcher does not silently replace an APK.

### Runtime requirement
The full v0.2.3 experience requires **LNWJUD v5.6.1 or later**.

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
Watcher remains read-only. It does not expose shell execution, file mutation, approvals, pause/resume controls, or hidden model reasoning.
