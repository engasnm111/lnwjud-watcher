<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-dark.png" width="180" alt="LNWJUD Watcher" />
</p>

# Remote access setup

## เลือกแบบเร็ว / Quick chooser

| ต้องการ | ตัวเลือกที่เหมาะ |
| --- | --- |
| เครื่องเดียวกัน | **Local** |
| Private ระหว่างอุปกรณ์ | **Tailscale Serve** |
| Public HTTPS เริ่มง่าย | **zrok** |
| มี Cloudflare/domain | **Cloudflare Tunnel** |
| ใช้ ngrok อยู่แล้ว | **ngrok** |
| มี reverse proxy เอง | **Custom HTTPS** |

ทุกแบบ expose เฉพาะ Watcher API port **17890**; ห้าม expose pairing port **17891**.

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
