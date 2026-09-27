import type { ConnectionProfile } from '../domain/models';

const PROFILE_KEY = 'lnwjud-watcher.profile.v1';
const TOKEN_KEY = 'lnwjud-watcher.session-token';
const ONBOARDING_KEY = 'lnwjud-watcher.onboarding.v1';

export const SESSION_TOKEN_TTL_MS = 365 * 24 * 60 * 60 * 1_000;

interface StoredSessionToken {
  readonly version: 3;
  readonly token: string;
  readonly savedAt: number;
  readonly expiresAt: number;
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

function parseStoredSessionToken(raw: string, now: number): { token: string; legacy: boolean } | null {
  try {
    const stored = JSON.parse(raw) as { version?: unknown; token?: unknown; expiresAt?: unknown };
    if ((stored.version !== 2 && stored.version !== 3) || typeof stored.token !== 'string' || !stored.token.trim()) return null;
    if (stored.expiresAt !== null && (typeof stored.expiresAt !== 'number' || stored.expiresAt <= now)) return null;
    if (stored.version === 3 && stored.expiresAt === null) return null;
    return { token: stored.token.trim(), legacy: stored.version === 2 };
  } catch {
    return null;
  }
}

export function loadSessionToken(): string {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored !== null) {
    const parsed = parseStoredSessionToken(stored, Date.now());
    if (parsed && !parsed.legacy) return parsed.token;
    localStorage.removeItem(TOKEN_KEY);
    if (parsed) {
      saveSessionToken(parsed.token);
      return parsed.token;
    }
    sessionStorage.removeItem(TOKEN_KEY);
    return '';
  }
  const legacySessionToken = sessionStorage.getItem(TOKEN_KEY) ?? '';
  if (legacySessionToken) saveSessionToken(legacySessionToken);
  return legacySessionToken;
}

export function saveSessionToken(token: string): void {
  const normalized = token.trim();
  sessionStorage.removeItem(TOKEN_KEY);
  if (!normalized) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  const savedAt = Date.now();
  const stored: StoredSessionToken = {
    version: 3,
    token: normalized,
    savedAt,
    expiresAt: savedAt + SESSION_TOKEN_TTL_MS,
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
