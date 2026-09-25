<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="LNWJUD Watcher" />
</p>

# Custom HTTPS reverse proxy

Use this only when you already manage a VPS, reverse proxy, ingress, or zero-trust gateway.

เหมาะกับคนที่มี VPS / reverse proxy / ingress ของตัวเองและเข้าใจการตั้งค่า HTTPS

## Requirements / สิ่งที่ต้องรองรับ

Your public endpoint must:

- terminate valid TLS (HTTPS);
- proxy `GET /api/v1/snapshot` to `http://127.0.0.1:17890`;
- support WebSocket upgrade for `/api/v1/events`;
- preserve required authentication headers;
- allow the Watcher web origin only through a narrow CORS policy when cross-origin access is required;
- avoid buffering/rewriting WebSocket frames;
- enforce appropriate rate limits and outer authentication for your deployment.

Endpoint ภายนอกต้องเป็น HTTPS และต้อง proxy ทั้ง snapshot กับ WebSocket ไปที่ `127.0.0.1:17890`

## Example architecture / ตัวอย่าง

```text
Internet
  -> https://watcher.example.com
  -> your TLS reverse proxy
  -> http://127.0.0.1:17890
```

Never proxy or publish `127.0.0.1:17891`. That pairing endpoint must remain local-only.

ห้าม proxy port 17891 ออกอินเทอร์เน็ตเด็ดขาด

After the proxy works, put `https://watcher.example.com` into Watcher and use the Watcher token from the local pairing page.
