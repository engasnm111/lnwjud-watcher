<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# Remote access providers / คู่มือเชื่อมต่อจากนอกบ้าน

lnwjud Watcher reads the **Watcher API on port 17890**. The local pairing page is on **17891** and must stay loopback-only.

lnwjud Watcher ใช้ **Watcher API port 17890** สำหรับดูสถานะ ส่วนหน้า pairing ใช้ **17891** และต้องเปิดจากเครื่อง LNWJUD เท่านั้น ห้ามเอา 17891 ออกอินเทอร์เน็ต

## Quick chooser / เลือกแบบเร็ว

| Need / ต้องการ | Recommended / แนะนำ | Cost note / เรื่องค่าใช้จ่าย |
| --- | --- | --- |
| Same PC / เครื่องเดียวกัน | **Local** | Free / ฟรี |
| Public HTTPS from outside home, already own a Cloudflare-managed domain / ดูจากนอกบ้านและมีโดเมนบน Cloudflare | **Cloudflare Tunnel — recommended** | Tunnel is available on all Cloudflare plans; your domain itself may have a cost |
| Public HTTPS with no domain / อยากใช้ฟรีและไม่มีโดเมน | **zrok** | Hosted free plan available; limits apply |
| Private access between your devices / ใช้เฉพาะอุปกรณ์ของตัวเอง | **Tailscale Serve** | Free plan may be enough for personal use; check current Tailscale limits |
| Public HTTPS through Tailscale / ต้องการ public ผ่าน Tailscale | **Tailscale Funnel** | Requires Funnel eligibility/settings |
| Already use ngrok / มี ngrok อยู่แล้ว | **ngrok** | Free/paid limits depend on current ngrok plan |
| Own VPS/reverse proxy / มี VPS หรือ reverse proxy | **Custom HTTPS** | Depends on your infrastructure |

> **Cloudflare note:** Cloudflare Tunnel itself is available on all plans. A free **Quick Tunnel** can create a temporary public `trycloudflare.com` URL with no account, but Cloudflare documents Quick Tunnels as testing/development only. For a stable public hostname, use a named tunnel with a Cloudflare account and a domain on Cloudflare.

## Before any provider / ก่อนเริ่มทุกแบบ

1. Install and run **LNWJUD v5.6.1+**.
2. On the LNWJUD computer, open:
   `http://127.0.0.1:17891/api/v1/pair`
3. Copy the **Watcher access token** somewhere private.
4. Confirm the local API responds through:
   `http://127.0.0.1:17890`
5. Choose **one** provider below.
6. Put the provider's final **HTTPS URL** into Watcher together with the Watcher token.

> Provider login tokens (Cloudflare tunnel token, zrok account token, ngrok authtoken, etc.) stay on the LNWJUD computer. Never paste those provider credentials into Watcher.

## Guides / คู่มือ

- [Cloudflare Tunnel — recommended public option](cloudflare.md)
- [zrok — simple public option without your own domain](zrok.md)
- [Tailscale Serve / Funnel](tailscale.md)
- [ngrok](ngrok.md)
- [Local / LAN](local.md)
- [Custom HTTPS reverse proxy](custom-https.md)

## Helper scripts / สคริปต์ช่วยติดตั้ง

The helper path is relative to the **repository root**. If PowerShell says it cannot find the script, you are probably in the wrong folder.

สคริปต์อยู่ใต้โฟลเดอร์ repo ดังนั้นต้อง `cd` เข้าโฟลเดอร์ `lnwjud-watcher` ก่อน ไม่อย่างนั้น PowerShell จะหาไฟล์ไม่เจอ

### Windows

```powershell
cd C:\path\to\lnwjud-watcher
powershell -ExecutionPolicy Bypass -File .\scripts\providers\setup-watcher-access.ps1 -Provider cloudflare -Install
```

Replace `cloudflare` with `zrok`, `tailscale-serve`, `tailscale-funnel`, or `ngrok`.

### macOS / Linux

```sh
cd /path/to/lnwjud-watcher
chmod +x scripts/providers/setup-watcher-access.sh
./scripts/providers/setup-watcher-access.sh cloudflare
```

The helper never accepts provider auth tokens as command-line arguments.
