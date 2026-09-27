import { ArrowLeft, GitBranch, GitCommitHorizontal, Layers3 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useWatcher } from '../../app/WatcherContext';
import { useI18n } from '../../i18n/I18nContext';
import { goalProgress } from '../../shared/format';
import GoalStatusPill from '../../shared/GoalStatusPill';
import StatusMeta from '../../shared/StatusMeta';

export default function ProjectDetailPage() {
  const { workspaceId } = useParams();
  const { snapshot } = useWatcher();
  const { t } = useI18n();
  const workspace = snapshot?.workspaces.find((item) => item.id === workspaceId);
  if (!workspace) return <div className="empty-card">{t('projects.notFound')} <Link to="/overview">{t('projects.back')}</Link></div>;
  const agents = snapshot?.agents.filter((agent) => agent.workspaceId === workspace.id) ?? [];
  const activity = snapshot?.activity.filter((event) => event.workspaceId === workspace.id).slice(0, 12) ?? [];

  return <div className="page-stack">
    <Link className="inline-link" to="/overview"><ArrowLeft size={16}/>{t('projects.back')}</Link>
    <div className="section-heading"><div><span className="eyebrow">{t('projects.kicker')}</span><h2 className="break-anywhere">{workspace.name}</h2></div></div>
    <section className="card project-detail-summary">
      <div className="metric-grid">
        <div><span>{t('projects.openGoals')}</span><strong>{workspace.goals.length}</strong></div>
        <div><span>{t('overview.activeOperations')}</span><strong>{workspace.activeOperations}</strong></div>
        <div><span>{t('overview.changedFiles')}</span><strong>{workspace.git.changedFiles}</strong></div>
        <div><span>{t('projects.agents')}</span><strong>{agents.length}</strong></div>
      </div>
      <div className="project-git-details"><span><GitBranch size={16}/>{workspace.git.branch || '—'}</span><span><GitCommitHorizontal size={16}/>{workspace.git.commit || '—'}</span><span>{workspace.git.clean ? t('overview.clean') : t('overview.dirty')}</span></div>
      {workspace.git.latestSubject && <p>{workspace.git.latestSubject}</p>}
    </section>
    <section>
      <div className="section-heading"><div><span className="eyebrow">{t('goal.durable')}</span><h3>{t('projects.goals')}</h3></div></div>
      {workspace.goals.length === 0 ? <div className="empty-card">{t('goal.empty')}</div> : <div className="workspace-goal-grid">{workspace.goals.map((goal) =>
        <article className="goal-card" key={goal.id}>
          <div className="goal-heading"><GoalStatusPill goal={goal}/><strong>{goalProgress(goal)}%</strong></div>
          <h3 className="break-anywhere">{goal.key}</h3>
          {goal.objective && <p>{goal.objective}</p>}
          {goal.currentPhase && <small>{t('projects.phase')}: {goal.currentPhase}</small>}
          {goal.currentTask && <p>{goal.currentTask}</p>}
          <div className="milestone-list">{goal.milestones.map((step) =>
            <div className="milestone" key={step.id}><span className={'milestone-mark milestone-' + step.status}/><div><strong>{step.title}</strong></div></div>)}</div>
          {goal.acceptanceCriteria && <div className="acceptance-list"><strong>{t('projects.acceptance')}</strong>{goal.acceptanceCriteria.map((criterion) =>
            <p key={criterion.id}><span className={'milestone-mark milestone-' + criterion.status}/>{criterion.title}</p>)}</div>}
          {goal.completionReady && <p className="goal-finalization-note">{t('goal.finalizationHelp')}</p>}
        </article>)}</div>}
    </section>
    <section>
      <div className="section-heading"><div><span className="eyebrow">{t('overview.team')}</span><h3>{t('projects.agents')}</h3></div></div>
      {agents.length === 0 ? <div className="empty-card">{t('overview.noDelegatedTask')}</div> : <div className="agent-grid">{agents.map((agent) =>
        <article className="agent-card" key={agent.id}><strong>{agent.name}</strong><small>{agent.role}</small><p>{agent.task ?? '—'}</p></article>)}</div>}
    </section>
    <section>
      <div className="section-heading"><div><span className="eyebrow">{t('overview.recent')}</span><h3>{t('overview.timeline')}</h3></div></div>
      {activity.length === 0 ? <div className="empty-card"><Layers3 size={20}/>{t('activity.waiting')}</div> : <div className="timeline">{activity.map((event) =>
        <article className="timeline-card" key={event.id}><StatusMeta status={event.status} timestamp={event.timestamp}/><strong>{event.summary}</strong><p>{event.detail ?? event.actor}</p></article>)}</div>}
    </section>
  </div>;
}
