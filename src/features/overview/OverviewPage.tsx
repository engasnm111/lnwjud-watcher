import { useWatcher } from '../../app/WatcherContext';
import StatusPill from '../../shared/StatusPill';
import { formatTime, goalProgress } from '../../shared/format';

export default function OverviewPage() {
  const { snapshot, state } = useWatcher();
  if (!snapshot) return <div className="empty-card">Loading watcher state…</div>;
  const latest = snapshot.activity[0];
  const progress = goalProgress(snapshot.goal);
  return <div className="page-stack">
    <section className="hero-card">
      <div className="section-title"><span>LIVE ACTIVITY</span><span className="connection-chip">{state}</span></div>
      {latest ? <><div className="hero-status"><StatusPill status={latest.status}/><small>{formatTime(latest.timestamp)}</small></div><h2>{latest.summary}</h2><p>{latest.detail ?? latest.actor}</p></> : <p>No observable activity yet.</p>}
    </section>
    <section className="goal-card">
      <div className="goal-heading"><div><StatusPill status={snapshot.goal?.status ?? 'idle'}/><span className="muted">Protocol v{snapshot.protocolVersion}</span></div><div className="progress-ring">{progress}%</div></div>
      <span className="eyebrow">CURRENT GOAL</span><h2>{snapshot.goal?.key ?? 'No active goal'}</h2>
      <div className="progress-track"><span style={{ width: String(progress) + '%' }}/></div>
      <div className="metric-grid"><div><span>Active agents</span><strong>{snapshot.agents.filter(a => !['idle','waiting','done'].includes(a.status)).length}</strong></div><div><span>Blockers</span><strong>{snapshot.goal?.blockers.length ?? 0}</strong></div><div><span>Git</span><strong>{snapshot.git.clean ? 'CLEAN' : 'DIRTY'}</strong></div><div><span>Branch</span><strong>{snapshot.git.branch}</strong></div></div>
      {snapshot.goal?.currentTask && <div className="task-box"><span>Current task</span><strong>{snapshot.goal.currentTask}</strong></div>}
    </section>
    <section><div className="section-heading"><div><span className="eyebrow">RECENT</span><h2>Activity Timeline</h2></div></div><div className="timeline">{snapshot.activity.slice(0,4).map(event => <article className="timeline-card" key={event.id}><div><StatusPill status={event.status}/><time>{formatTime(event.timestamp)}</time></div><strong>{event.summary}</strong><p>{event.detail ?? event.actor}</p></article>)}</div></section>
    <section><div className="section-heading"><div><span className="eyebrow">TEAM</span><h2>Agent Matrix</h2></div></div><div className="agent-grid">{snapshot.agents.map(agent => <article className="agent-card" key={agent.id}><div className="agent-head"><div><strong>{agent.name}</strong><span>{agent.role}</span></div><StatusPill status={agent.status}/></div><p>{agent.task ?? 'No active delegated task'}</p></article>)}</div></section>
  </div>;
}
