import { describe, expect, it } from 'vitest';
import { connectionHelpKey } from './connectionHelp';

describe('connection troubleshooting', () => {
  it('points authentication failures to the saved token', () => {
    expect(connectionHelpKey('Watcher API returned HTTP 401')).toBe('connection.checkToken');
    expect(connectionHelpKey('Watcher API returned HTTP 403')).toBe('connection.checkToken');
  });

  it('points missing protocol routes to the endpoint setting', () => {
    expect(connectionHelpKey('Watcher API returned HTTP 404')).toBe('connection.checkEndpoint');
    expect(connectionHelpKey('Watcher API returned HTTP 426')).toBe('connection.checkEndpoint');
  });

  it('points network failures to connection settings', () => {
    expect(connectionHelpKey('Failed to fetch')).toBe('connection.checkSettings');
  });
});
