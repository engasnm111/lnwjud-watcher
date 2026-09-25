import { useWatcher } from '../../app/WatcherContext';
import StatusPill from '../../shared/StatusPill';
import { formatTime, goalProgress } from '../../shared/format';
import { useI18n } from '../../i18n/I18nContext';

export default function OverviewPage() {
  const { snapshot, state } = useWatcher();
  const { localeTag, t } = useI18n();
  if (!snapshot) return <div className="empty-card">{t('goal.loading')}</div>;
  const latest = snapshot.activity[0];
  const progress = goalProgress(snapshot.goal);

  return <div className="page-stack">
    <section className="hero-card live-card">
      <div className="section-title">
        <span>{t('overview.liveActivity')}</span>
        <span className={'connection-chip connection-' + state}>{state === 'connected' ? t('app.live') : state}</span>
      </div>
      {latest
        ? <>
            <div className="hero-status"><StatusPill status={latest.status}/><small>{formatTime(latest.timestamp, localeTag)}</small></div>
            <h2>{latest.summary}</h2>
            <p>{latest.detail ?? latest.actor}</p>
          </>
        : <p>{t('overview.noActivity')}</p>}
    </section>

    <section className="goal-card">
      <div className="goal-heading">
        <div><StatusPill status={snapshot.goal?.status ?? 'idle'}/><span className="muted">{t('overview.protocol', { version: snapshot.protocolVersion })}</span></div>
        <div className="progress-ring" style={{ '--progress': progress } as React.CSSProperties}>{progress}%</div>
      </div>
      <span className="eyebrow">{t('overview.currentGoal')}</span>
      <h2 className="break-anywhere">{snapshot.goal?.key ?? t('overview.noGoal')}</h2>
      <div className="progress-track"><span style={{ width: String(progress) + '%' }}/></div>
      <div className="metric-grid">
        <div><span>{t('overview.activeAgents')}</span><strong>{snapshot.agents.filter((agent) => !['idle','waiting','done'].includes(agent.status)).length}</strong></div>
        <div><span>{t('overview.blockers')}</span><strong>{snapshot.goal?.blockers.length ?? 0}</strong></div>
        <div><span>{t('overview.git')}</span><strong>{snapshot.git.clean ? t('overview.clean') : t('overview.dirty')}</strong></div>
        <div><span>{t('overview.branch')}</span><strong className="break-anywhere">{snapshot.git.branch}</strong></div>
      </div>
      {snapshot.goal?.currentTask && <div className="task-box"><span>{t('overview.currentTask')}</span><strong>{snapshot.goal.currentTask}</strong></div>}
    </section>

    <section>
      <div className="section-heading"><div><span className="eyebrow">{t('overview.recent')}</span><h2>{t('overview.timeline')}</h2></div></div>
      <div className="timeline">{snapshot.activity.slice(0, 4).map((event) =>
        <article className="timeline-card" key={event.id}>
          <div><StatusPill status={event.status}/><time>{formatTime(event.timestamp, localeTag)}</time></div>
          <strong>{event.summary}</strong><p>{event.detail ?? event.actor}</p>
        </article>)}</div>
    </section>

    <section>
      <div className="section-heading"><div><span className="eyebrow">{t('overview.team')}</span><h2>{t('overview.agentMatrix')}</h2></div></div>
      <div className="agent-grid">{snapshot.agents.map((agent) =>
        <article className="agent-card" key={agent.id}>
          <div className="agent-head"><div><strong>{agent.name}</strong><span>{agent.role}</span></div><StatusPill status={agent.status}/></div>
          <p>{agent.task ?? t('overview.noDelegatedTask')}</p>
        </article>)}</div>
    </section>
  </div>;
}
