import { Bell, Check, CircleAlert, CircleCheck, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWatcher } from '../../app/WatcherContext';
import { useI18n } from '../../i18n/I18nContext';
import { formatTime } from '../../shared/format';
import type { WatcherAlert } from '../../domain/alerts';

function alertDescription(alert: WatcherAlert, t: ReturnType<typeof useI18n>['t']): string {
  if (alert.kind === 'connection') return t('alerts.connectionBody');
  if (alert.kind === 'goal_ready') return t('alerts.readyBody');
  if (alert.kind === 'goal_blocked') return t('alerts.blockedBody');
  return t('alerts.stalledBody');
}

export default function AlertsPage() {
  const watcher = useWatcher();
  const { t, localeTag } = useI18n();
  return <div className="page-stack">
    <div className="section-heading"><div><span className="eyebrow">{t('alerts.kicker')}</span><h2>{t('alerts.title')}</h2></div></div>
    <p className="section-help">{t('alerts.help')}</p>
    {watcher.alerts.length === 0
      ? <div className="empty-card"><CircleCheck size={30}/><p>{t('alerts.empty')}</p></div>
      : <div className="alert-list">{watcher.alerts.map((alert) => {
          const read = watcher.readAlertIds.includes(alert.id);
          const Icon = alert.kind === 'connection' ? WifiOff : alert.severity === 'warning' ? CircleAlert : Bell;
          return <article className={'card alert-card' + (read ? ' alert-read' : '')} key={alert.id}>
            <div className="alert-icon"><Icon size={22}/></div>
            <div className="alert-content">
              <div className="alert-title-line"><strong>{t(('alerts.' + alert.kind) as Parameters<typeof t>[0])}</strong>{!read && <span className="alert-unread">{t('alerts.unread')}</span>}</div>
              {alert.goalKey && <p className="break-anywhere"><strong>{alert.goalKey}</strong>{alert.workspaceName ? ` · ${alert.workspaceName}` : ''}</p>}
              <p>{alertDescription(alert, t)}</p>
              <small>{formatTime(alert.since, localeTag)}</small>
              <div className="alert-actions">
                {alert.workspaceId && <Link to={`/projects/${encodeURIComponent(alert.workspaceId)}`} className="secondary-button">{t('alerts.openProject')}</Link>}
                {alert.kind === 'connection' && <Link to="/connection" className="secondary-button">{t('alerts.openHealth')}</Link>}
                {!read && <button type="button" className="secondary-button" onClick={() => watcher.markAlertRead(alert.id)}><Check size={16}/>{t('alerts.markRead')}</button>}
              </div>
            </div>
          </article>;
        })}</div>}
  </div>;
}
