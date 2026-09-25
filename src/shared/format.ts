import type { Goal } from '../domain/models';

export function goalProgress(goal: Goal | null): number {
  if (!goal || goal.milestones.length === 0) return 0;
  const done = goal.milestones.filter((milestone) => milestone.status === 'completed').length;
  return Math.round((done / goal.milestones.length) * 100);
}

export function formatTime(value: string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(value));
}
