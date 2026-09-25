#!/usr/bin/env sh
set -eu

provider="${1:-}"
port="${2:-17890}"
install="${INSTALL:-0}"
target="http://127.0.0.1:$port"

usage() {
  echo "Usage: $0 {zrok|cloudflare|tailscale-serve|tailscale-funnel|ngrok} [port]"
  echo "Set INSTALL=1 to allow supported package-manager installs."
}

has() { command -v "$1" >/dev/null 2>&1; }

if [ -z "$provider" ]; then usage; exit 2; fi

case "$provider" in
  zrok)
    if ! has zrok2; then
      echo "zrok2 is not installed."
      echo "Install the matching zrok2 binary from https://docs.zrok.io/docs/guides/install/ then re-run this helper."
      exit 1
    fi
    zrok2 version
    echo
    echo "If needed: zrok2 enable <YOUR_ENABLE_TOKEN>"
    echo "Start Watcher sharing:"
    echo "  zrok2 share public $target"
    ;;
  cloudflare)
    if ! has cloudflared; then
      if [ "$install" = "1" ] && has brew; then
        brew install cloudflared
      else
        echo "cloudflared is not installed."
        echo "macOS: INSTALL=1 $0 cloudflare $port (uses Homebrew)"
        echo "Linux: follow https://developers.cloudflare.com/tunnel/downloads/"
        exit 1
      fi
    fi
    cloudflared --version
    echo
    echo "Temporary test tunnel:"
    echo "  cloudflared tunnel --url $target"
    echo "Use an authenticated named tunnel for a stable production URL."
    ;;
  tailscale-serve|tailscale-funnel)
    if ! has tailscale; then
      echo "Tailscale is not installed."
      echo "Install it from https://tailscale.com/download then authenticate this machine."
      exit 1
    fi
    tailscale version
    echo
    if [ "$provider" = "tailscale-serve" ]; then
      echo "Private tailnet URL:"
      echo "  tailscale serve --bg $target"
      echo "Then: tailscale serve status"
    else
      echo "Public HTTPS URL:"
      echo "  tailscale funnel --bg $target"
      echo "Then: tailscale funnel status"
    fi
    ;;
  ngrok)
    if ! has ngrok; then
      if [ "$install" = "1" ] && has brew; then
        brew install ngrok
      else
        echo "ngrok is not installed."
        echo "macOS: INSTALL=1 $0 ngrok $port (uses Homebrew)"
        echo "Linux: follow https://ngrok.com/download/linux"
        exit 1
      fi
    fi
    ngrok version
    echo
    echo "If needed: ngrok config add-authtoken <YOUR_AUTHTOKEN>"
    echo "Start Watcher sharing:"
    echo "  ngrok http $port"
    ;;
  *)
    usage
    exit 2
    ;;
esac

echo
echo "Watcher origin: $target"
echo "Keep provider credentials on this runtime machine; never paste them into LNWJUD Watcher."
