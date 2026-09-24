import { useState } from 'react';
import { useWatcher } from '../../app/WatcherContext';
import type { ConnectionProfile, RemoteProvider } from '../../domain/models';

const providers: Array<{value: RemoteProvider; label: string}> = [
  { value:'local', label:'Local / LAN' }, { value:'zrok', label:'zrok' }, { value:'cloudflare', label:'Cloudflare Tunnel' },
  { value:'tailscale-serve', label:'Tailscale Serve' }, { value:'tailscale-funnel', label:'Tailscale Funnel' }, { value:'ngrok', label:'ngrok' }, { value:'custom', label:'Custom HTTPS URL' }
];

export default function SettingsPage() {
  const watcher = useWatcher();
  const [draft, setDraft] = useState<ConnectionProfile>(watcher.profile);
  const [token, setToken] = useState(watcher.token);
  const save = () => watcher.configure(draft, token);
  return <div className="page-stack">
    <section className="card settings-card">
      <span className="eyebrow">CONNECTION</span><h2>Watcher endpoint</h2><p className="muted">The watcher is read-only. Tunnel lifecycle stays on the lnwjud runtime.</p>
      <label>Mode<select value={draft.mode} onChange={e => setDraft({...draft, mode:e.target.value as ConnectionProfile['mode']})}><option value="demo">Demo</option><option value="remote">Remote runtime</option></select></label>
      <label>Name<input value={draft.name} onChange={e => setDraft({...draft,name:e.target.value})}/></label>
      <label>Access provider<select value={draft.provider} disabled={draft.mode==='demo'} onChange={e => setDraft({...draft,provider:e.target.value as RemoteProvider})}>{providers.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></label>
      <label>Endpoint<input type="url" placeholder="https://your-runtime.example" disabled={draft.mode==='demo'} value={draft.endpoint} onChange={e => setDraft({...draft,endpoint:e.target.value})}/></label>
      <label>Session token<input type="password" autoComplete="off" disabled={draft.mode==='demo'} value={token} onChange={e => setToken(e.target.value)}/><small>Session-only: never written to local storage.</small></label>
      <button className="primary-button" onClick={save}>Save & connect</button>
    </section>
    <section className="card"><span className="eyebrow">SECURITY</span><h2>Read-only by design</h2><p>No shell, filesystem mutation, MCP command, approval, pause/resume, or hidden model reasoning is exposed by Watcher Protocol v1.</p></section>
  </div>;
}
