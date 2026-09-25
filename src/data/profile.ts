import { Capacitor } from '@capacitor/core';
import type { ConnectionProfile } from '../domain/models';

const PROFILE_KEY = 'lnwjud-watcher.profile.v1';
const TOKEN_KEY = 'lnwjud-watcher.session-token';
const ONBOARDING_KEY = 'lnwjud-watcher.onboarding.v1';

export const WEB_SESSION_TOKEN_TTL_MS = 60 * 24 * 60 * 60 * 1_000;

type TokenStorageKind = 'web' | 'device';

interface StoredSessionToken {
  readonly version: 2;
  readonly token: string;
  readonly storage: TokenStorageKind;
  readonly savedAt: number;
  readonly expiresAt: number | null;
}

export const defaultProfile: ConnectionProfile = {
  mode: 'demo',
  name: 'LNWJUD Runtime',
  provider: 'local',
  endpoint: 'http://127.0.0.1:17890'
};

export function loadProfile(): ConnectionProfile {
  try { return { ...defaultProfile, ...JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{}') }; }
  catch { return defaultProfile; }
}

export function saveProfile(profile: ConnectionProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function tokenStorageKind(): TokenStorageKind {
  if (Capacitor.isNativePlatform()) return 'device';
  if (typeof navigator !== 'undefined' && /(?:^|\s)Electron\/\d/i.test(navigator.userAgent)) return 'device';
  return 'web';
}

function parseStoredSessionToken(raw: string, now: number): string {
  try {
    const stored = JSON.parse(raw) as Partial<StoredSessionToken>;
    if (stored.version !== 2 || typeof stored.token !== 'string') return '';
    if (stored.expiresAt !== null && (typeof stored.expiresAt !== 'number' || stored.expiresAt <= now)) return '';
    return stored.token;
  } catch {
    return '';
  }
}

export function loadSessionToken(): string {
  const now = Date.now();
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored !== null) {
    const token = parseStoredSessionToken(stored, now);
    if (token) return token;
    localStorage.removeItem(TOKEN_KEY);
  }

  // Earlier builds kept the token only for the browser tab/session.
  // Migrate it once so an update does not force the user to pair again.
  const legacySessionToken = sessionStorage.getItem(TOKEN_KEY) ?? '';
  if (legacySessionToken) {
    saveSessionToken(legacySessionToken);
    sessionStorage.removeItem(TOKEN_KEY);
  }
  return legacySessionToken;
}

export function saveSessionToken(token: string): void {
  const normalized = token.trim();
  sessionStorage.removeItem(TOKEN_KEY);

  if (!normalized) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }

  const storage = tokenStorageKind();
  const savedAt = Date.now();
  const stored: StoredSessionToken = {
    version: 2,
    token: normalized,
    storage,
    savedAt,
    expiresAt: storage === 'web' ? savedAt + WEB_SESSION_TOKEN_TTL_MS : null
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(stored));
}

export function loadOnboardingComplete(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === '1';
}

export function saveOnboardingComplete(value: boolean): void {
  if (value) localStorage.setItem(ONBOARDING_KEY, '1');
  else localStorage.removeItem(ONBOARDING_KEY);
}
