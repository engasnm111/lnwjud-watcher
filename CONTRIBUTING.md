# Contributing to LNWJUD Watcher

Thanks for helping improve LNWJUD Watcher.

## Before opening a change

- Search existing issues and pull requests first.
- Keep Watcher **read-only**. Do not add shell execution, filesystem mutation, MCP mutation, approval actions, or hidden model reasoning.
- Keep the LNWJUD runtime as the source of truth; Watcher consumes the versioned Watcher Protocol.
- Do not persist Watcher bearer tokens in localStorage or expose provider credentials.

## Development setup

Requires Node.js 22–24.

```bash
npm ci
npm run dev
```

Native shells use Capacitor:

```bash
npx cap sync
npm run cap:android
npm run cap:ios
```

## Branch and pull-request flow

Development lands on `dev`. Release integration is:

```text
dev -> pull request -> main -> release tag
```

Do not push release-only changes directly to `main` when the normal PR flow is available.

## Validation

For functional changes run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx cap sync
```

Do not add tests for docs-only, wording, label, styling, formatting, or other non-behavioral changes.

## Documentation

User-facing provider guides live in `docs/providers/`. Keep each provider guide understandable for non-developers and maintain **English + Thai in the same provider file**.

When provider behavior, pricing/plan availability, installation steps, or CLI commands can change, verify them against the provider's current official documentation before editing.

## Pull requests

A useful pull request includes:

- what changed and why;
- user-visible behavior or compatibility impact;
- security/trust-boundary implications;
- validation performed;
- screenshots for meaningful UI changes.

By contributing, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
