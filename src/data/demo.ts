import type { ActivityEvent, ConnectionState, Goal, WatcherSnapshot } from '../domain/models';
import type { WatcherTransport } from './transport';

const now = () => new Date().toISOString();

const runtimeGoal: Goal = {
  id: 'demo-runtime-goal',
  key: 'lnwjud-v5.6.1',
  status: 'running',
  currentTask: 'Harden Watcher multi-workspace snapshots and validate the release.',
  blockers: [],
  workspaceId: 'demo-lnwjud',
  workspaceName: 'lnwjud',
  milestones: [
    { id: 'r1', title: 'Multi-workspace protocol', status: 'completed' },
    { id: 'r2', title: 'Git diff scrolling', status: 'in_progress' },
    { id: 'r3', title: 'Release validation', status: 'pending' }
  ]
};

const watcherGoal: Goal = {
  id: 'demo-watcher-goal',
  key: 'lnwjud-watcher-v0.2.1',
  status: 'running',
  currentTask: 'Render every active project and durable goal without hiding parallel work.',
  blockers: [],
  workspaceId: 'demo-watcher',
  workspaceName: 'lnwjud-watcher',
  milestones: [
    { id: 'w1', title: 'Desktop/Web/Android/iOS distribution', status: 'completed' },
    { id: 'w2', title: 'Multi-goal UI', status: 'in_progress' },
    { id: 'w3', title: 'Release validation', status: 'pending' }
  ]
};

const watcherDocsGoal: Goal = {
  id: 'demo-watcher-docs',
  key: 'watcher-provider-guides',
  status: 'blocked',
  currentTask: 'Verify provider screenshots and final setup wording.',
  blockers: ['Waiting for provider verification evidence'],
  workspaceId: 'demo-watcher',
  workspaceName: 'lnwjud-watcher',
  milestones: [
    { id: 'd1', title: 'Provider guides', status: 'completed' },
    { id: 'd2', title: 'Final verification', status: 'blocked' }
  ]
};

export const demoSnapshot: WatcherSnapshot = {
  protocolVersion: 1,
  serverTime: now(),
  runtime: { version: '5.6.1 demo', status: 'running', activeOperations: 3 },
  instance: { id: 'demo-office-pc', name: 'OFFICE-PC', platform: 'windows' },
  goal: runtimeGoal,
  workspaces: [
    {
      id: 'demo-lnwjud',
      name: 'lnwjud',
      selected: true,
      activeOperations: 2,
      goals: [runtimeGoal],
      git: { branch: 'dev', commit: 'demo1234abcd', clean: false, changedFiles: 5, latestSubject: 'feat: support multi-workspace Watcher snapshots', latestAt: now() }
    },
    {
      id: 'demo-watcher',
      name: 'lnwjud-watcher',
      selected: false,
      activeOperations: 1,
      goals: [watcherGoal, watcherDocsGoal],
      git: { branch: 'dev', commit: 'demo5678efgh', clean: false, changedFiles: 8, latestSubject: 'feat: render parallel projects and goals', latestAt: now() }
    }
  ],
  agents: [
    { id: 'lnwjud:demo-lnwjud', name: '@lnwjud', role: 'Orchestrator', status: 'running', task: runtimeGoal.currentTask, workspaceId: 'demo-lnwjud', workspaceName: 'lnwjud' },
    { id: 'codex:demo-lnwjud', name: 'Codex', role: 'Implementation / Review', status: 'running', task: 'Reviewing runtime changes', workspaceId: 'demo-lnwjud', workspaceName: 'lnwjud' },
    { id: 'lnwjud:demo-watcher', name: '@lnwjud', role: 'Orchestrator', status: 'running', task: watcherGoal.currentTask, workspaceId: 'demo-watcher', workspaceName: 'lnwjud-watcher' }
  ],
  activity: [
    { id: 'a1', timestamp: now(), kind: 'analysis', status: 'analyzing', actor: '@lnwjud', summary: 'Inspecting parallel work', detail: 'Aggregating active goals across multiple projects.', workspaceId: 'demo-watcher' },
    { id: 'a2', timestamp: new Date(Date.now() - 55_000).toISOString(), kind: 'work', status: 'running', actor: '@lnwjud', summary: 'Fixing Git scrolling', detail: 'Removing nested clipping while preserving X/Y diff scrolling.', workspaceId: 'demo-lnwjud' }
  ],
  git: { branch: 'dev', commit: 'demo1234abcd', clean: false, changedFiles: 5, latestSubject: 'feat: support multi-workspace Watcher snapshots', latestAt: now() }
};

export class DemoWatcherTransport implements WatcherTransport {
  async getSnapshot(): Promise<WatcherSnapshot> { return { ...demoSnapshot, serverTime: now() }; }
  subscribe(onEvent: (event: ActivityEvent) => void, onState: (state: ConnectionState) => void): () => void {
    onState('demo');
    const timer = window.setInterval(() => onEvent({
      id: crypto.randomUUID(),
      timestamp: now(),
      kind: 'heartbeat',
      status: 'running',
      actor: '@lnwjud',
      summary: 'Runtime heartbeat',
      detail: 'Demo event stream is active.',
      workspaceId: 'demo-watcher'
    }), 12_000);
    return () => window.clearInterval(timer);
  }
}
