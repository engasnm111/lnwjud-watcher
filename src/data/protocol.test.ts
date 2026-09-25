import { describe, expect, it } from 'vitest';
import { demoSnapshot } from './demo';
import { parseSnapshot } from './protocol';
import { normalizeEndpoint, toWebSocketUrl } from './transport';

describe('Watcher Protocol v1', () => {
  it('accepts a valid protocol v1 snapshot', () => {
    expect(parseSnapshot(demoSnapshot).protocolVersion).toBe(1);
  });

  it('accepts ISO-8601 timestamps with timezone offsets emitted by Git', () => {
    const offsetTimestamp = '2026-09-26T01:37:20+07:00';
    const snapshot = structuredClone(demoSnapshot);
    snapshot.serverTime = offsetTimestamp;
    snapshot.git.latestAt = offsetTimestamp;
    snapshot.activity = snapshot.activity.map((event) => ({ ...event, timestamp: offsetTimestamp }));
    snapshot.workspaces = snapshot.workspaces.map((workspace) => ({
      ...workspace,
      git: { ...workspace.git, latestAt: offsetTimestamp }
    }));

    expect(() => parseSnapshot(snapshot)).not.toThrow();
  });

  it('rejects an incompatible protocol version', () => {
    expect(() => parseSnapshot({ ...demoSnapshot, protocolVersion: 2 })).toThrow();
  });

  it('preserves multiple active projects and goals in one protocol snapshot', () => {
    const parsed = parseSnapshot(demoSnapshot);
    expect(parsed.workspaces).toHaveLength(2);
    expect(parsed.workspaces[1]?.goals).toHaveLength(2);
    expect(parsed.workspaces.flatMap((workspace) => workspace.goals)).toHaveLength(3);
  });

  it('defaults additive observability fields for older protocol v1 runtimes', () => {
    const legacySnapshot = { ...demoSnapshot, workspaces: undefined };
    const legacy = {
      ...legacySnapshot,
      runtime: { version: demoSnapshot.runtime.version, status: demoSnapshot.runtime.status },
      git: { branch: demoSnapshot.git.branch, commit: demoSnapshot.git.commit, clean: demoSnapshot.git.clean },
    };
    const parsed = parseSnapshot(legacy);
    expect(parsed.runtime.activeOperations).toBe(0);
    expect(parsed.git.changedFiles).toBe(0);
    expect(parsed.workspaces).toEqual([]);
  });

  it('maps HTTPS endpoints to the secure event stream', () => {
    expect(toWebSocketUrl('https://watcher.example.test/')).toBe('wss://watcher.example.test/api/v1/events');
  });

  it('rejects cleartext remote endpoints but permits loopback development', () => {
    expect(() => normalizeEndpoint('http://watcher.example.test')).toThrow('HTTPS');
    expect(normalizeEndpoint('http://127.0.0.1:17890/')).toBe('http://127.0.0.1:17890');
  });
});
