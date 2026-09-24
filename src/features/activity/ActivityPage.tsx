import { useWatcher } from '../../app/WatcherContext';
import StatusPill from '../../shared/StatusPill';
import { formatTime } from '../../shared/format';

export default function ActivityPage() {
  const { snapshot } = useWatcher();
  return <div className="page-stack">
    <div className="section-heading"><div><span className="eyebrow">OBSERVABLE EVENTS</span><h2>Activity</h2></div></div>
    <div className="timeline">{snapshot?.activity.map(event => <article className="timeline-card" key={event.id}><div><StatusPill status={event.status}/><time>{formatTime(event.timestamp)}</time></div><strong>{event.summary}</strong><p>{event.detail ?? event.actor}</p><small>{event.actor} · {event.kind}</small></article>) ?? <div className="empty-card">Waiting for events…</div>}</div>
  </div>;
}
