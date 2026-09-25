<p align="center">
  <img src="public/brand/lnwjud-watcher-logo-dark.png" width="180" alt="LNWJUD Watcher" />
</p>

# LNWJUD Watcher — Product Truth

## What it is

LNWJUD Watcher is the read-only companion for LNWJUD. It lets a person see what a connected LNWJUD runtime is doing from Web/PWA, Android, or iOS without giving the Watcher app command execution privileges.

## Primary users

1. A normal LNWJUD user who wants to see whether work is still running, blocked, waiting, verifying, or complete.
2. A team lead/operator who wants a quick live view of goals, agents, activity, runtime health, and Git baseline.
3. A developer who needs protocol/debug evidence without opening raw logs.

## Core user promise

Open Watcher and know, within seconds:

- whether LNWJUD is online;
- what goal it is working on;
- what the current task is;
- which agents are active;
- whether anything is blocked;
- what observable work happened recently;
- whether the view is live or temporarily using fallback refresh.

## Distribution

One shared React/TypeScript application ships as:

- Website / installable PWA;
- Android via Capacitor;
- iOS via Capacitor.

## Product boundary

v0.1.0 is monitoring only.

Watcher does not:

- execute shell commands;
- mutate files;
- invoke MCP mutation tools;
- approve/reject actions;
- pause/resume goals;
- reveal hidden model chain-of-thought;
- store tunnel/provider credentials.

## Connectivity

Watcher consumes Watcher Protocol v1 from LNWJUD over HTTPS + WebSocket.

Supported access profiles:

- Local / loopback;
- zrok;
- Cloudflare Tunnel;
- Tailscale Serve;
- Tailscale Funnel;
- ngrok;
- Custom HTTPS.

## Languages

The product ships in Thai and English. Locale is selected from the device on first run and can be switched explicitly.

## Freshness

- WebSocket is primary for live observable events.
- If the live stream is not healthy, visible clients refresh the authoritative snapshot every 5 seconds.
- Manual refresh remains available.
- After reconnect, Watcher re-synchronizes the full snapshot.
- Each accepted live activity also triggers a deduplicated authoritative snapshot refresh so Goal, Agent, and Git state do not silently drift.

## Design personality

A Watcher product, not an admin template: precise, calm, premium, technical, trustworthy. It belongs to the LNWJUD family but uses a distinct eye/radar/orbit identity for observability.
