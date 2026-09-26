import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWatcher } from '../../app/WatcherContext';
import StatusMeta from '../../shared/StatusMeta';
import { workspaceName } from '../../shared/format';
import { useI18n } from '../../i18n/I18nContext';

export const ACTIVITY_PAGE_SIZE = 20;

export default function ActivityPage() {
  const { snapshot } = useWatcher();
  const { t } = useI18n();
  const activity = useMemo(() => snapshot?.activity ?? [], [snapshot?.activity]);
  const [visibleCount, setVisibleCount] = useState(ACTIVITY_PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const visibleActivity = useMemo(
    () => activity.slice(0, visibleCount),
    [activity, visibleCount],
  );
  const hasMore = visibleCount < activity.length;
  const loadMore = useCallback(
    () => setVisibleCount((current) => Math.min(current + ACTIVITY_PAGE_SIZE, activity.length)),
    [activity.length],
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
    {activity.length === 0
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
          <span>{t('activity.showing', { visible: visibleActivity.length, total: activity.length })}</span>
        </div>}
      </div>}
  </div>;
}
