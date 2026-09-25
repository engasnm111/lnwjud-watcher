import { useWatcher } from '../../app/WatcherContext';
import StatusPill from '../../shared/StatusPill';
import { goalProgress, snapshotWorkspaces } from '../../shared/format';
import { useI18n } from '../../i18n/I18nContext';
import type { MessageKey } from '../../i18n/messages';

export default function GoalsPage() {
  const { snapshot } = useWatcher();
  const { t } = useI18n();
  if (!snapshot) return <div className="empty-card">{t('goal.loading')}</div>;

  const workspaces = snapshotWorkspaces(snapshot).filter((workspace) => workspace.goals.length > 0);
  if (workspaces.length === 0) return <div className="empty-card">{t('goal.empty')}</div>;

  return <div className="page-stack">
    <div className="section-heading">
      <div><span className="eyebrow">{t('goal.all')}</span><h2>{t('goal.activeTitle')}</h2></div>
    </div>
    {workspaces.map((workspace) =>
      <section className="workspace-section" key={workspace.id}>
        <div className="workspace-section-head">
          <div>
            <span className="eyebrow">{t('overview.project')}</span>
            <h2 className="break-anywhere">{workspace.name}</h2>
          </div>
          <span className="project-chip">{t('goal.count', { count: workspace.goals.length })}</span>
        </div>
        <div className="workspace-goal-grid">{workspace.goals.map((goal) => {
          const progress = goalProgress(goal);
          return <article className="goal-card multi-goal-card" key={goal.id}>
            <div className="goal-heading">
              <StatusPill status={goal.status}/>
              <div className="progress-ring" style={{ '--progress': progress } as React.CSSProperties}>{progress}%</div>
            </div>
            <span className="eyebrow">{t('goal.durable')}</span>
            <h2 className="break-anywhere">{goal.key}</h2>
            <p>{goal.currentTask || t('overview.noDelegatedTask')}</p>
            <div className="milestone-list">{goal.milestones.map((item) =>
              <div className="milestone" key={item.id}>
                <span className={'milestone-mark milestone-' + item.status}/>
                <div><strong>{item.title}</strong><small>{t(('milestone.' + item.status) as MessageKey)}</small></div>
              </div>)}</div>
            {goal.blockers.length > 0 && <div className="goal-blockers">
              <strong>{t('goal.blockers')}</strong>
              {goal.blockers.map((blocker) => <p key={blocker}>{blocker}</p>)}
            </div>}
          </article>;
        })}</div>
      </section>)}
  </div>;
}
