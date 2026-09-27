import { Capacitor } from '@capacitor/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadSessionToken, saveSessionToken, SESSION_TOKEN_TTL_MS } from './profile';

const TOKEN_KEY = 'lnwjud-watcher.session-token';

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Session token storage', () => {
  it('remembers a Web/PWA token for one year and removes it at expiry', () => {
    const start = 1_800_000_000_000;
    const now = vi.spyOn(Date, 'now').mockReturnValue(start);
    saveSessionToken('  web-token  ');
    expect(JSON.parse(localStorage.getItem(TOKEN_KEY) ?? '{}')).toMatchObject({
      version: 3, token: 'web-token', expiresAt: start + SESSION_TOKEN_TTL_MS
    });
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
    now.mockReturnValue(start + SESSION_TOKEN_TTL_MS - 1);
    expect(loadSessionToken()).toBe('web-token');
    now.mockReturnValue(start + SESSION_TOKEN_TTL_MS);
    expect(loadSessionToken()).toBe('');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('uses the same one-year expiry for packaged Electron and Capacitor apps', () => {
    const start = 1_800_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(start);
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 lnwjud Watcher Electron/44.4.5' });
    saveSessionToken('desktop-token');
    expect(JSON.parse(localStorage.getItem(TOKEN_KEY) ?? '{}')).toMatchObject({
      token: 'desktop-token', expiresAt: start + SESSION_TOKEN_TTL_MS
    });
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
    saveSessionToken('mobile-token');
    expect(loadSessionToken()).toBe('mobile-token');
  });

  it('extends a valid older stored token to the new one-year policy', () => {
    const start = 1_800_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(start);
    localStorage.setItem(TOKEN_KEY, JSON.stringify({
      version: 2,
      token: 'stored-token',
      storage: 'web',
      savedAt: 1,
      expiresAt: 9_000_000_000_000
    }));
    expect(loadSessionToken()).toBe('stored-token');
    expect(JSON.parse(localStorage.getItem(TOKEN_KEY) ?? '{}')).toMatchObject({
      version: 3, token: 'stored-token', expiresAt: start + SESSION_TOKEN_TTL_MS
    });
  });

  it('migrates a legacy session token into one-year storage', () => {
    sessionStorage.setItem(TOKEN_KEY, 'legacy-token');
    expect(loadSessionToken()).toBe('legacy-token');
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(JSON.parse(localStorage.getItem(TOKEN_KEY) ?? '{}')).toMatchObject({
      version: 3, token: 'legacy-token'
    });
  });

  it('clears both stores when the token is removed', () => {
    sessionStorage.setItem(TOKEN_KEY, 'session-token');
    localStorage.setItem(TOKEN_KEY, 'old-token');
    saveSessionToken('');
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
