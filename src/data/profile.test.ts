import { Capacitor } from '@capacitor/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadSessionToken, saveSessionToken, WEB_SESSION_TOKEN_TTL_MS } from './profile';

const TOKEN_KEY = 'lnwjud-watcher.session-token';

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Session token persistence', () => {
  it('remembers a Web/PWA token for 60 days and removes it after expiry', () => {
    const start = 1_800_000_000_000;
    const now = vi.spyOn(Date, 'now').mockReturnValue(start);

    saveSessionToken('  web-token  ');

    const stored = JSON.parse(localStorage.getItem(TOKEN_KEY) ?? '{}') as {
      token?: string;
      storage?: string;
      expiresAt?: number | null;
    };
    expect(stored.token).toBe('web-token');
    expect(stored.storage).toBe('web');
    expect(stored.expiresAt).toBe(start + WEB_SESSION_TOKEN_TTL_MS);

    now.mockReturnValue(start + WEB_SESSION_TOKEN_TTL_MS - 1);
    expect(loadSessionToken()).toBe('web-token');

    now.mockReturnValue(start + WEB_SESSION_TOKEN_TTL_MS);
    expect(loadSessionToken()).toBe('');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('keeps the token on a packaged Electron device without the browser TTL', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 lnwjud Watcher Electron/44.4.5' });
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000);

    saveSessionToken('desktop-token');

    const stored = JSON.parse(localStorage.getItem(TOKEN_KEY) ?? '{}') as {
      storage?: string;
      expiresAt?: number | null;
    };
    expect(stored.storage).toBe('device');
    expect(stored.expiresAt).toBeNull();

    now.mockReturnValue(9_000_000_000_000);
    expect(loadSessionToken()).toBe('desktop-token');
  });

  it('keeps the token on a Capacitor mobile device across restarts without the browser TTL', () => {
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
    vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000);

    saveSessionToken('mobile-token');

    expect(JSON.parse(localStorage.getItem(TOKEN_KEY) ?? '{}')).toMatchObject({
      version: 2,
      token: 'mobile-token',
      storage: 'device',
      expiresAt: null
    });
    expect(loadSessionToken()).toBe('mobile-token');
  });

  it('migrates the old session-only token into persistent storage once', () => {
    sessionStorage.setItem(TOKEN_KEY, 'legacy-token');

    expect(loadSessionToken()).toBe('legacy-token');
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(JSON.parse(localStorage.getItem(TOKEN_KEY) ?? '{}')).toMatchObject({
      version: 2,
      token: 'legacy-token'
    });
  });

  it('clears persistent and legacy token storage when the token is removed', () => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify({
      version: 2,
      token: 'stored-token',
      storage: 'web',
      savedAt: 1,
      expiresAt: 9_000_000_000_000
    }));
    sessionStorage.setItem(TOKEN_KEY, 'legacy-token');

    saveSessionToken('');

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
