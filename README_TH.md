<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="300" alt="LNWJUD Watcher" />
</p>

<h1 align="center">LNWJUD Watcher — คู่มือภาษาไทย</h1>

<p align="center">
  <a href="README.md"><strong>English README</strong></a>
  ·
  <a href="https://github.com/engasnm111/lnwjud"><strong>LNWJUD</strong></a>
  ·
  <a href="https://github.com/engasnm111/lnwjud-watcher/releases/latest"><strong>ดาวน์โหลดรุ่นล่าสุด</strong></a>
</p>

---

## LNWJUD Watcher คืออะไร

**LNWJUD Watcher v0.1.0** เป็นแอปดูสถานะ LNWJUD แบบ **read-only** สำหรับ Web/PWA, Android และ iOS ใช้คู่กับ **LNWJUD v5.6.0 ขึ้นไป**

เหมาะสำหรับเปิดดูว่า LNWJUD ยังทำงานอยู่ไหม กำลังทำ Goal ไหน มี Agent/worker ตัวใดทำงาน มี blocker หรือไม่ Git อยู่ branch ไหน และมี activity อะไรเกิดขึ้นล่าสุด โดยไม่ต้องเปิดหน้า Live Logs ของเครื่องหลักตลอดเวลา

Watcher ไม่มีสิทธิ์สั่ง shell, แก้ไฟล์, เรียก MCP mutation, approve/reject หรืออ่าน hidden chain-of-thought

## มีอะไรใหม่ใน v0.1.0

- **Realtime แบบยืนยันตัวตน:** โหลด snapshot ก่อน แล้วต่อ WebSocket สำหรับ live activity
- **ไม่ขึ้น Connected หลอก:** จะแสดงว่า realtime เชื่อมต่อแล้วหลัง LNWJUD ตรวจ token ผ่านและตอบ `ready` ของ Protocol v1 เท่านั้น
- **ข้อมูลหลักไม่ค้าง:** เมื่อมี live activity จะ re-sync snapshot อีกครั้งแบบ dedupe เพื่อให้ Goal, Agent และ Git เป็นค่าปัจจุบัน
- **Fallback อัตโนมัติ:** ถ้า WebSocket ใช้ไม่ได้ จะ refresh snapshot ทุก 5 วินาทีขณะเปิดแอป
- **Web/PWA + Android + iOS:** ใช้ React/TypeScript codebase เดียวกัน
- **รองรับไทย / English ในตัวแอป**
- **Read-only by design**

## เริ่มใช้งาน

### 1. เปิด LNWJUD v5.6.0 ขึ้นไป

บนเครื่องที่รัน LNWJUD เปิด:

```text
http://127.0.0.1:17891/api/v1/pair
```

จะได้รับ:

- Watcher endpoint
- Watcher access token
- protocol version

> **ห้ามเปิด port 17891 ออกอินเทอร์เน็ต** เพราะเป็น pairing endpoint ที่ออกแบบให้ใช้เฉพาะในเครื่อง

### 2. เลือกวิธีเชื่อมต่อ

| สถานการณ์ | แนะนำ |
| --- | --- |
| Watcher อยู่เครื่องเดียวกับ LNWJUD | **Local** |
| ต้องการ private ระหว่างอุปกรณ์ | **Tailscale Serve** |
| ต้องการ public HTTPS แบบเริ่มง่าย | **zrok** |
| มี Cloudflare/domain อยู่แล้ว | **Cloudflare Tunnel** |
| ใช้ ngrok อยู่แล้ว | **ngrok** |
| มี VPS/reverse proxy ของตัวเอง | **Custom HTTPS** |

ถ้าต้องดูจากเครื่องอื่น ให้ expose เฉพาะ Watcher API port **17890** ไม่ต้อง expose MCP gateway

คู่มือ:

- [Local / LAN](docs/providers/local.md)
- [zrok](docs/providers/zrok.md)
- [Cloudflare Tunnel](docs/providers/cloudflare.md)
- [Tailscale Serve / Funnel](docs/providers/tailscale.md)
- [ngrok](docs/providers/ngrok.md)
- [Custom HTTPS](docs/providers/custom-https.md)
- [รวมทุก Provider](docs/providers/README.md)

### 3. เปิด Watcher

ครั้งแรกให้เลือกภาษา เลือก provider แล้วกรอก endpoint + Watcher token จากนั้นเข้า Overview ได้เลย

## Realtime ทำงานอย่างไร

```text
Initial snapshot
      ↓
WebSocket auth
      ↓
LNWJUD ตอบ ready
      ↓
live activity
      ↓
authoritative snapshot re-sync
```

ถ้า realtime หลุด Watcher จะ reconnect ให้อัตโนมัติ และระหว่างนั้นใช้ fallback refresh ทุก 5 วินาที

## ดูอะไรได้บ้าง

- runtime online/offline
- Durable Goal ปัจจุบันและ milestone progress
- current task และ blockers
- Agent/worker ที่มี observable evidence
- Git branch / commit / clean-dirty
- recent structured activity
- สถานะ live / reconnecting / fallback

## Security

หลักสำคัญ:

- LNWJUD runtime เป็น source of truth
- Watcher ไม่อ่าน database ของ LNWJUD โดยตรง
- Watcher เป็น read-only
- pairing port 17891 เป็น loopback-only
- remote access ต้องใช้ HTTPS/WSS
- Watcher token แยกจาก MCP/tunnel credentials
- client เก็บ token เฉพาะ session
- Watcher Protocol v1 ไม่มี command-execution surface

อ่านเพิ่ม: [Protocol v1](docs/PROTOCOL.md) และ [Architecture](docs/ARCHITECTURE.md)

## ดาวน์โหลด

ใช้หน้า [Latest LNWJUD Watcher Release](https://github.com/engasnm111/lnwjud-watcher/releases/latest)

Web/PWA และ Android ใช้ artifact จาก release workflow ได้ตามแพลตฟอร์ม ส่วนการติดตั้งบน iPhone จริง/App Store ต้องใช้ Apple signing credentials

## แก้ปัญหาเบื้องต้น

**ขึ้น 401 / Unauthorized**

กลับไป pair ใหม่บนเครื่อง LNWJUD แล้วใช้ token ล่าสุด

**Snapshot มา แต่ realtime ไม่มา**

Tunnel/reverse proxy ต้องรองรับ WebSocket upgrade ที่ `/api/v1/events`

**มือถือเปิด 127.0.0.1 ไม่ได้**

บนมือถือ `127.0.0.1` หมายถึงมือถือเอง ให้ใช้ Tailscale หรือ HTTPS provider อื่น

**เปิด port 17891 ออกอินเทอร์เน็ตได้ไหม**

ไม่ควร เปิดเฉพาะ 17890 เมื่อจำเป็นต้องใช้งานจากระยะไกล

## สำหรับนักพัฒนา

Requires Node.js 22–24.

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx cap sync
```

เอกสารภายใน:

- [Architecture](docs/ARCHITECTURE.md)
- [Protocol v1](docs/PROTOCOL.md)
- [Product truth](PRODUCT.md)
- [Design system](DESIGN.md)
- [v0.1.0 release checklist](docs/V0.1.0-RELEASE-PLAN.md)

## License

MIT
