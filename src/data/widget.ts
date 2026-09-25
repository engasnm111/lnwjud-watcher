import { Capacitor, registerPlugin } from '@capacitor/core';
import type { ConnectionState, WatcherSnapshot } from '../domain/models';

interface WatcherWidgetPlugin {
  update(options: { stateJson: string }): Promise<void>;
}

export interface WatcherWidgetState {
  schemaVersion: 1;
  generatedAt: string;
  instanceName: string;
  connectionState: ConnectionState;
  runtimeStatus: string;
  activeOperations: number;
  activeGoalCount: number;
  activeAgentCount: number;
  currentGoal: {
    title: string;
    task: string;
    project: string;
    completedMilestones: number;
    totalMilestones: number;
  } | null;
  agents: Array<{ name: string; task: string; project: string }>;
  lastActivity: {
    summary: string;
    actor: string;
    timestamp: string;
    project: string;
  } | null;
  lastSyncAt: string | null;
}

const NativeWidget = registerPlugin<WatcherWidgetPlugin>('WatcherWidget');

export function buildWidgetState(
  snapshot: WatcherSnapshot | null,
  connectionState: ConnectionState,
  lastSyncAt: string | null,
): WatcherWidgetState {
  const activeGoals = snapshot?.workspaces.flatMap((workspace) =>
    workspace.goals.map((goal) => ({ ...goal, workspaceName: goal.workspaceName ?? workspace.name }))
  ) ?? [];
  const currentGoal = snapshot?.goal ?? activeGoals[0] ?? null;
  const activeAgents = snapshot?.agents.filter((agent) =>
    agent.status === 'running' || agent.status === 'analyzing' || agent.status === 'verifying'
  ) ?? [];
  const lastActivity = snapshot?.activity[0] ?? null;
  const lastActivityProject = lastActivity?.workspaceId
    ? snapshot?.workspaces.find((workspace) => workspace.id === lastActivity.workspaceId)?.name ?? ''
    : '';

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    instanceName: snapshot?.instance.name ?? 'lnwjud Watcher',
    connectionState,
    runtimeStatus: snapshot?.runtime.status ?? 'offline',
    activeOperations: snapshot?.runtime.activeOperations ?? 0,
    activeGoalCount: activeGoals.length,
    activeAgentCount: activeAgents.length,
    currentGoal: currentGoal ? {
      title: currentGoal.key,
      task: currentGoal.currentTask,
      project: currentGoal.workspaceName ?? (
        currentGoal.workspaceId
          ? snapshot?.workspaces.find((workspace) => workspace.id === currentGoal.workspaceId)?.name ?? ''
          : ''
      ),
      completedMilestones: currentGoal.milestones.filter((milestone) => milestone.status === 'completed').length,
      totalMilestones: currentGoal.milestones.length,
    } : null,
    agents: activeAgents.slice(0, 3).map((agent) => ({
      name: agent.name,
      task: agent.task ?? '',
      project: agent.workspaceName ?? (
        agent.workspaceId
          ? snapshot?.workspaces.find((workspace) => workspace.id === agent.workspaceId)?.name ?? ''
          : ''
      ),
    })),
    lastActivity: lastActivity ? {
      summary: lastActivity.summary,
      actor: lastActivity.actor,
      timestamp: lastActivity.timestamp,
      project: lastActivityProject,
    } : null,
    lastSyncAt,
  };
}

export async function syncNativeWidgets(
  snapshot: WatcherSnapshot | null,
  connectionState: ConnectionState,
  lastSyncAt: string | null,
): Promise<void> {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return;
  try {
    await NativeWidget.update({
      stateJson: JSON.stringify(buildWidgetState(snapshot, connectionState, lastSyncAt)),
    });
  } catch {
    // Widgets are optional and must never break the main Watcher UI.
  }
}
