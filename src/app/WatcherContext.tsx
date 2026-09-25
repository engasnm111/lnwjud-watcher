/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { ActivityEvent, ConnectionProfile, ConnectionState, WatcherSnapshot } from '../domain/models';
import { DemoWatcherTransport } from '../data/demo';
import { HttpWatcherTransport, type WatcherTransport } from '../data/transport';
import {
  loadOnboardingComplete,
  loadProfile,
  loadSessionToken,
  saveOnboardingComplete,
  saveProfile,
  saveSessionToken
} from '../data/profile';

export const FALLBACK_REFRESH_MS = 5_000;

export function shouldUseFallbackPolling(mode: ConnectionProfile['mode'], state: ConnectionState): boolean {
  return mode === 'remote' && state !== 'connected';
}

export function mergeActivityEvent(snapshot: WatcherSnapshot, event: ActivityEvent): WatcherSnapshot {
  if (snapshot.activity.some((item) => item.id === event.id)) return snapshot;
  return {
    ...snapshot,
    serverTime: new Date().toISOString(),
    activity: [event, ...snapshot.activity].slice(0, 100)
  };
}

interface WatcherContextValue {
  snapshot: WatcherSnapshot | null;
  state: ConnectionState;
  error: string | null;
  profile: ConnectionProfile;
  token: string;
  lastSyncAt: string | null;
  fallbackPolling: boolean;
  refreshing: boolean;
  onboardingComplete: boolean;
  configure(profile: ConnectionProfile, token: string): void;
  completeOnboarding(value?: boolean): void;
  refresh(): Promise<void>;
}

const WatcherContext = createContext<WatcherContextValue | null>(null);

export function WatcherProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<ConnectionProfile>(() => loadProfile());
  const [token, setToken] = useState(() => loadSessionToken());
  const [snapshot, setSnapshot] = useState<WatcherSnapshot | null>(null);
  const [state, setState] = useState<ConnectionState>('offline');
  const [error, setError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(() => loadOnboardingComplete());
  const refreshInFlight = useRef<Promise<void> | null>(null);
  const refreshQueued = useRef(false);

  const transport = useMemo<WatcherTransport>(
    () => profile.mode === 'demo'
      ? new DemoWatcherTransport()
      : new HttpWatcherTransport(profile.endpoint, token || undefined),
    [profile, token]
  );

  const refresh = useCallback(async () => {
    if (refreshInFlight.current) {
      refreshQueued.current = true;
      return refreshInFlight.current;
    }

    const task = (async () => {
      setRefreshing(true);
      try {
        do {
          refreshQueued.current = false;
          try {
            const next = await transport.getSnapshot();
            setError(null);
            setSnapshot(next);
            setLastSyncAt(new Date().toISOString());
          } catch (cause) {
            setState('error');
            setError(cause instanceof Error ? cause.message : 'Unable to load Watcher status');
          }
        } while (refreshQueued.current);
      } finally {
        setRefreshing(false);
      }
    })();

    refreshInFlight.current = task;
    try { await task; }
    finally { refreshInFlight.current = null; }
  }, [transport]);

  useEffect(() => {
    void refresh();
    const unsubscribe = transport.subscribe(
      (event) => {
        setSnapshot((current) => current ? mergeActivityEvent(current, event) : current);
        setLastSyncAt(new Date().toISOString());
        void refresh();
      },
      setState
    );
    return unsubscribe;
  }, [refresh, transport]);

  useEffect(() => {
    if (profile.mode === 'remote' && state === 'connected') void refresh();
  }, [profile.mode, refresh, state]);

  const fallbackPolling = shouldUseFallbackPolling(profile.mode, state);

  useEffect(() => {
    if (!fallbackPolling) return;

    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };

    const timer = window.setInterval(refreshIfVisible, FALLBACK_REFRESH_MS);
    document.addEventListener('visibilitychange', refreshIfVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, [fallbackPolling, refresh]);

  const configure = (nextProfile: ConnectionProfile, nextToken: string) => {
    saveProfile(nextProfile);
    saveSessionToken(nextToken);
    setProfile(nextProfile);
    setToken(nextToken);
  };

  const completeOnboarding = (value = true) => {
    saveOnboardingComplete(value);
    setOnboardingComplete(value);
  };

  return <WatcherContext.Provider value={{
    snapshot,
    state,
    error,
    profile,
    token,
    lastSyncAt,
    fallbackPolling,
    refreshing,
    onboardingComplete,
    configure,
    completeOnboarding,
    refresh
  }}>{children}</WatcherContext.Provider>;
}

export function useWatcher(): WatcherContextValue {
  const value = useContext(WatcherContext);
  if (!value) throw new Error('useWatcher must be used inside WatcherProvider');
  return value;
}
