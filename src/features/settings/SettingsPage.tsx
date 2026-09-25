import { useState } from 'react';
import { ExternalLink, Languages, ShieldCheck } from 'lucide-react';
import { useWatcher } from '../../app/WatcherContext';
import { useI18n } from '../../i18n/I18nContext';
import type { ConnectionProfile, RemoteProvider } from '../../domain/models';
import type { MessageKey } from '../../i18n/messages';
import { providerGuides } from '../../data/providers';
import SessionTokenHelp from '../../shared/SessionTokenHelp';

const providers: RemoteProvider[] = [
  'local',
  'zrok',
  'cloudflare',
  'tailscale-serve',
  'tailscale-funnel',
  'ngrok',
  'custom'
];

export default function SettingsPage() {
  const watcher = useWatcher();
  const { locale, setLocale, t } = useI18n();
  const [draft, setDraft] = useState<ConnectionProfile>(watcher.profile);
  const [token, setToken] = useState(watcher.token);
  const [copied, setCopied] = useState<'windows' | 'unix' | null>(null);
  const guide = providerGuides[draft.provider];

  const save = () => watcher.configure(draft, token);

  const copy = async (kind: 'windows' | 'unix', command?: string) => {
    if (!command) return;
    await navigator.clipboard.writeText(command);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return <div className="page-stack settings-layout">
    <section className="card settings-card">
      <span className="eyebrow">{t('settings.connection')}</span>
      <h2>{t('settings.endpointTitle')}</h2>
      <p className="muted">{t('settings.endpointHelp')}</p>

      <label>{t('settings.mode')}
        <select value={draft.mode} onChange={(event) => setDraft({ ...draft, mode: event.target.value as ConnectionProfile['mode'] })}>
          <option value="demo">{t('settings.demo')}</option>
          <option value="remote">{t('settings.remote')}</option>
        </select>
      </label>

      <label>{t('settings.name')}
        <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })}/>
      </label>

      <label>{t('settings.provider')}
        <select value={draft.provider} disabled={draft.mode === 'demo'} onChange={(event) => setDraft({ ...draft, provider: event.target.value as RemoteProvider })}>
          {providers.map((provider) => <option key={provider} value={provider}>{t(('provider.' + provider) as MessageKey)}</option>)}
        </select>
      </label>

      <label>{t('settings.endpoint')}
        <input type="url" autoCapitalize="none" autoCorrect="off" placeholder="https://your-runtime.example" disabled={draft.mode === 'demo'} value={draft.endpoint} onChange={(event) => setDraft({ ...draft, endpoint: event.target.value })}/>
      </label>

      <label>{t('settings.token')}
        <input type="password" autoComplete="off" disabled={draft.mode === 'demo'} value={token} onChange={(event) => setToken(event.target.value)}/>
        <small>{t('settings.tokenHelp')}</small>
      </label>
      {draft.mode !== 'demo' && <SessionTokenHelp/>}

      <button className="primary-button" onClick={save}>{t('settings.save')}</button>
    </section>

    <section className="card guide-card">
      <span className="eyebrow">{t('settings.providerGuide')}</span>
      <h2>{t(('provider.' + draft.provider) as MessageKey)}</h2>
      <p>{t(('provider.' + draft.provider + 'Help') as MessageKey)}</p>

      {draft.mode !== 'demo' && <>
        {guide.windowsCommand && <div className="command-box">
          <div><strong>Windows</strong><span>PowerShell</span></div>
          <code>{guide.windowsCommand}</code>
          <button className="secondary-button" onClick={() => void copy('windows', guide.windowsCommand)}>{copied === 'windows' ? t('settings.copied') : t('settings.copyCommand')}</button>
        </div>}
        {guide.unixCommand && <div className="command-box">
          <div><strong>macOS / Linux</strong><span>Terminal</span></div>
          <code>{guide.unixCommand}</code>
          <button className="secondary-button" onClick={() => void copy('unix', guide.unixCommand)}>{copied === 'unix' ? t('settings.copied') : t('settings.copyCommand')}</button>
        </div>}
      </>}

      <a className="secondary-button link-button" href={guide.docsUrl} target="_blank" rel="noreferrer">
        {t('settings.openDocs')}<ExternalLink size={16}/>
      </a>
    </section>

    <section className="card settings-card">
      <span className="eyebrow">{t('settings.language')}</span>
      <div className="inline-choice">
        <Languages size={20}/>
        <button className={locale === 'th' ? 'provider-pill active' : 'provider-pill'} onClick={() => setLocale('th')}>ไทย</button>
        <button className={locale === 'en' ? 'provider-pill active' : 'provider-pill'} onClick={() => setLocale('en')}>English</button>
      </div>
    </section>

    <section className="card security-card">
      <ShieldCheck size={28}/>
      <div><span className="eyebrow">{t('settings.security')}</span><h2>{t('settings.securityTitle')}</h2><p>{t('settings.securityCopy')}</p></div>
    </section>
  </div>;
}
