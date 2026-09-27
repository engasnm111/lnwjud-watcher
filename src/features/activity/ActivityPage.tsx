import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWatcher } from '../../app/WatcherContext';
import StatusMeta from '../../shared/StatusMeta';
import { workspaceName } from '../../shared/format';
import { useI18n } from '../../i18n/I18nContext';
import { filterActivity, type ActivityFilters } from '../../domain/activityFilters';
import type { ObservableStatus } from '../../domain/models';

export const ACTIVITY_PAGE_SIZE = 20;

export default function ActivityPage() {
  const { snapshot } = useWatcher();
  const { t } = useI18n();
  const activity = useMemo(() => snapshot?.activity ?? [], [snapshot?.activity]);
  const [filters, setFilters] = useState<ActivityFilters>({ workspaceId: '', status: '', kind: '', query: '' });
  const filteredActivity = useMemo(() => filterActivity(activity, filters), [activity, filters]);
  const kinds = useMemo(() => [...new Set(activity.map((event) => event.kind))].sort(), [activity]);
  const [visibleCount, setVisibleCount] = useState(ACTIVITY_PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const visibleActivity = useMemo(
    () => filteredActivity.slice(0, visibleCount),
    [filteredActivity, visibleCount],
  );
  const hasMore = visibleCount < filteredActivity.length;
  const loadMore = useCallback(
    () => setVisibleCount((current) => Math.min(current + ACTIVITY_PAGE_SIZE, filteredActivity.length)),
    [filteredActivity.length],
  );

  useEffect(() => {
    if (!hasMore || typeof IntersectionObserver === 'undefined') return;
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadMore();
    }, { rootMargin: '320px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return <div className="page-stack activity-page">
    <div className="section-heading"><div><span className="eyebrow">{t('activity.observable')}</span><h2>{t('activity.title')}</h2></div></div>
    <div className="activity-filters card" aria-label={t('activity.filters')}>
      <label>{t('activity.projectFilter')}
        <select value={filters.workspaceId} onChange={(event) => { setFilters({ ...filters, workspaceId: event.target.value }); setVisibleCount(ACTIVITY_PAGE_SIZE); }}>
          <option value="">{t('activity.all')}</option>
          {snapshot?.workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}
        </select>
      </label>
      <label>{t('activity.statusFilter')}
        <select value={filters.status} onChange={(event) => { setFilters({ ...filters, status: event.target.value as ObservableStatus | '' }); setVisibleCount(ACTIVITY_PAGE_SIZE); }}>
          <option value="">{t('activity.all')}</option>
          {(['running', 'analyzing', 'verifying', 'waiting', 'blocked', 'idle', 'done', 'error'] as const).map((status) =>
            <option key={status} value={status}>{t(('status.' + status) as Parameters<typeof t>[0])}</option>)}
        </select>
      </label>
      <label>{t('activity.kindFilter')}
        <select value={filters.kind} onChange={(event) => { setFilters({ ...filters, kind: event.target.value }); setVisibleCount(ACTIVITY_PAGE_SIZE); }}>
          <option value="">{t('activity.all')}</option>
          {kinds.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
        </select>
      </label>
      <label>{t('activity.search')}
        <input type="search" value={filters.query} onChange={(event) => { setFilters({ ...filters, query: event.target.value }); setVisibleCount(ACTIVITY_PAGE_SIZE); }} placeholder={t('activity.searchPlaceholder')}/>
      </label>
    </div>
    <p className="muted">{t('activity.showing', { visible: Math.min(visibleCount, filteredActivity.length), total: filteredActivity.length })}</p>
    {filteredActivity.length === 0
      ? <div className="empty-card">{t('activity.waiting')}</div>
      : <div className="timeline">{visibleActivity.map((event) => {
          const project = snapshot ? workspaceName(snapshot, event.workspaceId) : undefined;
          return <article className="timeline-card" key={event.id}>
            <StatusMeta status={event.status} timestamp={event.timestamp} className="timeline-card-head"/>
            <div className="timeline-card-body">
              {project && <span className="project-chip project-chip-inline">{project}</span>}
              <strong className="timeline-card-title">{event.summary}</strong>
              <p className="timeline-card-detail">{event.detail ?? event.actor}</p>
              <small className="timeline-card-meta">{event.actor} · {event.kind}</small>
            </div>
          </article>;
        })}
        {hasMore && <div className="activity-load-more" ref={loadMoreRef}>
          <button type="button" onClick={loadMore}>{t('activity.more')}</button>
          <span>{t('activity.showing', { visible: visibleActivity.length, total: filteredActivity.length })}</span>
        </div>}
      </div>}
  </div>;
}
