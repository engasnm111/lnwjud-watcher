<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="LNWJUD Watcher" />
</p>

# LNWJUD Watcher v0.2.0

v0.2.0 makes Watcher substantially easier to install and run for non-technical users while keeping the same read-only security boundary.

### One-click desktop builds
- Windows ships a **single portable EXE**. Double-click to run; no Node.js/npm or installer is required.
- macOS ships separate Apple-silicon and Intel DMGs.
- Linux ships an x64 AppImage.
- Desktop builds run the same Watcher UI in a hardened Electron shell with Node integration disabled, context isolation + sandbox enabled, single-instance behavior, external links opened in the system browser, and close-to-tray background behavior.
- The system tray/menu-bar icon can show/hide Watcher and provides an explicit Quit action.

### Easier Web / mobile
- GitHub Pages hosts the production Web/PWA build for a no-install browser path.
- iPhone/iPad users can use Safari → Add to Home Screen without pretending the unsigned Simulator artifact is installable on a physical device.
- Android keeps the downloadable APK path.
- The raw Web ZIP remains available for self-hosting.

### Beginner documentation
- New bilingual installation guide covers Windows, macOS, Linux, Android, iPhone/iPad, hosted PWA, and advanced Web ZIP hosting.
- Every remote-access provider guide now contains Thai + English in the same file.
- zrok instructions include the missing folder/CD, archive extraction, PATH, account invitation/token, enable, and share steps.
- Cloudflare is presented accurately: Tunnel is available on all plans; Quick Tunnels are temporary/testing-only; stable public hostnames require the normal Cloudflare account/domain setup.
- GitHub About/topics and community-health files are populated.

### Runtime requirement
Real monitoring requires **LNWJUD v5.6.0 or later**.

### Release artifacts
- `lnwjud-watcher-windows-x64.exe`
- `lnwjud-watcher-macos-arm64.dmg`
- `lnwjud-watcher-macos-x64.dmg`
- `lnwjud-watcher-linux-x64.AppImage`
- `lnwjud-watcher-web.zip`
- `lnwjud-watcher-android-debug.apk`
- `lnwjud-watcher-ios-simulator.zip`

### Security boundary
Watcher remains intentionally read-only. The desktop wrapper does not add shell, filesystem mutation, MCP mutation, approval, provider credential, or hidden reasoning access.

Windows and macOS community artifacts are not currently claimed as Authenticode-signed / Apple-notarized. See [Install & run](docs/INSTALL.md) for safe first-launch instructions and platform limitations.
