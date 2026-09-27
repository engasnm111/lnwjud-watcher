import type { ActivityEvent, ObservableStatus } from './models';

export interface ActivityFilters {
  workspaceId: string;
  status: ObservableStatus | '';
  kind: string;
  query: string;
}

export function filterActivity(events: readonly ActivityEvent[], filters: ActivityFilters): ActivityEvent[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return events.filter((event) => (
    (filters.workspaceId === '' || event.workspaceId === filters.workspaceId)
    && (filters.status === '' || event.status === filters.status)
    && (filters.kind === '' || event.kind === filters.kind)
    && (query === '' || [event.summary, event.detail, event.actor, event.kind].some((text) => text?.toLocaleLowerCase().includes(query)))
  ));
}
