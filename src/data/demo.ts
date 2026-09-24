import type { ActivityEvent, ConnectionState, WatcherSnapshot } from '../domain/models';
import type { WatcherTransport } from './transport';

const now = () => new Date().toISOString();

export const demoSnapshot: WatcherSnapshot = {
  protocolVersion: 1,
  serverTime: now(),
  runtime: { version: '5.x demo', status: 'running' },
  instance: { id: 'demo-office-pc', name: 'OFFICE-PC', platform: 'windows' },
  goal: {
    id: 'demo-goal', key: 'lnwjud-watcher-v0.1.0', status: 'running',
    currentTask: 'Build the cross-platform read-only watcher and validate all three targets.', blockers: [],
    milestones: [
      { id: 'm1', title: 'Watcher protocol', status: 'completed' },
      { id: 'm2', title: 'Web/PWA dashboard', status: 'in_progress' },
      { id: 'm3', title: 'Android shell', status: 'pending' },
      { id: 'm4', title: 'iOS shell', status: 'pending' },
      { id: 'm5', title: 'Release validation', status: 'pending' }
    ]
  },
  agents: [
    { id: 'lnwjud', name: '@lnwjud', role: 'Orchestrator', status: 'running', task: 'Executing the next implementation step' },
    { id: 'serena', name: 'Serena', role: 'Code intelligence', status: 'analyzing', task: 'Inspecting project structure' },
    { id: 'reviewer', name: 'Reviewer', role: 'Independent review', status: 'waiting' }
  ],
  activity: [
    { id: 'a1', timestamp: now(), kind: 'analysis', status: 'analyzing', actor: '@lnwjud', summary: 'Inspecting evidence', detail: 'Analyzing observable code and runtime state before the next action.' },
    { id: 'a2', timestamp: new Date(Date.now() - 55_000).toISOString(), kind: 'work', status: 'running', actor: '@lnwjud', summary: 'Executing work', detail: 'Running the next implementation step.' }
  ],
  git: { branch: 'dev', commit: 'demo', clean: true }
};

export class DemoWatcherTransport implements WatcherTransport {
  async getSnapshot(): Promise<WatcherSnapshot> { return { ...demoSnapshot, serverTime: now() }; }
  subscribe(onEvent: (event: ActivityEvent) => void, onState: (state: ConnectionState) => void): () => void {
    onState('demo');
    const timer = window.setInterval(() => onEvent({
      id: crypto.randomUUID(), timestamp: now(), kind: 'heartbeat', status: 'running', actor: '@lnwjud', summary: 'Runtime heartbeat', detail: 'Demo event stream is active.'
    }), 12_000);
    return () => window.clearInterval(timer);
  }
}
