import { useWatcher } from '../../app/WatcherContext';
import StatusPill from '../../shared/StatusPill';
import { formatTime, goalProgress, snapshotGoals, snapshotWorkspaces, workspaceName } from '../../shared/format';
import { useI18n } from '../../i18n/I18nContext';

export default function OverviewPage() {
  const { snapshot, state } = useWatcher();
  const { localeTag, t } = useI18n();
  if (!snapshot) return <div className="empty-card">{t('goal.loading')}</div>;

  const latest = snapshot.activity[0];
  const workspaces = snapshotWorkspaces(snapshot);
  const goals = snapshotGoals(snapshot);
  const activeProjects = workspaces.filter((workspace) => workspace.goals.length > 0 || workspace.activeOperations > 0).length;
  const activeAgents = snapshot.agents.filter((agent) => !['idle','waiting','done'].includes(agent.status)).length;
  const blockers = goals.reduce((count, goal) => count + goal.blockers.length, 0);

  return <div className="page-stack">
    <section className="hero-card live-card">
      <div className="section-title">
        <span>{t('overview.liveActivity')}</span>
        <span className={'connection-chip connection-' + state}>{state === 'connected' ? t('app.live') : state}</span>
      </div>
      {latest
        ? <>
            <div className="hero-status"><StatusPill status={latest.status}/><small>{formatTime(latest.timestamp, localeTag)}</small></div>
            {workspaceName(snapshot, latest.workspaceId) && <span className="project-chip project-chip-inline">{workspaceName(snapshot, latest.workspaceId)}</span>}
            <h2>{latest.summary}</h2>
            <p>{latest.detail ?? latest.actor}</p>
          </>
        : <p>{t('overview.noActivity')}</p>}
    </section>

    <section className="goal-card overview-summary-card">
      <div className="goal-heading">
        <div><StatusPill status={snapshot.runtime.status}/><span className="muted">{t('overview.protocol', { version: snapshot.protocolVersion })}</span></div>
      </div>
      <span className="eyebrow">{t('overview.parallelWork')}</span>
      <h2>{t('overview.parallelWorkTitle')}</h2>
      <div className="metric-grid">
        <div><span>{t('overview.activeProjects')}</span><strong>{activeProjects}</strong></div>
        <div><span>{t('overview.activeGoals')}</span><strong>{goals.length}</strong></div>
        <div><span>{t('overview.activeAgents')}</span><strong>{activeAgents}</strong></div>
        <div><span>{t('overview.activeOperations')}</span><strong>{snapshot.runtime.activeOperations}</strong></div>
        <div><span>{t('overview.blockers')}</span><strong>{blockers}</strong></div>
      </div>
    </section>

    <section>
      <div className="section-heading"><div><span className="eyebrow">{t('overview.projects')}</span><h2>{t('overview.projectWork')}</h2></div></div>
      <div className="workspace-grid">{workspaces.map((workspace) =>
        <article className={'workspace-card' + (workspace.selected ? ' workspace-card-selected' : '')} key={workspace.id}>
          <div className="workspace-card-head">
            <div><span className="eyebrow">{t('overview.project')}</span><strong className="break-anywhere">{workspace.name}</strong></div>
            {workspace.selected && <span className="project-chip">{t('overview.selectedProject')}</span>}
          </div>
          <div className="workspace-metrics">
            <div><span>{t('overview.activeGoals')}</span><strong>{workspace.goals.length}</strong></div>
            <div><span>{t('overview.activeOperations')}</span><strong>{workspace.activeOperations}</strong></div>
            <div><span>{t('overview.changedFiles')}</span><strong>{workspace.git.changedFiles}</strong></div>
          </div>
          <div className="workspace-git-line">
            <span>{t('overview.git')}</span>
            <strong>{workspace.git.clean ? t('overview.clean') : t('overview.dirty')}</strong>
            <code>{workspace.git.branch || '—'}</code>
            <code>{workspace.git.commit || '—'}</code>
          </div>
          {workspace.goals.length > 0
            ? <div className="workspace-goal-preview">{workspace.goals.slice(0, 3).map((goal) =>
                <div className="workspace-goal-row" key={goal.id}>
                  <div><StatusPill status={goal.status}/><strong className="break-anywhere">{goal.key}</strong></div>
                  <div className="workspace-progress"><span style={{ width: String(goalProgress(goal)) + '%' }}/></div>
                  {goal.currentTask && <small>{goal.currentTask}</small>}
                </div>)}
                {workspace.goals.length > 3 && <small className="muted">{t('overview.moreGoals', { count: workspace.goals.length - 3 })}</small>}
              </div>
            : <p className="muted workspace-empty">{t('overview.noProjectGoals')}</p>}
          {workspace.git.latestSubject && <div className="workspace-latest-commit">
            <span>{t('overview.latestCommit')}</span>
            <strong>{workspace.git.latestSubject}</strong>
            {workspace.git.latestAt && <small>{formatTime(workspace.git.latestAt, localeTag)}</small>}
          </div>}
        </article>)}</div>
    </section>

    <section>
      <div className="section-heading"><div><span className="eyebrow">{t('overview.recent')}</span><h2>{t('overview.timeline')}</h2></div></div>
      <div className="timeline">{snapshot.activity.slice(0, 6).map((event) =>
        <article className="timeline-card" key={event.id}>
          <div><StatusPill status={event.status}/><time>{formatTime(event.timestamp, localeTag)}</time></div>
          {workspaceName(snapshot, event.workspaceId) && <span className="project-chip project-chip-inline">{workspaceName(snapshot, event.workspaceId)}</span>}
          <strong>{event.summary}</strong><p>{event.detail ?? event.actor}</p>
        </article>)}</div>
    </section>

    <section>
      <div className="section-heading"><div><span className="eyebrow">{t('overview.team')}</span><h2>{t('overview.agentMatrix')}</h2></div></div>
      <p className="section-help">{t('overview.agentHelp')}</p>
      <div className="agent-grid">{snapshot.agents.map((agent) =>
        <article className="agent-card" key={agent.id}>
          <div className="agent-head"><div><strong>{agent.name}</strong><span>{agent.role}</span></div><StatusPill status={agent.status}/></div>
          {(agent.workspaceName ?? workspaceName(snapshot, agent.workspaceId)) && <span className="project-chip project-chip-inline">{agent.workspaceName ?? workspaceName(snapshot, agent.workspaceId)}</span>}
          <p>{agent.task ?? t('overview.noDelegatedTask')}</p>
        </article>)}</div>
    </section>
  </div>;
}
