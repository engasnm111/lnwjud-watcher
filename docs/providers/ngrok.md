<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-dark.png" width="180" alt="LNWJUD Watcher" />
</p>

# ngrok

> **เหมาะกับ:** ใช้ ngrok อยู่แล้วและต้องการ reuse account/config เดิม. / **Best for:** existing ngrok users.

Official downloads: https://ngrok.com/download

Use ngrok when you already have an ngrok account or prefer its tunnel management.

## Windows

```powershell
powershell -ExecutionPolicy Bypass -File scripts\providers\setup-watcher-access.ps1 -Provider ngrok -Install
```

The helper installs the current `Ngrok.Ngrok` winget package when needed.

Authenticate once on the runtime machine:

```powershell
ngrok config add-authtoken <YOUR_AUTHTOKEN>
```

Keep the token in ngrok's own config; do not paste it into Watcher.

Start:

```powershell
ngrok http 17890
```

## macOS

```sh
brew install ngrok
ngrok config add-authtoken <YOUR_AUTHTOKEN>
ngrok http 17890
```

## Linux

Install using ngrok's official apt/snap/download instructions, authenticate, then run `ngrok http 17890`.

Paste the assigned HTTPS URL into Watcher.
