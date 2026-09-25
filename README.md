<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-dark.png" width="300" alt="LNWJUD Watcher" />
</p>

<h1 align="center">LNWJUD Watcher</h1>

<p align="center">
  <strong>ดูงาน LNWJUD แบบสดจาก Web, Android และ iOS — โดย Watcher ไม่มีสิทธิ์สั่งงานเครื่อง</strong><br />
  <em>See LNWJUD goals, agents, blockers and observable activity live from Web, Android and iOS — read-only by design.</em>
</p>

<p align="center">
  <a href="https://github.com/engasnm111/lnwjud-watcher/releases/latest"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/engasnm111/lnwjud-watcher" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img alt="Targets" src="https://img.shields.io/badge/Web%20%7C%20Android%20%7C%20iOS-Watcher-d5a63a" />
  <img alt="Protocol" src="https://img.shields.io/badge/Watcher%20Protocol-v1-d5a63a" />
  <img alt="Languages" src="https://img.shields.io/badge/ภาษา-ไทย%20%7C%20English-d5a63a" />
</p>

---

## ใช้งานง่ายแบบคนทั่วไป / Built for normal users

LNWJUD Watcher เป็นแอปคู่กับ [lnwjud](https://github.com/engasnm111/lnwjud) ตั้งใจให้เปิดแล้วรู้ทันทีว่า LNWJUD ยังทำงานอยู่ไหม กำลังทำอะไร มี Agent ตัวไหนทำงาน มี blocker หรือไม่ และมีอะไรเกิดขึ้นล่าสุด โดยไม่ต้องนั่งดู Live Logs หรือเปิดคอมเครื่องนั้นตลอดเวลา

**Watcher v0.1.0 เป็น read-only 100%** — ไม่มี shell, file write/delete, MCP command, approve/reject, pause/resume หรือ hidden chain-of-thought.

English: Watcher is a read-only companion for LNWJUD. Open it and immediately see runtime health, the current Durable Goal, milestone progress, active agents, blockers, recent observable work, Git baseline, and whether the view is live or using fallback refresh.

## รองรับ 3 ทาง / Three targets

| Target | ใช้แบบไหน | v0.1.0 |
| --- | --- | --- |
| **Web / PWA** | เปิดจาก browser หรือ Add to Home Screen | Production web bundle |
| **Android** | ติดตั้ง APK สำหรับทดสอบ/ใช้งานตรง | Android debug APK |
| **iOS** | ใช้ source/native shell และ Simulator artifact | iOS Simulator artifact; App Store/device signing requires Apple credentials |

> iOS จริงบน iPhone ต้องใช้ Apple signing / Developer account ตามข้อกำหนดของ Apple. v0.1.0 ไม่อ้างว่าเป็น App Store release หากยังไม่มี signing credentials.

## Quick start — 5 นาที

### 1. ใช้ lnwjud v5.6.0 ขึ้นไป

LNWJUD Desktop v5.6.0 เพิ่ม Watcher API แบบอ่านอย่างเดียวและเริ่มให้อัตโนมัติเมื่อเปิด Desktop.

บนเครื่องที่รัน LNWJUD เปิด:

```text
http://127.0.0.1:17891/api/v1/pair
```

จะได้:

- local Watcher endpoint
- Watcher access token
- protocol version

**อย่าเปิด port 17891 ออกอินเทอร์เน็ต** — pairing endpoint ตั้งใจให้ใช้เฉพาะในเครื่อง LNWJUD.

### 2. เลือกวิธีเข้าถึงเครื่อง LNWJUD

ถ้า Watcher อยู่เครื่องเดียวกัน ใช้ Local ได้เลย.

ถ้าจะดูจาก Android/iPhone/เครื่องอื่น เลือกหนึ่งวิธี:

- **zrok** — ทาง public HTTPS ที่ตั้งค่าง่ายสำหรับหลายคน
- **Cloudflare Tunnel**
- **Tailscale Serve** — private ภายใน tailnet
- **Tailscale Funnel** — public HTTPS
- **ngrok**
- **Custom HTTPS reverse proxy**

เปิดเฉพาะ **Watcher API port 17890** ผ่าน provider ที่เลือก ไม่ต้องเปิด MCP gateway.

### 3. เปิด Watcher

ครั้งแรก Watcher จะถาม:

1. ไทย / English
2. วิธีเชื่อมต่อ
3. Provider
4. Endpoint + Watcher token

จากนั้นเข้า Overview ได้เลย.

## Realtime จริง ไม่ต้องกด Refresh เอง

Watcher ใช้ลำดับนี้:

```text
Initial snapshot
      ↓
Authenticated WebSocket
      ↓
live observable events
      ↓
reconnect → authoritative snapshot resync
```

ถ้า WebSocket หลุด Watcher จะเปลี่ยนเป็น **snapshot refresh ทุก 5 วินาทีขณะหน้าจอเปิดอยู่** และกลับไป realtime ให้อัตโนมัติเมื่อ WebSocket กลับมา. ปุ่ม Refresh ยังคงมีไว้ให้กดเองได้.

## ตั้งค่า Remote Access

คู่มือทีละขั้นอยู่ที่:

- [Local / LAN](docs/providers/local.md)
- [zrok](docs/providers/zrok.md)
- [Cloudflare Tunnel](docs/providers/cloudflare.md)
- [Tailscale Serve / Funnel](docs/providers/tailscale.md)
- [ngrok](docs/providers/ngrok.md)
- [Custom HTTPS](docs/providers/custom-https.md)

รวมทั้งหมด: [Provider setup](docs/providers/README.md)

### Windows helper

จาก repo Watcher:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\providers\setup-watcher-access.ps1 -Provider zrok -Install
```

เปลี่ยน `zrok` เป็น `cloudflare`, `tailscale-serve`, `tailscale-funnel` หรือ `ngrok` ได้.

ตัว helper จะตรวจของเดิมก่อน และติดตั้งเฉพาะเมื่อระบุ `-Install`.

### macOS / Linux helper

```sh
chmod +x scripts/providers/setup-watcher-access.sh
./scripts/providers/setup-watcher-access.sh zrok
```

สำหรับ provider ที่ระบบติดตั้งอัตโนมัติไม่ได้ script จะพาไป official install path แทนการเดาหรือดาวน์โหลด binary ผิด architecture.

> Provider account token / authtoken / enable token ให้ใส่ใน CLI ของ provider บนเครื่อง LNWJUD เท่านั้น **อย่าใส่ลง Watcher**.

## สิ่งที่ดูได้

### Overview

- runtime online / offline
- live / reconnecting / 5s fallback
- current Durable Goal
- milestone progress จากข้อมูลจริง
- current task
- blockers
- active agents
- Git clean/dirty, branch, commit
- recent observable activity

### Goals

ดู goal ปัจจุบัน, milestones, task และ blockers แบบอ่านอย่างเดียว.

### Agents

ดู `@lnwjud` และ agent/worker ที่ LNWJUD มี evidence ว่ากำลังทำงานจริง.

### Activity

ไทม์ไลน์ structured events เช่น running, analyzing, verifying, waiting, blocked, done. Watcher **ไม่อ่านหรือแสดง hidden reasoning**.

### Settings

- ไทย / English
- endpoint
- access provider
- session token
- provider setup guide
- connection reset / onboarding

## Security model

```text
LNWJUD runtime
   ↓ sanitized Watcher Protocol v1
HTTPS snapshot + authenticated WSS
   ↓
LNWJUD Watcher
Web / Android / iOS
```

หลักสำคัญ:

- Runtime เป็น source of truth.
- Watcher ไม่อ่านฐานข้อมูล LNWJUD โดยตรง.
- Remote HTTP ที่ไม่ใช่ loopback ถูกปฏิเสธ; ใช้ HTTPS/WSS.
- Watcher token เก็บเฉพาะ session ฝั่ง client.
- LNWJUD v5.6.0 เก็บ dedicated Watcher token ผ่าน protected secret storage ใน production.
- Pairing ใช้ listener คนละ port และ loopback-only.
- ไม่มี command execution surface ใน Watcher Protocol v1.

Protocol details: [docs/PROTOCOL.md](docs/PROTOCOL.md)

## Download / Install

เมื่อ v0.1.0 ถูก publish แล้ว ให้ใช้หน้า:

**[Latest LNWJUD Watcher Release](https://github.com/engasnm111/lnwjud-watcher/releases/latest)**

Release มี:

- `lnwjud-watcher-web.zip`
- `lnwjud-watcher-android-debug.apk`
- `lnwjud-watcher-ios-simulator.zip`

### Web/PWA

แตก `lnwjud-watcher-web.zip` แล้ว serve เป็น static HTTPS website ได้เลย. Build ใช้ relative assets และ HashRouter จึงวางใต้ sub-path ได้โดยไม่ต้อง rewrite route ฝั่ง server.

เปิดด้วย browser แล้วใช้ **Install app / Add to Home Screen** เพื่อใช้แบบ PWA.

### Android

ติดตั้ง APK จาก GitHub Release. Android อาจถามอนุญาตติดตั้งจากแหล่งภายนอกเมื่อ sideload.

### iOS

v0.1.0 มี Simulator artifact เพื่อพิสูจน์ native build. สำหรับติดตั้งบน iPhone จริงต้อง build/sign ด้วย Xcode และ Apple Developer identity.

## Troubleshooting

**ขึ้น Unauthorized / 401**

กลับไปที่เครื่อง LNWJUD แล้วเปิด pairing URL ใหม่ จากนั้นใส่ Watcher token ให้ตรง.

**Snapshot มา แต่ realtime ไม่มา**

Tunnel/reverse proxy ต้องรองรับ WebSocket upgrade ที่ `/api/v1/events`.

**มือถือเปิด Local URL ไม่ได้**

`127.0.0.1` บนมือถือหมายถึง “มือถือเอง” ไม่ใช่คอม LNWJUD. ใช้ Tailscale หรือ public HTTPS provider แทน.

**ห้ามเปิด 17891 ใช่ไหม?**

ใช่. 17891 เป็น pairing loopback-only. ถ้าจะ tunnel ให้ tunnel เฉพาะ 17890.

**Watcher สั่งให้ Agent หยุด/ทำต่อได้ไหม?**

ไม่ได้ใน v0.1.0. นี่เป็น deliberate security boundary.

## สำหรับนักพัฒนา / Developers

Requires Node.js 22–24.

```bash
npm ci
npm run dev
```

Quality gates:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx cap sync
```

Architecture:

- [Architecture](docs/ARCHITECTURE.md)
- [Protocol v1](docs/PROTOCOL.md)
- [v0.1.0 release completion plan](docs/V0.1.0-RELEASE-PLAN.md)
- [Product truth](PRODUCT.md)
- [Design system](DESIGN.md)

Branch model:

- `dev` — development/integration
- `main` — released/integrated history
- release work goes `dev → PR → main → tag`

## License

MIT
