<p align="center">
  <img src="../public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="LNWJUD Watcher" />
</p>

# Install & run / วิธีติดตั้งและเปิดใช้งาน

This guide is written for normal end users. You do **not** need Node.js, npm, PowerShell development commands, Android Studio, or Xcode for the normal paths below.

คู่มือนี้เขียนสำหรับผู้ใช้ทั่วไป ไม่ต้องลง Node.js, npm, Android Studio หรือ Xcode ถ้าใช้วิธีปกติด้านล่าง

## Pick the easiest option / เลือกแบบง่ายที่สุด

| You use / อุปกรณ์ | Easiest option / วิธีง่ายสุด |
| --- | --- |
| Windows PC | **Portable EXE** — double-click, no installer |
| macOS | **DMG** — drag LNWJUD Watcher to Applications |
| Linux | **AppImage** — make executable once, then double-click |
| Android | **APK** from GitHub Releases |
| iPhone / iPad | **Web/PWA** in Safari → Add to Home Screen |
| Any browser | **Hosted Web/PWA** — open the URL, no install |
| Developer/self-host | Raw **Web ZIP** |

Latest release:
https://github.com/engasnm111/lnwjud-watcher/releases/latest

Hosted Web/PWA:
https://engasnm111.github.io/lnwjud-watcher/

---

# English

## 1. Before opening Watcher

Install and run **LNWJUD v5.6.1 or later** on the computer you want to monitor.

On that LNWJUD computer, open:

```text
http://127.0.0.1:17891/api/v1/pair
```

Keep that page private. Copy the **Watcher access token**.

- If Watcher runs on the **same computer**, use endpoint `http://127.0.0.1:17890`.
- If Watcher runs on a **phone or another computer**, create a remote HTTPS URL first. See [Remote access providers](providers/README.md).

Never publish port **17891**.

On LNWJUD v5.6.1+, that pairing URL opens a local UI with buttons to copy the Session token and local endpoint. Integrations can still request JSON with `?format=json`. Watcher Web/PWA remembers the token for 60 days in that browser; packaged Windows/macOS/Linux and Android/iOS builds keep it on that device across restarts until you clear the token in Settings.

Watcher v0.3.0 also checks the latest stable GitHub Release at startup, every 30 minutes, and when the app returns to the foreground. A newer version shows a required update modal; Web/PWA refreshes to the newest service-worker build, while native/desktop targets open the appropriate GitHub asset or release path for the normal OS install confirmation.

## 2. Windows — easiest desktop option

1. Open the [latest release](https://github.com/engasnm111/lnwjud-watcher/releases/latest).
2. Download **`lnwjud-watcher-windows-x64.exe`**.
3. Double-click the EXE. It is portable; there is no setup wizard.
4. On first run, Windows SmartScreen may warn because the community build is not Authenticode-signed. Only continue if the file came from the official GitHub release.
5. Enter the Watcher endpoint and Watcher token.
6. Closing the window hides Watcher to the **system tray** instead of stopping it.
7. Click the tray icon to show/hide. Right-click it and choose **Quit** to stop Watcher completely.

No terminal is required.

## 3. macOS

1. Download:
   - Apple silicon (M1/M2/M3/M4…): **`lnwjud-watcher-macos-arm64.dmg`**
   - Intel Mac: **`lnwjud-watcher-macos-x64.dmg`**
2. Open the DMG and drag **LNWJUD Watcher** to Applications.
3. Because the community build is not Apple-notarized, macOS may block the first launch.
4. Use **Control-click → Open**. If macOS still blocks it, open **System Settings → Privacy & Security** and choose **Open Anyway** for LNWJUD Watcher.
5. Enter the Watcher endpoint and token.
6. Closing the window keeps the app available from the menu-bar/tray icon. Choose **Quit** from its tray menu to exit.

Do not disable Gatekeeper globally.

## 4. Linux

1. Download **`lnwjud-watcher-linux-x64.AppImage`**.
2. Right-click → Properties → allow executing as a program, or run once:

```sh
chmod +x lnwjud-watcher-linux-x64.AppImage
```

3. Double-click the AppImage.
4. Enter the Watcher endpoint and token.
5. Closing the window keeps Watcher in the tray when the desktop environment supports tray icons.

If your distribution reports an AppImage/FUSE error, use your distribution's current AppImage/FUSE package instructions.

## 5. Android

1. On the Android phone/tablet, open the [latest release](https://github.com/engasnm111/lnwjud-watcher/releases/latest).
2. Download **`lnwjud-watcher-android.apk`**.
3. Android may ask for permission to **Install unknown apps** for the browser/files app. Allow it only for this install.
4. Open the downloaded APK → Install.
5. Start LNWJUD Watcher.
6. Because a phone cannot reach the PC through `127.0.0.1`, use a remote **HTTPS** provider URL plus the Watcher token.

The current APK is a GitHub release-signed build (not a Play Store package). v0.3.0 establishes the persistent signing identity used for future in-place APK updates. If you installed the older v0.2.0 debug APK, Android may require you to uninstall that build once before installing v0.3.0 because the signatures differ.

## 6. iPhone / iPad — easiest path

The current native iOS release asset is a **Simulator build**, so it is not a normal one-tap install for a physical iPhone.

For normal iPhone/iPad use:

1. Open Safari.
2. Go to **https://engasnm111.github.io/lnwjud-watcher/**
3. Tap **Share**.
4. Tap **Add to Home Screen**.
5. Open Watcher from the new Home Screen icon.
6. Use a remote HTTPS provider URL and your Watcher token.

A signed native iPhone/App Store build requires Apple signing/notarization and is not claimed by the current community release.

## 7. Web / PWA — no installation

Open:

```text
https://engasnm111.github.io/lnwjud-watcher/
```

Then connect with a remote HTTPS endpoint + Watcher token.

In supported browsers you can use **Install app** / **Add to Home Screen**.

### Advanced self-hosting

Download **`lnwjud-watcher-web.zip`**, extract it, and host the extracted files using a normal static HTTPS web host.

Do not run the development command `npm run dev` just to use Watcher.

---

# ภาษาไทย

## 1. ก่อนเปิด Watcher

ติดตั้งและเปิด **LNWJUD v5.6.1 ขึ้นไป** บนเครื่องหลักก่อน

บนเครื่อง LNWJUD เปิด:

```text
http://127.0.0.1:17891/api/v1/pair
```

คัดลอก **Watcher access token** เก็บไว้ ห้ามส่งให้คนอื่น

- ถ้า Watcher อยู่ **เครื่องเดียวกับ LNWJUD** ให้ใช้ endpoint `http://127.0.0.1:17890`
- ถ้า Watcher อยู่ **มือถือ/คอมอีกเครื่อง/นอกบ้าน** ต้องทำ HTTPS URL ก่อน ดู [คู่มือ Provider](providers/README.md)

**ห้ามเปิด port 17891 ออกอินเทอร์เน็ต**

ตั้งแต่ LNWJUD v5.6.1 ลิงก์ Pairing นี้จะแสดงหน้า UI บนเครื่องให้กดคัดลอก Session token และ local endpoint ได้ง่ายขึ้น ส่วน integration ยังขอ JSON ได้ด้วย `?format=json` โดย Web/PWA จะจำ token ไว้ใน browser 60 วัน ส่วน Windows/macOS/Linux และ Android/iOS แบบแอปจะเก็บไว้ในเครื่องข้ามการปิดเปิด จนกว่าผู้ใช้จะล้าง token ใน Settings

Watcher v0.3.0 จะเช็ก GitHub Release รุ่นล่าสุดตอนเปิดแอป ทุก 30 นาที และเมื่อกลับมาเปิดแอปอีกครั้ง หากมีรุ่นใหม่จะขึ้น modal บังคับอัปเดต; Web/PWA จะ refresh ไป build ใหม่ ส่วนแอป native/desktop จะเปิดไฟล์หรือหน้า GitHub Release ที่ตรงกับแพลตฟอร์มเพื่อให้ระบบปฏิบัติการยืนยันการติดตั้งตามปกติ

## 2. Windows — ง่ายที่สุด

1. เข้า [Latest Release](https://github.com/engasnm111/lnwjud-watcher/releases/latest)
2. ดาวน์โหลด **`lnwjud-watcher-windows-x64.exe`**
3. ดับเบิลคลิกเปิดได้เลย เป็น Portable ไม่ต้องติดตั้ง
4. ถ้า Windows SmartScreen เตือน ให้ตรวจว่าโหลดมาจาก GitHub repo นี้จริงก่อนค่อยเลือกเปิดต่อ เพราะ community build ยังไม่ได้ Authenticode sign
5. ใส่ Watcher endpoint + Watcher token
6. กด X แล้วโปรแกรมจะ **ซ่อนไปที่ Tray** ไม่ได้ปิด
7. คลิกไอคอน Tray เพื่อเปิด/ซ่อน และคลิกขวา → **Quit** เมื่อต้องการปิดจริง

ไม่ต้องเปิด PowerShell ไม่ต้องพิมพ์คำสั่ง

## 3. macOS

1. Mac ชิป Apple Silicon ให้โหลด **`lnwjud-watcher-macos-arm64.dmg`**
2. Mac Intel ให้โหลด **`lnwjud-watcher-macos-x64.dmg`**
3. เปิด DMG แล้วลาก LNWJUD Watcher ไป Applications
4. community build ยังไม่ได้ Apple notarize จึงอาจโดน macOS บล็อกครั้งแรก
5. ให้ Control-click ที่แอป → **Open** หรือไป **System Settings → Privacy & Security → Open Anyway**
6. ใส่ endpoint + token
7. กดปิดหน้าต่างแล้วแอปยังอยู่ที่เมนูบาร์/Tray; ถ้าจะปิดจริงให้เลือก **Quit**

ไม่แนะนำให้ปิด Gatekeeper ทั้งระบบ

## 4. Linux

1. โหลด **`lnwjud-watcher-linux-x64.AppImage`**
2. คลิกขวา Properties แล้วอนุญาตให้รันเป็นโปรแกรม หรือรันครั้งเดียว:

```sh
chmod +x lnwjud-watcher-linux-x64.AppImage
```

3. ดับเบิลคลิกเปิด
4. ใส่ endpoint + token

ถ้าขึ้น FUSE/AppImage error ให้ติดตั้งแพ็กเกจ AppImage/FUSE ตามคู่มือของ Linux distro ที่ใช้อยู่

## 5. Android

1. เปิด Latest Release จากมือถือ
2. โหลด **`lnwjud-watcher-android.apk`**
3. Android อาจถามสิทธิ์ **Install unknown apps** ให้เปิดเฉพาะแอปที่ใช้ติดตั้ง
4. แตะ APK → Install
5. เปิด Watcher
6. มือถือใช้ `127.0.0.1` ของคอมไม่ได้ ต้องใช้ HTTPS URL จาก Cloudflare/zrok/Tailscale/ngrok แล้วใส่ Watcher token

APK ปัจจุบันเป็น GitHub release-signed build (ยังไม่ใช่ Play Store package) และตั้งแต่ v0.3.0 จะใช้ signing key เดิมต่อเนื่องเพื่อให้อัปเดต APK รุ่นถัดไปทับได้ หากเคยลง v0.2.0 debug APK อาจต้องถอนรุ่นเก่าหนึ่งครั้งก่อนลง v0.3.0 เพราะลายเซ็น Android คนละชุด

## 6. iPhone / iPad — วิธีง่ายสุด

ไฟล์ iOS native ใน Release ปัจจุบันเป็น **Simulator build** จึงติดตั้งลง iPhone จริงแบบแตะครั้งเดียวไม่ได้

สำหรับผู้ใช้ทั่วไปให้ใช้ PWA:

1. เปิด Safari
2. เข้า **https://engasnm111.github.io/lnwjud-watcher/**
3. กด **Share**
4. เลือก **Add to Home Screen / เพิ่มไปยังหน้าจอโฮม**
5. เปิดจากไอคอน Watcher บนหน้าจอ
6. ใส่ HTTPS URL จาก provider + Watcher token

ถ้าจะทำ native iPhone/App Store จริง ต้องมี Apple signing/notarization เพิ่ม จึงไม่เขียนหลอกว่าติดตั้งได้ทันทีในรุ่นนี้

## 7. Web / PWA — ไม่ต้องติดตั้ง

เปิดเว็บนี้ได้เลย:

```text
https://engasnm111.github.io/lnwjud-watcher/
```

ถ้า browser รองรับสามารถกด **Install app / Add to Home Screen** ได้

สำหรับคนที่ต้องการ host เองเท่านั้น: โหลด **`lnwjud-watcher-web.zip`** → แตก ZIP → เอาไฟล์ไปวางบน static HTTPS hosting

ผู้ใช้ทั่วไป **ไม่ต้องใช้ `npm run dev`**

---

## Remote access recommendation / แนะนำการดูจากนอกบ้าน

- มีโดเมนบน Cloudflare อยู่แล้ว → **Cloudflare Tunnel** เป็นตัวแนะนำ
- ไม่มีโดเมนและอยากเริ่มฟรี → **zrok**
- ต้องการ private เฉพาะเครื่องตัวเอง → **Tailscale Serve**
- ใช้ ngrok อยู่แล้ว → **ngrok**

อ่านขั้นตอนแบบ 2 ภาษา: [Remote access providers](providers/README.md)
