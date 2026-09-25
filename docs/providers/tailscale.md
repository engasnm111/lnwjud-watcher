<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# Tailscale Serve / Funnel

Use **Serve** for private access inside your tailnet. Use **Funnel** when the Watcher endpoint must be reachable from the public internet.

ใช้ **Serve** ถ้าต้องการให้เฉพาะอุปกรณ์ใน tailnet ของคุณเข้าถึงได้ และใช้ **Funnel** ถ้าต้องการ public HTTPS จากอินเทอร์เน็ต

Official install: https://tailscale.com/download

## English

### 1. Install and sign in

Install Tailscale on the LNWJUD computer and sign in to your tailnet.

Windows helper:

```powershell
cd C:\path\to\lnwjud-watcher
powershell -ExecutionPolicy Bypass -File .\scripts\providers\setup-watcher-access.ps1 -Provider tailscale-serve -Install
```

### 2A. Private — Serve

```powershell
tailscale serve --bg http://127.0.0.1:17890
tailscale serve status
```

Use the HTTPS URL shown by `tailscale serve status`. The phone/computer opening Watcher must be authorized on the same tailnet.

### 2B. Public — Funnel

```powershell
tailscale funnel --bg http://127.0.0.1:17890
tailscale funnel status
```

Funnel requires the current account/tailnet prerequisites shown by Tailscale. Use the final HTTPS URL in Watcher.

## ภาษาไทย

1. ติดตั้ง Tailscale ที่เครื่อง LNWJUD และล็อกอิน tailnet
2. ถ้าดูเฉพาะเครื่องของตัวเอง ใช้:
   `tailscale serve --bg http://127.0.0.1:17890`
3. ถ้าต้องการ public ใช้:
   `tailscale funnel --bg http://127.0.0.1:17890`
4. รัน `tailscale serve status` หรือ `tailscale funnel status`
5. เอา HTTPS URL ไปใส่ Watcher พร้อม Watcher token

Do not expose pairing port 17891. / ห้ามนำ port 17891 ออกผ่าน Serve/Funnel
