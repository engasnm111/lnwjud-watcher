# Remote access setup

LNWJUD Watcher never opens tunnels itself and never stores provider credentials. Run the provider on the **same machine as the LNWJUD Watcher API**, then paste only the resulting HTTPS Watcher URL into the Web/Android/iOS client.

Default local Watcher API origin used in examples:

```text
http://127.0.0.1:17890
```

Choose one:

- [Local / LAN](local.md)
- [zrok](zrok.md)
- [Cloudflare Tunnel](cloudflare.md)
- [Tailscale Serve / Funnel](tailscale.md)
- [ngrok](ngrok.md)
- [Custom HTTPS reverse proxy](custom-https.md)

Helper scripts:

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File scripts\providers\setup-watcher-access.ps1 -Provider zrok -Install
```

```sh
# macOS / Linux
chmod +x scripts/providers/setup-watcher-access.sh
./scripts/providers/setup-watcher-access.sh zrok
```

The helpers deliberately do **not** accept provider auth tokens as arguments. Authentication remains in the provider's own CLI/account flow.
