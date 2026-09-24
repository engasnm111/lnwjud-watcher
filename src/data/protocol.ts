import { z } from 'zod';
import type { ActivityEvent, WatcherSnapshot } from '../domain/models';

const statusSchema = z.enum(['running', 'analyzing', 'verifying', 'waiting', 'blocked', 'idle', 'done', 'error']);
const milestoneSchema = z.object({ id: z.string(), title: z.string(), status: z.enum(['pending', 'in_progress', 'completed', 'blocked']) });
const goalSchema = z.object({
  id: z.string(), key: z.string(), status: statusSchema, currentTask: z.string(), blockers: z.array(z.string()), milestones: z.array(milestoneSchema)
});
const agentSchema = z.object({ id: z.string(), name: z.string(), role: z.string(), status: statusSchema, task: z.string().optional() });
export const activityEventSchema = z.object({
  id: z.string(), timestamp: z.string().datetime(), kind: z.string(), status: statusSchema, actor: z.string(), summary: z.string(), detail: z.string().optional()
});
export const snapshotSchema = z.object({
  protocolVersion: z.literal(1),
  serverTime: z.string().datetime(),
  runtime: z.object({ version: z.string(), status: statusSchema }),
  instance: z.object({ id: z.string(), name: z.string(), platform: z.enum(['windows', 'macos', 'linux', 'unknown']) }),
  goal: goalSchema.nullable(),
  agents: z.array(agentSchema),
  activity: z.array(activityEventSchema),
  git: z.object({ branch: z.string(), commit: z.string(), clean: z.boolean() })
});

export function parseSnapshot(input: unknown): WatcherSnapshot {
  return snapshotSchema.parse(input);
}

export function parseActivityEvent(input: unknown): ActivityEvent {
  return activityEventSchema.parse(input);
}
