<p align="center">
  <img src="../../public/brand/lnwjud-watcher-logo-dark.png" width="180" alt="LNWJUD Watcher" />
</p>

# Custom HTTPS reverse proxy

> **เหมาะกับ:** มี VPS, reverse proxy, ingress หรือ zero-trust gateway ของตัวเอง. / **Best for:** operators with existing HTTPS infrastructure.

Use this option when you already operate a domain, VPS, reverse proxy, ingress controller, or zero-trust gateway.

The public endpoint must:

- terminate valid TLS;
- proxy `GET /api/v1/snapshot` to the local LNWJUD Watcher API;
- proxy WebSocket upgrades for `/api/v1/events`;
- preserve required authentication headers on HTTP requests;
- permit the Watcher web origin through a narrowly-scoped CORS policy when the web client is hosted on a different origin;
- avoid buffering/rewriting WebSocket frames;
- enforce authentication/rate limits appropriate to the deployment.

Example upstream:

```text
http://127.0.0.1:17890
```

Never publish the full LNWJUD MCP gateway simply to expose Watcher. The Watcher API is a separate read-only surface with a smaller security boundary.
