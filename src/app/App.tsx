import { useEffect, useState } from 'react';
import { Activity, Bell, Bot, Gauge, HeartPulse, Home, Languages, RefreshCw, Settings } from 'lucide-react';
import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useWatcher } from './WatcherContext';
import { useI18n } from '../i18n/I18nContext';
import OverviewPage from '../features/overview/OverviewPage';
import GoalsPage from '../features/goals/GoalsPage';
import AgentsPage from '../features/agents/AgentsPage';
import ActivityPage from '../features/activity/ActivityPage';
import SettingsPage from '../features/settings/SettingsPage';
import OnboardingPage from '../features/onboarding/OnboardingPage';
import { formatRelativeTime, formatTime } from '../shared/format';
import type { MessageKey } from '../i18n/messages';
import UpdateGate from '../shared/UpdateGate';
import { connectionHelpKey } from '../shared/connectionHelp';
import AlertsPage from '../features/alerts/AlertsPage';
import ProjectDetailPage from '../features/projects/ProjectDetailPage';
import ConnectionHealthPage from '../features/connection/ConnectionHealthPage';

const nav = [
  { to: '/overview', key: 'nav.overview' as const, icon: Home },
  { to: '/goals', key: 'nav.goals' as const, icon: Gauge },
  { to: '/agents', key: 'nav.agents' as const, icon: Bot },
  { to: '/activity', key: 'nav.activity' as const, icon: Activity },
  { to: '/settings', key: 'nav.settings' as const, icon: Settings }
];

function Shell() {
  const watcher = useWatcher();
  const { locale, localeTag, setLocale, t } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!watcher.onboardingComplete) {
    return <Routes>
      <Route path="/onboarding" element={<OnboardingPage/>}/>
      <Route path="*" element={<Navigate to="/onboarding" replace/>}/>
    </Routes>;
  }

  const stateLabel = t(('connection.' + watcher.state) as MessageKey);
  const lastActivityAt = watcher.snapshot?.activity[0]?.timestamp;

  return <div className="app-shell">
    <aside className="sidebar">
      <NavLink className="brand" to="/overview" aria-label="lnwjud Watcher">
        <img src="./brand/lnwjud-watcher-mark.png" alt="" />
        <div><strong>lnwjud</strong><span>Watcher</span></div>
      </NavLink>
      <nav>{nav.map(({ to, key, icon: Icon }) =>
        <NavLink key={to} to={to}><Icon size={19}/><span>{t(key)}</span></NavLink>)}</nav>
      <div className="sidebar-state">
        <span className={'dot dot-' + watcher.state}/>
        <span>{stateLabel}</span>
      </div>
    </aside>

    <main className="content">
      <header className="topbar">
        <div className="topbar-title">
          <span className="eyebrow">{t('app.readOnly')}</span>
          <h1>{watcher.snapshot?.instance.name ?? 'lnwjud Watcher'}</h1>
          <div className="freshness">
            <span className={'dot dot-' + watcher.state}/>
            <span>{watcher.fallbackPolling ? t('app.fallback') : stateLabel}</span>
            <span>·</span>
            <span>{t('app.lastUpdated')}: {watcher.lastSyncAt ? formatTime(watcher.lastSyncAt, localeTag) : t('app.never')}</span>
          </div>
          <div className="activity-freshness">
            {lastActivityAt
              ? t('app.lastActivity', { time: formatTime(lastActivityAt, localeTag), age: formatRelativeTime(lastActivityAt, now, localeTag) })
              : t('app.noActivityYet')}
          </div>
        </div>
        <div className="topbar-actions">
          <NavLink className="icon-button topbar-link" to="/connection" aria-label={t('health.title')}><HeartPulse size={19}/></NavLink>
          <NavLink className="icon-button topbar-link notification-link" to="/alerts" aria-label={t('alerts.title')}><Bell size={19}/>{watcher.unreadAlertCount > 0 && <span className="notification-count">{watcher.unreadAlertCount}</span>}</NavLink>
          <button className="icon-button text-button" onClick={() => setLocale(locale === 'th' ? 'en' : 'th')} aria-label={t('settings.language')}>
            <Languages size={18}/><span>{locale === 'th' ? 'EN' : 'TH'}</span>
          </button>
          <button className="icon-button" onClick={() => void watcher.refresh()} aria-label={t('app.refresh')} disabled={watcher.refreshing}>
            <RefreshCw size={19} className={watcher.refreshing ? 'spin-once' : ''}/>
          </button>
        </div>
      </header>

      {watcher.fallbackPolling && <div className="degraded-banner">{t('connection.autoRefresh')}</div>}
      {watcher.error && <div className="error-banner" role="alert">
        <strong>{t('connection.problem')}</strong>{' '}
        <span>{t(connectionHelpKey(watcher.error))}</span>{' '}
        <NavLink to="/settings">{t('connection.openSettings')}</NavLink>
      </div>}

      <Routes>
        <Route path="/overview" element={<OverviewPage/>}/>
        <Route path="/goals" element={<GoalsPage/>}/>
        <Route path="/agents" element={<AgentsPage/>}/>
        <Route path="/activity" element={<ActivityPage/>}/>
        <Route path="/alerts" element={<AlertsPage/>}/>
        <Route path="/connection" element={<ConnectionHealthPage/>}/>
        <Route path="/projects/:workspaceId" element={<ProjectDetailPage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/onboarding" element={<Navigate to="/overview" replace/>}/>
        <Route path="*" element={<Navigate to="/overview" replace/>}/>
      </Routes>
    </main>

    <nav className="bottom-nav">{nav.map(({ to, key, icon: Icon }) =>
      <NavLink key={to} to={to}><Icon size={20}/><span>{t(key)}</span></NavLink>)}</nav>
  </div>;
}

export default function App() {
  return <UpdateGate><HashRouter><Shell/></HashRouter></UpdateGate>;
}
