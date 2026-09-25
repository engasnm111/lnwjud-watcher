import { z } from 'zod';
import type { ActivityEvent, WatcherSnapshot } from '../domain/models';

const isoDateTimeSchema = z.string().datetime({ offset: true });
const statusSchema = z.enum(['running', 'analyzing', 'verifying', 'waiting', 'blocked', 'idle', 'done', 'error']);
const milestoneSchema = z.object({ id: z.string(), title: z.string(), status: z.enum(['pending', 'in_progress', 'completed', 'blocked']) });
const goalSchema = z.object({
  id: z.string(),
  key: z.string(),
  status: statusSchema,
  currentTask: z.string(),
  blockers: z.array(z.string()),
  milestones: z.array(milestoneSchema),
  workspaceId: z.string().optional(),
  workspaceName: z.string().optional()
});
const agentSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  status: statusSchema,
  task: z.string().optional(),
  workspaceId: z.string().optional(),
  workspaceName: z.string().optional()
});
export const activityEventSchema = z.object({
  id: z.string(),
  timestamp: isoDateTimeSchema,
  kind: z.string(),
  status: statusSchema,
  actor: z.string(),
  summary: z.string(),
  detail: z.string().optional(),
  workspaceId: z.string().optional()
});
const gitSchema = z.object({
  branch: z.string(),
  commit: z.string(),
  clean: z.boolean(),
  changedFiles: z.number().int().nonnegative().default(0),
  latestSubject: z.string().optional(),
  latestAt: isoDateTimeSchema.optional()
});
const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  selected: z.boolean().default(false),
  activeOperations: z.number().int().nonnegative().default(0),
  goals: z.array(goalSchema),
  git: gitSchema
});
export const snapshotSchema = z.object({
  protocolVersion: z.literal(1),
  serverTime: isoDateTimeSchema,
  runtime: z.object({ version: z.string(), status: statusSchema, activeOperations: z.number().int().nonnegative().default(0) }),
  instance: z.object({ id: z.string(), name: z.string(), platform: z.enum(['windows', 'macos', 'linux', 'unknown']) }),
  goal: goalSchema.nullable(),
  workspaces: z.array(workspaceSchema).default([]),
  agents: z.array(agentSchema),
  activity: z.array(activityEventSchema),
  git: gitSchema
});

function normalizeObservableWork(snapshot: WatcherSnapshot): WatcherSnapshot {
  const workspaceOperations = new Map(snapshot.workspaces.map((workspace) => [workspace.id, workspace.activeOperations]));
  const workspaces = snapshot.workspaces.map((workspace) => ({
    ...workspace,
    goals: workspace.goals.map((goal) => (
      goal.status === 'running' && workspace.activeOperations === 0
        ? { ...goal, status: 'waiting' as const }
        : goal
    ))
  }));
  const goalWorkspaceOperations = snapshot.goal?.workspaceId === undefined
    ? snapshot.workspaces.find((workspace) => workspace.goals.some((goal) => goal.id === snapshot.goal?.id))?.activeOperations
    : workspaceOperations.get(snapshot.goal.workspaceId);
  const goal = snapshot.goal?.status === 'running' && (goalWorkspaceOperations ?? snapshot.runtime.activeOperations) === 0
    ? { ...snapshot.goal, status: 'waiting' as const }
    : snapshot.goal;
  const agents = snapshot.agents.map((agent) => {
    if (agent.status !== 'running') return agent;
    const activeOperations = agent.workspaceId === undefined
      ? snapshot.runtime.activeOperations
      : workspaceOperations.get(agent.workspaceId) ?? 0;
    return activeOperations === 0 ? { ...agent, status: 'idle' as const } : agent;
  });
  const runtime = snapshot.runtime.status === 'running' && snapshot.runtime.activeOperations === 0
    ? { ...snapshot.runtime, status: 'idle' as const }
    : snapshot.runtime;
  return { ...snapshot, runtime, goal, workspaces, agents };
}

export function parseSnapshot(input: unknown): WatcherSnapshot {
  return normalizeObservableWork(snapshotSchema.parse(input));
}

export function parseActivityEvent(input: unknown): ActivityEvent {
  return activityEventSchema.parse(input);
}
