import type { ConnectionProfile } from '../domain/models';

const PROFILE_KEY = 'lnwjud-watcher.profile.v1';
const TOKEN_KEY = 'lnwjud-watcher.session-token';
export const defaultProfile: ConnectionProfile = { mode: 'demo', name: 'Demo runtime', provider: 'local', endpoint: 'http://127.0.0.1:17890' };

export function loadProfile(): ConnectionProfile {
  try { return { ...defaultProfile, ...JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{}') }; } catch { return defaultProfile; }
}
export function saveProfile(profile: ConnectionProfile): void { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
export function loadSessionToken(): string { return sessionStorage.getItem(TOKEN_KEY) ?? ''; }
export function saveSessionToken(token: string): void {
  if (token) sessionStorage.setItem(TOKEN_KEY, token); else sessionStorage.removeItem(TOKEN_KEY);
}
