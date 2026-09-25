# Cloudflare Tunnel

Official downloads: https://developers.cloudflare.com/tunnel/downloads/

Cloudflare Tunnel uses the `cloudflared` daemon. Use a Quick Tunnel only for temporary testing; use an authenticated named tunnel (and Cloudflare Access where appropriate) for a stable deployment.

## Windows

The helper can install the current winget package `Cloudflare.cloudflared`:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\providers\setup-watcher-access.ps1 -Provider cloudflare -Install
```

Temporary test:

```powershell
cloudflared tunnel --url http://127.0.0.1:17890
```

## macOS

```sh
brew install cloudflared
cloudflared tunnel --url http://127.0.0.1:17890
```

## Linux

Install `cloudflared` using Cloudflare's current package repository or official release package, then use the same temporary tunnel command.

## Stable production setup

1. Add/login to the Cloudflare account that owns your domain.
2. Create a named Tunnel.
3. Point the tunnel ingress to `http://127.0.0.1:17890`.
4. Attach a hostname.
5. Add Cloudflare Access if the endpoint should require identity before reaching Watcher.
6. Paste the resulting HTTPS hostname into Watcher.

Provider credentials and tunnel tokens stay on the runtime machine.
