import { useWatcher } from '../../app/WatcherContext';
import StatusPill from '../../shared/StatusPill';

export default function AgentsPage() {
  const { snapshot } = useWatcher();
  return <div className="page-stack">
    <div className="section-heading"><div><span className="eyebrow">TEAM</span><h2>Agent Matrix</h2></div></div>
    <div className="agent-grid">{snapshot?.agents.map(agent => <article className="agent-card" key={agent.id}><div className="agent-head"><div className="agent-name"><span className="avatar">{agent.name.slice(0,1)}</span><div><strong>{agent.name}</strong><span>{agent.role}</span></div></div><StatusPill status={agent.status}/></div><p>{agent.task ?? 'No active delegated task'}</p></article>) ?? <div className="empty-card">Waiting for agent state…</div>}</div>
  </div>;
}
