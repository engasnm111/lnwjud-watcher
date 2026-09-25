<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-transparent.png" width="180" alt="LNWJUD Watcher" />
</p>

# Tailscale Serve / Funnel

> **เหมาะกับ:** ต้องการ private access ผ่าน tailnet (Serve) หรือ public HTTPS (Funnel). / **Best for:** controlled device-to-device access.

Official install guide: https://tailscale.com/docs/install

Use **Serve** when Watcher should be reachable only inside your tailnet. Use **Funnel** when the endpoint must be reachable from the public internet.

## Install and sign in

Install Tailscale for the runtime OS, then authenticate the runtime machine to your tailnet.

On mainstream Linux distributions the official docs offer the Tailscale install script; users who prefer not to pipe a remote script to a shell can use the distribution-specific package instructions instead.

## Private: Tailscale Serve

```sh
tailscale serve --bg http://127.0.0.1:17890
tailscale serve status
```

Serve respects tailnet access controls. HTTPS must be enabled for the tailnet; the CLI guides you through missing requirements.

## Public: Tailscale Funnel

```sh
tailscale funnel --bg http://127.0.0.1:17890
tailscale funnel status
```

Funnel requires the account/tailnet prerequisites documented by Tailscale and exposes the service publicly over HTTPS.

## Windows helper

```powershell
powershell -ExecutionPolicy Bypass -File scripts\providers\setup-watcher-access.ps1 -Provider tailscale-serve -Install
# or
powershell -ExecutionPolicy Bypass -File scripts\providers\setup-watcher-access.ps1 -Provider tailscale-funnel -Install
```

The helper uses the current `Tailscale.Tailscale` winget package when installation is requested.
