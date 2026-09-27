import type { Goal } from '../domain/models';

/** Milestone progress is not the runtime's terminal goal status. */
export function goalNeedsFinalization(goal: Goal): boolean {
  return (goal.status === 'running' || goal.status === 'waiting' || goal.status === 'idle')
    && goal.blockers.length === 0
    && goal.milestones.length > 0
    && goal.milestones.every((milestone) => milestone.status === 'completed');
}
