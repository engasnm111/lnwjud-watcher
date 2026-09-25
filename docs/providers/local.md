<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-transparent.png" width="180" alt="LNWJUD Watcher" />
</p>

# Local / LAN

> **เหมาะกับ:** Watcher อยู่เครื่องเดียวกับ LNWJUD หรือเครือข่ายที่คุณควบคุมเอง. / **Best for:** same-device use or a trusted private LAN.

## Same machine

Use:

```text
http://127.0.0.1:17890
```

Loopback HTTP is allowed because traffic never leaves the device.

## Another device on the LAN

Do not expose a plain HTTP Watcher API to an untrusted network. Prefer Tailscale Serve for private access or a TLS reverse proxy. If you intentionally bind LNWJUD to a LAN interface, protect it with authentication and a trusted network policy.

For phones outside the LAN, use zrok, Cloudflare Tunnel, Tailscale, ngrok, or your own HTTPS endpoint instead.
