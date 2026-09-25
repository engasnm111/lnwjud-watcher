<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="lnwjud Watcher" />
</p>

# zrok — public HTTPS without your own domain / เปิดดูจากนอกบ้านโดยไม่ต้องมีโดเมน

zrok is a good free-first public option when you do not own a domain. The hosted zrok service has a Free plan with limits, and public shares provide an HTTPS URL.

zrok เหมาะกับคนที่อยากเปิดดู Watcher จากนอกบ้านแบบ public แต่ยังไม่มีโดเมน โดยบริการ hosted มี Free plan และมีข้อจำกัดตามแพ็กเกจปัจจุบัน

Official:
- https://zrok.io/
- https://zrok.io/pricing/
- https://docs.zrok.io/docs/guides/install/
- https://github.com/openziti/zrok/releases

lnwjud Watcher uses the current v2 CLI name: **`zrok2`**.

## English setup

### 1. Confirm the local Watcher API

```text
Pairing page: http://127.0.0.1:17891/api/v1/pair
Watcher API:   http://127.0.0.1:17890
```

Copy the Watcher token from the pairing page. Do not expose 17891.

### 2A. Windows — easiest helper path

The script path is relative to the repository root, so **cd into the cloned repo first**:

```powershell
cd C:\path\to\lnwjud-watcher
Get-ChildItem .\scripts\providers\
powershell -ExecutionPolicy Bypass -File .\scripts\providers\setup-watcher-access.ps1 -Provider zrok -Install
zrok2 version
```

The helper downloads the current official Windows release, extracts `zrok2.exe` into a user-local LNWJUD bin folder, updates the user PATH, and verifies the command.

If PowerShell says it cannot find the `.ps1` file, you are in the wrong folder. Run `pwd`, then `cd` to the folder that contains this repository.

### 2B. Windows — manual install if you do not want the helper

1. Open the zrok Releases page and download the Windows build matching your CPU:
   - most PCs: `windows_amd64.tar.gz`
   - Windows on ARM: `windows_arm64.tar.gz`
2. Open PowerShell and go to Downloads:

```powershell
cd $HOME\Downloads
Get-ChildItem *zrok*windows*.tar.gz
```

3. Create a permanent bin folder and extract the archive:

```powershell
New-Item -ItemType Directory -Force "$HOME\bin\zrok2" | Out-Null
$archive = Get-ChildItem -File *windows_amd64.tar.gz | Select-Object -First 1
if (-not $archive) { throw "zrok Windows AMD64 archive not found in Downloads" }
tar -xf $archive.FullName -C "$HOME\bin\zrok2"
cd "$HOME\bin\zrok2"
Get-ChildItem
.\zrok2.exe version
```

If you downloaded the ARM64 file, replace the archive name with the ARM64 one.

4. Add that folder to your **User PATH** using Windows Settings → System → About → Advanced system settings → Environment Variables → User variables → Path → New → `C:\Users\YOUR_NAME\bin\zrok2`.

5. Close and reopen PowerShell, then verify:

```powershell
zrok2 version
```

### 2C. macOS

The official guide downloads a `darwin` archive. Example:

```sh
cd ~/Downloads
mkdir -p /tmp/zrok2
tar -xf ./zrok*darwin*.tar.gz -C /tmp/zrok2
mkdir -p ~/bin
install /tmp/zrok2/zrok2 ~/bin/
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshenv
export PATH="$HOME/bin:$PATH"
zrok2 version
```

### 2D. Linux

Use the official Linux package/release for your distribution and CPU, then verify with `zrok2 version`.

### 3. Get the zrok account token

The clearest current hosted flow is:

```text
zrok2 invite
```

1. Run `zrok2 invite`.
2. Enter your email address when prompted.
3. Check your email (including Spam/Junk).
4. The invitation email contains the **account token** used to enable an environment.

If you already have a hosted zrok account, use the account token from your zrok account/console instead of creating another account.

### 4. Enable this computer

```powershell
zrok2 enable YOUR_ACCOUNT_TOKEN
zrok2 status
```

The token enables this **environment**. Keep it private; do not put it in Watcher.

### 5. Publish the Watcher API

```powershell
zrok2 share public http://127.0.0.1:17890
```

zrok prints a public HTTPS URL. Copy that URL into Watcher, then enter the **Watcher access token** from the LNWJUD pairing page.

Keep the terminal open while using an ephemeral share. Stop it with `Ctrl+C`.

## ขั้นตอนภาษาไทย

### 1. เช็ก Watcher API

เปิดบนเครื่อง LNWJUD:
- `http://127.0.0.1:17891/api/v1/pair` เพื่อเอา Watcher token
- `http://127.0.0.1:17890` คือ API ที่จะนำออกผ่าน zrok

### 2. Windows แบบง่ายที่สุด

```powershell
cd C:\path\to\lnwjud-watcher
Get-ChildItem .\scripts\providers\
powershell -ExecutionPolicy Bypass -File .\scripts\providers\setup-watcher-access.ps1 -Provider zrok -Install
zrok2 version
```

**จุดสำคัญ:** ต้อง `cd` เข้าโฟลเดอร์ repo ก่อน ไม่อย่างนั้น path ของ `.ps1` จะ error

### 3. Windows แบบแตกไฟล์เอง

ดาวน์โหลดไฟล์ Windows AMD64/ARM64 จากหน้า Releases → เปิด PowerShell:

```powershell
cd $HOME\Downloads
New-Item -ItemType Directory -Force "$HOME\bin\zrok2" | Out-Null
$archive = Get-ChildItem -File *windows_amd64.tar.gz | Select-Object -First 1
if (-not $archive) { throw "zrok Windows AMD64 archive not found in Downloads" }
tar -xf $archive.FullName -C "$HOME\bin\zrok2"
cd "$HOME\bin\zrok2"
.\zrok2.exe version
```

จากนั้นเพิ่ม `C:\Users\ชื่อคุณ\bin\zrok2` เข้า User PATH แล้วปิด/เปิด PowerShell ใหม่

### 4. สมัครและเอา token

```powershell
zrok2 invite
```

กรอกอีเมล → ไปเปิดอีเมลที่ zrok ส่งมา → คัดลอก **account token** → นำมา enable เครื่อง:

```powershell
zrok2 enable YOUR_ACCOUNT_TOKEN
zrok2 status
```

### 5. เปิด public URL

```powershell
zrok2 share public http://127.0.0.1:17890
```

คัดลอก URL `https://...` ที่ได้ไปใส่ Watcher พร้อม **Watcher token** จากหน้า pairing ของ LNWJUD

## Troubleshooting / แก้ปัญหา

- `zrok2 is not recognized`: PATH ยังไม่ถูกหรือยังไม่ได้เปิด terminal ใหม่
- `script ... cannot be found`: ยังไม่ได้ `cd` เข้า repo
- ไม่ได้อีเมล invite: เช็ก Spam/Junk และยืนยันว่าอีเมลพิมพ์ถูก
- `401 Unauthorized` ใน Watcher: ใช้ Watcher token ผิด ไม่ใช่ zrok account token
