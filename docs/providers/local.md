<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# Local / LAN

## English

### Same computer

Use:

```text
http://127.0.0.1:17890
```

Pair locally at:

```text
http://127.0.0.1:17891/api/v1/pair
```

### Another device on the LAN

A phone cannot use `127.0.0.1` to reach your PC; on the phone, `127.0.0.1` means the phone itself.

For another device, prefer **Tailscale Serve** or another HTTPS provider. Do not publish a plain HTTP Watcher API to an untrusted LAN, public Wi-Fi, or the internet.

## ภาษาไทย

### เครื่องเดียวกัน

ใส่ endpoint:

```text
http://127.0.0.1:17890
```

แล้วเอา token จาก:

```text
http://127.0.0.1:17891/api/v1/pair
```

### มือถือหรือคอมอีกเครื่องใน LAN

บนมือถือ `127.0.0.1` หมายถึงมือถือเอง ไม่ใช่เครื่อง LNWJUD

ถ้าจะดูจากเครื่องอื่น แนะนำ **Tailscale Serve** หรือ provider แบบ HTTPS แทน และไม่ควรเปิด plain HTTP ออก network ที่ไม่ไว้ใจ
