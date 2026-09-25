<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# Cloudflare Tunnel — recommended public option / แนะนำสำหรับดูจากนอกบ้าน

Cloudflare Tunnel is the recommended **public** option when you already own a domain that is managed by Cloudflare. It creates an outbound-only tunnel, so you do not need port forwarding or a public home IP.

Cloudflare Tunnel เหมาะที่สุดถ้าต้องการเปิดดู Watcher จากนอกบ้านแบบ public และคุณมีโดเมนที่อยู่บน Cloudflare อยู่แล้ว เพราะเครื่อง LNWJUD เป็นฝ่ายเชื่อมออกไปหา Cloudflare เอง ไม่ต้อง forward port ที่ router

## Is it free? / ฟรีไหม?

- Cloudflare documents **Tunnel as available on all plans**, including Free.
- A **Quick Tunnel** can create a free temporary `*.trycloudflare.com` URL without an account.
- Cloudflare says Quick Tunnels are for **testing/development only**, not production; they have limitations and no SLA.
- A stable public hostname requires a Cloudflare account **and a domain on Cloudflare**. The tunnel feature can be on the Free plan, but the domain itself is not automatically free.

สรุป: **ตัว Tunnel ใช้กับ Free plan ได้** แต่ถ้าจะใช้ URL คงที่ระยะยาวต้องมีโดเมนบน Cloudflare ด้วย ส่วน Quick Tunnel ฟรีและไม่ต้องมีโดเมน แต่เหมาะกับทดลองชั่วคราว

Official docs:
- https://developers.cloudflare.com/tunnel/
- https://developers.cloudflare.com/tunnel/get-started/
- https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/

## English setup

### 1. Confirm lnwjud Watcher API

On the LNWJUD computer:

```text
Pairing page: http://127.0.0.1:17891/api/v1/pair
Watcher API:   http://127.0.0.1:17890
```

Keep port 17891 private.

### 2. Install cloudflared

**Windows — easiest helper**

```powershell
cd C:\path\to\lnwjud-watcher
powershell -ExecutionPolicy Bypass -File .\scripts\providers\setup-watcher-access.ps1 -Provider cloudflare -Install
cloudflared --version
```

If the script path errors, first run `pwd` and confirm the folder contains `scripts\providers\setup-watcher-access.ps1`.

**macOS**

```sh
brew install cloudflared
cloudflared --version
```

**Linux**

Install the current package from Cloudflare's official download instructions, then run `cloudflared --version`.

### 3A. Quick Tunnel — fastest free test

```powershell
cloudflared tunnel --url http://127.0.0.1:17890
```

Cloudflare prints a temporary URL such as `https://random-name.trycloudflare.com`. Paste that **HTTPS URL** into Watcher. Keep this terminal open while you use it.

### 3B. Named Tunnel — stable public URL

1. Sign in to Cloudflare.
2. Make sure your domain is using Cloudflare DNS.
3. Open **Networking → Tunnels** in the Cloudflare dashboard.
4. Choose **Create Tunnel** and give it a name such as `lnwjud-watcher`.
5. Select your OS and copy the install/run command Cloudflare shows. That command includes a tunnel token; run it only on the LNWJUD machine.
6. Add a **Published application / Public hostname** such as `watcher.example.com`.
7. Set the service/origin to:
   `http://127.0.0.1:17890`
8. Save, then open `https://watcher.example.com`.
9. Put that HTTPS origin into Watcher together with the **Watcher access token** from the local pairing page.

Optional: add Cloudflare Access in front of the endpoint for another identity gate. Watcher's own bearer token is still required by the Watcher API.

## ขั้นตอนภาษาไทย

### 1. เช็ก LNWJUD ก่อน

บนเครื่องที่รัน LNWJUD เปิด:
- Pairing: `http://127.0.0.1:17891/api/v1/pair`
- API: `http://127.0.0.1:17890`

คัดลอก Watcher token เก็บไว้ และ **ห้ามเปิด 17891 ออกเน็ต**

### 2. ติดตั้ง cloudflared

**Windows แบบง่าย**

```powershell
cd C:\path\to\lnwjud-watcher
powershell -ExecutionPolicy Bypass -File .\scripts\providers\setup-watcher-access.ps1 -Provider cloudflare -Install
cloudflared --version
```

ถ้าขึ้นว่า script หาไม่เจอ แปลว่ายังไม่ได้ `cd` เข้าโฟลเดอร์ `lnwjud-watcher`

### 3. เลือกแบบใช้งาน

**ทดลองเร็ว/ฟรีชั่วคราว**

```powershell
cloudflared tunnel --url http://127.0.0.1:17890
```

เอา URL `https://...trycloudflare.com` ที่ได้ไปใส่ Watcher และเปิดหน้าต่าง command นี้ค้างไว้

**ใช้งานจริง URL คงที่**

เข้า Cloudflare Dashboard → Networking → Tunnels → Create Tunnel → ติดตั้งตามคำสั่งที่ Cloudflare ให้ → เพิ่ม Public hostname เช่น `watcher.yourdomain.com` → Service ใส่ `http://127.0.0.1:17890`

จากนั้นเอา `https://watcher.yourdomain.com` ไปใส่ Watcher พร้อม Watcher token

## Troubleshooting / แก้ปัญหา

- **502 / origin unreachable:** LNWJUD may not be running or port 17890 changed.
- **Snapshot works but realtime fails:** make sure WebSocket upgrades are not blocked.
- **Quick Tunnel URL changed:** expected; Quick Tunnel is temporary.
- **Named tunnel asks for a token:** use only the token shown by Cloudflare on the LNWJUD machine; do not paste it into Watcher.
