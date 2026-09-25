# Security Policy

## Supported versions

Security fixes are prioritized for the latest published lnwjud Watcher release and the current `main` branch.

## Reporting a vulnerability

Please **do not open a public GitHub issue** for a suspected credential exposure, authentication bypass, unsafe remote-access behavior, cross-origin weakness, protocol validation bypass, or other security-sensitive finding.

Preferred path:

1. Open the repository **Security** tab.
2. If private vulnerability reporting is available, use **Report a vulnerability**.
3. Include the affected Watcher/LNWJUD version, reproduction steps, expected vs. actual behavior, and impact.
4. Redact Watcher tokens, provider tokens, URLs that embed secrets, private hostnames, and unrelated machine data.

If private vulnerability reporting is unavailable, contact the repository maintainer through GitHub and request a private channel before sharing exploit details.

## Security model

lnwjud Watcher is intentionally **read-only**.

- Pairing port `17891` must remain loopback-only.
- Only the Watcher API on `17890` may be placed behind an HTTPS tunnel/reverse proxy.
- Remote traffic must use HTTPS/WSS.
- The Watcher bearer token is separate from Cloudflare, zrok, Tailscale, ngrok, MCP, and OAuth credentials.
- Provider credentials stay on the LNWJUD runtime machine.
- Watcher does not expose shell execution, file mutation, MCP mutation, approvals, OAuth/tunnel credentials, or hidden chain-of-thought.

Do not test against systems, accounts, or data you do not own or have explicit permission to assess.
