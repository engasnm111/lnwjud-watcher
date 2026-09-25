import { useWatcher } from '../../app/WatcherContext';
import StatusPill from '../../shared/StatusPill';
import { useI18n } from '../../i18n/I18nContext';

export default function AgentsPage() {
  const { snapshot } = useWatcher();
  const { t } = useI18n();

  return <div className="page-stack">
    <div className="section-heading"><div><span className="eyebrow">{t('overview.team')}</span><h2>{t('overview.agentMatrix')}</h2></div></div>
    <div className="agent-grid">{snapshot?.agents.map((agent) =>
      <article className="agent-card" key={agent.id}>
        <div className="agent-head">
          <div className="agent-name"><span className="avatar">{agent.name.slice(0,1)}</span><div><strong>{agent.name}</strong><span>{agent.role}</span></div></div>
          <StatusPill status={agent.status}/>
        </div>
        <p>{agent.task ?? t('overview.noDelegatedTask')}</p>
      </article>) ?? <div className="empty-card">{t('agents.waiting')}</div>}</div>
  </div>;
}
