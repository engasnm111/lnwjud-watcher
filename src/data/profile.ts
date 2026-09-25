import type { ConnectionProfile } from '../domain/models';

const PROFILE_KEY = 'lnwjud-watcher.profile.v1';
const TOKEN_KEY = 'lnwjud-watcher.session-token';
const ONBOARDING_KEY = 'lnwjud-watcher.onboarding.v1';

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

export function loadSessionToken(): string {
  return sessionStorage.getItem(TOKEN_KEY) ?? '';
}

export function saveSessionToken(token: string): void {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

export function loadOnboardingComplete(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === '1';
}

export function saveOnboardingComplete(value: boolean): void {
  if (value) localStorage.setItem(ONBOARDING_KEY, '1');
  else localStorage.removeItem(ONBOARDING_KEY);
}
