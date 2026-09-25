import { useWatcher } from '../../app/WatcherContext';
import StatusPill from '../../shared/StatusPill';
import { goalProgress } from '../../shared/format';
import { useI18n } from '../../i18n/I18nContext';
import type { MessageKey } from '../../i18n/messages';

export default function GoalsPage() {
  const { snapshot } = useWatcher();
  const { t } = useI18n();
  const goal = snapshot?.goal;
  if (!goal) return <div className="empty-card">{t('goal.empty')}</div>;

  return <div className="page-stack">
    <section className="goal-card">
      <div className="goal-heading"><StatusPill status={goal.status}/><div className="progress-ring" style={{ '--progress': goalProgress(goal) } as React.CSSProperties}>{goalProgress(goal)}%</div></div>
      <span className="eyebrow">{t('goal.durable')}</span>
      <h2 className="break-anywhere">{goal.key}</h2>
      <p>{goal.currentTask}</p>
      <div className="milestone-list">{goal.milestones.map((item) =>
        <div className="milestone" key={item.id}>
          <span className={'milestone-mark milestone-' + item.status}/>
          <div><strong>{item.title}</strong><small>{t(('milestone.' + item.status) as MessageKey)}</small></div>
        </div>)}</div>
    </section>
    {goal.blockers.length > 0 && <section className="card"><h2>{t('goal.blockers')}</h2>{goal.blockers.map((blocker) => <p key={blocker}>{blocker}</p>)}</section>}
  </div>;
}
