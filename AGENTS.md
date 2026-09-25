<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-transparent.png" width="160" alt="LNWJUD Watcher" />
</p>

# LNWJUD Watcher Engineering Rules

## Product boundary
- This repository is the **read-only client** for lnwjud monitoring. It must never gain shell, MCP mutation, filesystem mutation, or arbitrary command execution capabilities.
- The lnwjud runtime is the source of truth. Watcher consumes the versioned HTTP/WebSocket Watcher Protocol; it never reads lnwjud databases or internal files directly.
- Web/PWA, Android, and iOS share the same React/TypeScript application code. Native shells are adapters, not separate product implementations.

## Architecture
- `domain/`: protocol-independent product models and view state.
- `data/`: Watcher Protocol schemas, transport, connection repository, and demo adapter.
- `features/`: user-facing screens and feature composition.
- `shared/`: reusable UI and utilities with no feature-specific business rules.
- Dependencies flow inward: UI -> application/data ports -> domain. Native platform details must not leak into domain models.

## Security
- Monitoring is read-only. Never expose or persist OAuth refresh tokens, API keys, tunnel credentials, environment secrets, raw command environments, or hidden model reasoning.
- Endpoint metadata may persist locally. Bearer tokens are session-only unless a future native secure-storage design is explicitly implemented and reviewed.
- Treat all remote payloads as untrusted. Validate protocol data at runtime before rendering.
- CI uses least-privilege `GITHUB_TOKEN` permissions and pinned action SHAs.

## Quality gates
- Functional behavior changes require focused tests. Do not add tests for labels, styling, formatting, or implementation details.
- Before release: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` must pass.
- Work lands on `dev`; release integration is via PR to `main`.
