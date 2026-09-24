/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { ConnectionProfile, ConnectionState, WatcherSnapshot } from '../domain/models';
import { DemoWatcherTransport } from '../data/demo';
import { HttpWatcherTransport, type WatcherTransport } from '../data/transport';
import { loadProfile, loadSessionToken, saveProfile, saveSessionToken } from '../data/profile';

interface WatcherContextValue {
  snapshot: WatcherSnapshot | null;
  state: ConnectionState;
  error: string | null;
  profile: ConnectionProfile;
  token: string;
  configure(profile: ConnectionProfile, token: string): void;
  refresh(): Promise<void>;
}

const WatcherContext = createContext<WatcherContextValue | null>(null);

export function WatcherProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<ConnectionProfile>(() => loadProfile());
  const [token, setToken] = useState(() => loadSessionToken());
  const [snapshot, setSnapshot] = useState<WatcherSnapshot | null>(null);
  const [state, setState] = useState<ConnectionState>('offline');
  const [error, setError] = useState<string | null>(null);

  const transport = useMemo<WatcherTransport>(() => profile.mode === 'demo' ? new DemoWatcherTransport() : new HttpWatcherTransport(profile.endpoint, token || undefined), [profile, token]);

  const refresh = useCallback(async () => {
    try { setError(null); setSnapshot(await transport.getSnapshot()); }
    catch (cause) { setState('error'); setError(cause instanceof Error ? cause.message : 'Unable to load watcher snapshot'); }
  }, [transport]);

  useEffect(() => {
    let cancelled = false;
    transport.getSnapshot()
      .then((next) => { if (!cancelled) { setError(null); setSnapshot(next); } })
      .catch((cause) => { if (!cancelled) { setState('error'); setError(cause instanceof Error ? cause.message : 'Unable to load watcher snapshot'); } });
    const unsubscribe = transport.subscribe((event) => setSnapshot((current) => current ? { ...current, serverTime: new Date().toISOString(), activity: [event, ...current.activity].slice(0, 100) } : current), setState);
    return () => { cancelled = true; unsubscribe(); };
  }, [transport]);

  const configure = (nextProfile: ConnectionProfile, nextToken: string) => {
    saveProfile(nextProfile); saveSessionToken(nextToken); setProfile(nextProfile); setToken(nextToken);
  };

  return <WatcherContext.Provider value={{ snapshot, state, error, profile, token, configure, refresh }}>{children}</WatcherContext.Provider>;
}

export function useWatcher(): WatcherContextValue {
  const value = useContext(WatcherContext);
  if (!value) throw new Error('useWatcher must be used inside WatcherProvider');
  return value;
}
