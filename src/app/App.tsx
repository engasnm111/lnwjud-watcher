import { Activity, Bot, Gauge, Home, Settings } from 'lucide-react';
import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useWatcher } from './WatcherContext';
import OverviewPage from '../features/overview/OverviewPage';
import GoalsPage from '../features/goals/GoalsPage';
import AgentsPage from '../features/agents/AgentsPage';
import ActivityPage from '../features/activity/ActivityPage';
import SettingsPage from '../features/settings/SettingsPage';

const nav = [
  { to: '/overview', label: 'Overview', icon: Home },
  { to: '/goals', label: 'Goals', icon: Gauge },
  { to: '/agents', label: 'Agents', icon: Bot },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings }
];

function Shell() {
  const { snapshot, state, error, refresh } = useWatcher();
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><img src="/icon.svg" alt="" /><div><strong>LNWJUD</strong><span>Watcher</span></div></div>
      <nav>{nav.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}><Icon size={20}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-state"><span className={'dot dot-' + state}/>{state}</div>
    </aside>
    <main className="content">
      <header className="topbar">
        <div><span className="eyebrow">READ-ONLY CONTROL CENTER</span><h1>{snapshot?.instance.name ?? 'LNWJUD Watcher'}</h1></div>
        <button className="icon-button" onClick={() => void refresh()} aria-label="Refresh">↻</button>
      </header>
      {error && <div className="error-banner">{error}</div>}
      <Routes>
        <Route path="/overview" element={<OverviewPage/>}/>
        <Route path="/goals" element={<GoalsPage/>}/>
        <Route path="/agents" element={<AgentsPage/>}/>
        <Route path="/activity" element={<ActivityPage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="*" element={<Navigate to="/overview" replace/>}/>
      </Routes>
    </main>
    <nav className="bottom-nav">{nav.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}><Icon size={21}/><span>{label}</span></NavLink>)}</nav>
  </div>;
}

export default function App() { return <HashRouter><Shell/></HashRouter>; }
