export type ObservableStatus = 'running' | 'analyzing' | 'verifying' | 'waiting' | 'blocked' | 'idle' | 'done' | 'error';

export interface Milestone {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
}

export interface Goal {
  id: string;
  key: string;
  status: ObservableStatus;
  currentTask: string;
  blockers: string[];
  milestones: Milestone[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: ObservableStatus;
  task?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  kind: string;
  status: ObservableStatus;
  actor: string;
  summary: string;
  detail?: string;
}

export interface WatcherSnapshot {
  protocolVersion: 1;
  serverTime: string;
  runtime: { version: string; status: ObservableStatus };
  instance: { id: string; name: string; platform: 'windows' | 'macos' | 'linux' | 'unknown' };
  goal: Goal | null;
  agents: Agent[];
  activity: ActivityEvent[];
  git: { branch: string; commit: string; clean: boolean };
}

export type RemoteProvider = 'local' | 'zrok' | 'cloudflare' | 'tailscale-serve' | 'tailscale-funnel' | 'ngrok' | 'custom';
export type ConnectionState = 'demo' | 'connecting' | 'connected' | 'reconnecting' | 'offline' | 'error';

export interface ConnectionProfile {
  mode: 'demo' | 'remote';
  name: string;
  provider: RemoteProvider;
  endpoint: string;
}
