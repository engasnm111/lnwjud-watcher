import { Activity, ArrowLeft, RefreshCw, Server, Wifi, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useWatcher } from '../../app/WatcherContext';
import { useI18n } from '../../i18n/I18nContext';
import { formatRelativeTime, formatTime } from '../../shared/format';
import { connectionHelpKey } from '../../shared/connectionHelp';
import type { MessageKey } from '../../i18n/messages';

function endpointLabel(value: string): string {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch { return '—'; }
}

export default function ConnectionHealthPage() {
  const watcher = useWatcher();
  const { t, localeTag } = useI18n();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, []);
  const connected = watcher.state === 'connected' || watcher.state === 'demo';
  const lastActivity = watcher.snapshot?.activity[0]?.timestamp;
  return <div className="page-stack">
    <Link className="inline-link" to="/overview"><ArrowLeft size={16}/>{t('projects.back')}</Link>
    <div className="section-heading"><div><span className="eyebrow">{t('health.kicker')}</span><h2>{t('health.title')}</h2></div></div>
    <section className="card health-hero">
      {connected ? <Wifi size={30}/> : <WifiOff size={30}/>}
      <div><strong>{t(('connection.' + watcher.state) as MessageKey)}</strong><p>{watcher.profile.mode === 'demo' ? t('health.demo') : watcher.fallbackPolling ? t('health.fallback') : t('health.realtime')}</p></div>
      <button type="button" className="secondary-button" onClick={() => void watcher.refresh()} disabled={watcher.refreshing}><RefreshCw size={16}/>{t('app.refresh')}</button>
    </section>
    <div className="health-grid">
      <section className="card"><Server size={22}/><span className="eyebrow">{t('health.runtime')}</span><strong>{watcher.snapshot?.runtime.version ?? '—'}</strong><small>{watcher.snapshot?.instance.name ?? watcher.profile.name}</small></section>
      <section className="card"><Activity size={22}/><span className="eyebrow">{t('health.lastSync')}</span><strong>{watcher.lastSyncAt ? formatTime(watcher.lastSyncAt, localeTag) : t('app.never')}</strong><small>{watcher.lastSyncAt ? formatRelativeTime(watcher.lastSyncAt, now, localeTag) : '—'}</small></section>
      <section className="card"><Activity size={22}/><span className="eyebrow">{t('health.lastWork')}</span><strong>{lastActivity ? formatTime(lastActivity, localeTag) : t('app.never')}</strong><small>{lastActivity ? formatRelativeTime(lastActivity, now, localeTag) : '—'}</small></section>
      <section className="card"><Server size={22}/><span className="eyebrow">{t('health.protocol')}</span><strong>{watcher.snapshot ? `v${watcher.snapshot.protocolVersion}` : '—'}</strong><small>{watcher.profile.provider}</small></section>
    </div>
    <section className="card health-details"><h3>{t('health.connection')}</h3><dl><dt>{t('settings.endpoint')}</dt><dd className="break-anywhere">{watcher.profile.mode === 'demo' ? '—' : endpointLabel(watcher.profile.endpoint)}</dd><dt>{t('settings.mode')}</dt><dd>{watcher.profile.mode}</dd><dt>{t('health.transport')}</dt><dd>{watcher.profile.mode === 'demo' ? t('health.demoTransport') : watcher.fallbackPolling ? t('health.polling') : t('health.websocket')}</dd></dl></section>
    {watcher.error && <div className="error-banner" role="alert"><strong>{t('connection.problem')}</strong><p>{t(connectionHelpKey(watcher.error))}</p><Link to="/settings">{t('connection.openSettings')}</Link></div>}
  </div>;
}
