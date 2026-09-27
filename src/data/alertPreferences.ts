const PREFERENCES_KEY = 'lnwjud-watcher.alert-preferences.v1';
const READ_KEY = 'lnwjud-watcher.read-alerts.v1';

export interface AlertPreferences {
  inactivityMinutes: 5 | 10;
  androidNotifications: boolean;
}

export const defaultAlertPreferences: AlertPreferences = { inactivityMinutes: 10, androidNotifications: false };

export function loadAlertPreferences(): AlertPreferences {
  try {
    const stored = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? '{}') as Partial<AlertPreferences>;
    return {
      inactivityMinutes: stored.inactivityMinutes === 5 ? 5 : 10,
      androidNotifications: stored.androidNotifications === true,
    };
  } catch { return defaultAlertPreferences; }
}

export function saveAlertPreferences(preferences: AlertPreferences): void {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

export function loadReadAlerts(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(READ_KEY) ?? '[]') as unknown;
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(-100) : [];
  } catch { return []; }
}

export function saveReadAlerts(ids: readonly string[]): void {
  localStorage.setItem(READ_KEY, JSON.stringify(ids.slice(-100)));
}
