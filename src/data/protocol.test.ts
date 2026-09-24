import { describe, expect, it } from 'vitest';
import { demoSnapshot } from './demo';
import { parseSnapshot } from './protocol';
import { normalizeEndpoint, toWebSocketUrl } from './transport';

describe('Watcher Protocol v1', () => {
  it('accepts a valid protocol v1 snapshot', () => {
    expect(parseSnapshot(demoSnapshot).protocolVersion).toBe(1);
  });

  it('rejects an incompatible protocol version', () => {
    expect(() => parseSnapshot({ ...demoSnapshot, protocolVersion: 2 })).toThrow();
  });

  it('maps HTTPS endpoints to the secure event stream', () => {
    expect(toWebSocketUrl('https://watcher.example.test/')).toBe('wss://watcher.example.test/api/v1/events');
  });

  it('rejects cleartext remote endpoints but permits loopback development', () => {
    expect(() => normalizeEndpoint('http://watcher.example.test')).toThrow('HTTPS');
    expect(normalizeEndpoint('http://127.0.0.1:17890/')).toBe('http://127.0.0.1:17890');
  });
});
