import { useWatcher } from '../../app/WatcherContext';
import StatusPill from '../../shared/StatusPill';
import { formatTime, workspaceName } from '../../shared/format';
import { useI18n } from '../../i18n/I18nContext';

export default function ActivityPage() {
  const { snapshot } = useWatcher();
  const { localeTag, t } = useI18n();

  return <div className="page-stack">
    <div className="section-heading"><div><span className="eyebrow">{t('activity.observable')}</span><h2>{t('activity.title')}</h2></div></div>
    <div className="timeline">{snapshot?.activity.map((event) => {
      const project = workspaceName(snapshot, event.workspaceId);
      return <article className="timeline-card" key={event.id}>
        <div><StatusPill status={event.status}/><time>{formatTime(event.timestamp, localeTag)}</time></div>
        {project && <span className="project-chip project-chip-inline">{project}</span>}
        <strong>{event.summary}</strong><p>{event.detail ?? event.actor}</p><small>{event.actor} · {event.kind}</small>
      </article>;
    }) ?? <div className="empty-card">{t('activity.waiting')}</div>}</div>
  </div>;
}
