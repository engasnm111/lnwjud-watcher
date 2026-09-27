#!/usr/bin/env bash
set -euo pipefail

arch="${1:?usage: verify-macos-package.sh arm64|x64}"
case "$arch" in
  arm64) host_arch="arm64" ;;
  x64) host_arch="x86_64" ;;
  *) echo "Unsupported architecture: $arch" >&2; exit 2 ;;
esac

if [[ "$(uname -m)" != "$host_arch" ]]; then
  echo "Package must be checked on a native $host_arch runner" >&2
  exit 1
fi

dmg="release-desktop/lnwjud-watcher-macos-${arch}.dmg"
test -s "$dmg"
mount_point="$(mktemp -d "${TMPDIR:-/tmp}/watcher-dmg.XXXXXX")"
mounted=false
launched_pid=""
cleanup() {
  if [[ -n "$launched_pid" ]]; then kill "$launched_pid" 2>/dev/null || true; fi
  if [[ "$mounted" == true ]]; then hdiutil detach "$mount_point" -quiet || true; fi
  rmdir "$mount_point" 2>/dev/null || true
}
trap cleanup EXIT

hdiutil attach "$dmg" -nobrowse -readonly -mountpoint "$mount_point" -quiet
mounted=true
app="$mount_point/lnwjud Watcher.app"
test -d "$app"
codesign --verify --deep --strict --verbose=2 "$app"
binary_name="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleExecutable' "$app/Contents/Info.plist")"
binary="$app/Contents/MacOS/$binary_name"
test -x "$binary"
actual_archs="$(lipo -archs "$binary")"
if [[ "$actual_archs" != "$host_arch" ]]; then
  echo "Expected $host_arch binary, got $actual_archs" >&2
  exit 1
fi
smoke="$(ELECTRON_RUN_AS_NODE=1 "$binary" -e 'process.stdout.write("watcher-runtime-ok")')"
if [[ "$smoke" != "watcher-runtime-ok" ]]; then
  echo "Packaged Electron runtime did not start" >&2
  exit 1
fi

open -n -a "$app"
for _ in {1..15}; do
  launched_pid="$(pgrep -f "$binary" | head -n 1 || true)"
  [[ -n "$launched_pid" ]] && break
  sleep 1
done
if [[ -z "$launched_pid" ]]; then
  echo "Packaged macOS application did not open through Launch Services" >&2
  exit 1
fi
sleep 3
if ! kill -0 "$launched_pid" 2>/dev/null; then
  echo "Packaged macOS application quit immediately after opening" >&2
  exit 1
fi
echo "Verified $arch DMG: mounted, signature valid, Electron runtime and application started"
