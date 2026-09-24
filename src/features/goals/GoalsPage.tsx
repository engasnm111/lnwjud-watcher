import { useWatcher } from '../../app/WatcherContext';
import StatusPill from '../../shared/StatusPill';
import { goalProgress } from '../../shared/format';

export default function GoalsPage() {
  const { snapshot } = useWatcher();
  const goal = snapshot?.goal;
  if (!goal) return <div className="empty-card">No active durable goal.</div>;
  return <div className="page-stack">
    <section className="goal-card">
      <div className="goal-heading"><StatusPill status={goal.status}/><div className="progress-ring">{goalProgress(goal)}%</div></div>
      <span className="eyebrow">DURABLE GOAL</span><h2>{goal.key}</h2><p>{goal.currentTask}</p>
      <div className="milestone-list">{goal.milestones.map(item => <div className="milestone" key={item.id}><span className={'milestone-mark milestone-' + item.status}/><div><strong>{item.title}</strong><small>{item.status.replace('_',' ')}</small></div></div>)}</div>
    </section>
    {goal.blockers.length > 0 && <section className="card"><h2>Blockers</h2>{goal.blockers.map(b => <p key={b}>{b}</p>)}</section>}
  </div>;
}
