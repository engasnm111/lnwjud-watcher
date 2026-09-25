<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="LNWJUD Watcher" />
</p>

# ngrok

Use ngrok if you already have an ngrok account/configuration and want to reuse it.

เหมาะกับคนที่ใช้ ngrok อยู่แล้วและมี account/authtoken พร้อม

Official download: https://ngrok.com/download

## English

### 1. Install

Windows helper:

```powershell
cd C:\path\to\lnwjud-watcher
powershell -ExecutionPolicy Bypass -File .\scripts\providers\setup-watcher-access.ps1 -Provider ngrok -Install
ngrok version
```

macOS:

```sh
brew install ngrok
```

Linux: follow ngrok's current official Linux install instructions.

### 2. Get and store the ngrok authtoken

Sign in to your ngrok dashboard and copy your current authtoken, then run:

```powershell
ngrok config add-authtoken YOUR_NGROK_AUTHTOKEN
```

This token belongs in ngrok's config on the LNWJUD computer. Do not paste it into Watcher.

### 3. Publish Watcher

```powershell
ngrok http 17890
```

Copy the HTTPS forwarding URL into Watcher and enter the separate **Watcher token** from `http://127.0.0.1:17891/api/v1/pair`.

## ภาษาไทย

1. ติดตั้ง ngrok ด้วย helper ด้านบนหรือจากเว็บทางการ
2. ล็อกอิน ngrok dashboard แล้วคัดลอก **authtoken**
3. บันทึก token ลงเครื่อง:

```powershell
ngrok config add-authtoken YOUR_NGROK_AUTHTOKEN
```

4. เปิด Watcher API:

```powershell
ngrok http 17890
```

5. เอา HTTPS URL ที่ ngrok แสดงไปใส่ Watcher และใช้ **Watcher token** จากหน้า pairing ของ LNWJUD

อย่าสับสน ngrok authtoken กับ Watcher token — เป็นคนละตัว
