# zrok

zrok is the recommended simple public option for users who want an outbound tunnel without configuring router port forwarding. LNWJUD Watcher supports the current zrok v2 CLI name: **`zrok2`**.

Official install guide: https://docs.zrok.io/docs/guides/install/

## Windows — helper path

```powershell
powershell -ExecutionPolicy Bypass -File scripts\providers\setup-watcher-access.ps1 -Provider zrok -Install
```

The helper downloads the latest official `openziti/zrok` Windows release into a user-local LNWJUD bin directory when `zrok2` is missing.

## macOS / Linux

Install the official zrok2 binary for your CPU/OS, then verify:

```sh
zrok2 version
```

The macOS official guide installs `zrok2` into a user-local `~/bin` directory.

## Enable your environment

If this machine has not been enabled yet, obtain the enable token from your zrok account and run it **directly in your terminal**:

```sh
zrok2 enable <YOUR_ENABLE_TOKEN>
```

Do not paste the enable token into Watcher.

## Share the Watcher API

```sh
zrok2 share public http://127.0.0.1:17890
```

Copy the HTTPS URL printed by zrok2 into LNWJUD Watcher.

Stop the foreground share with Ctrl+C. Review zrok's current account limits and authentication options before using a public URL for sensitive environments.
