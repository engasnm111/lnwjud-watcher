import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Globe2, LockKeyhole, MonitorSmartphone, RadioTower } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWatcher } from '../../app/WatcherContext';
import { useI18n } from '../../i18n/I18nContext';
import type { ConnectionProfile, RemoteProvider } from '../../domain/models';
import { defaultProfile } from '../../data/profile';
import type { MessageKey } from '../../i18n/messages';
import SessionTokenHelp from '../../shared/SessionTokenHelp';

const publicProviders: RemoteProvider[] = ['zrok', 'cloudflare', 'tailscale-funnel', 'ngrok', 'custom'];
const privateProviders: RemoteProvider[] = ['tailscale-serve'];

export default function OnboardingPage() {
  const watcher = useWatcher();
  const { locale, setLocale, t } = useI18n();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [connectionKind, setConnectionKind] = useState<'local' | 'public' | 'private'>('public');
  const [profile, setProfile] = useState<ConnectionProfile>({
    ...defaultProfile,
    mode: 'remote',
    provider: 'zrok',
    endpoint: ''
  });
  const [token, setToken] = useState(watcher.token);

  const providers = useMemo(() => {
    if (connectionKind === 'local') return ['local'] as RemoteProvider[];
    if (connectionKind === 'private') return privateProviders;
    return publicProviders;
  }, [connectionKind]);

  const chooseKind = (kind: 'local' | 'public' | 'private') => {
    setConnectionKind(kind);
    const provider: RemoteProvider = kind === 'local' ? 'local' : kind === 'private' ? 'tailscale-serve' : 'zrok';
    setProfile((current) => ({
      ...current,
      provider,
      endpoint: kind === 'local' ? 'http://127.0.0.1:17890' : ''
    }));
  };

  const openDemo = () => {
    watcher.configure(defaultProfile, '');
    watcher.completeOnboarding();
    navigate('/overview', { replace: true });
  };

  const connect = () => {
    watcher.configure(profile, token);
    watcher.completeOnboarding();
    navigate('/overview', { replace: true });
  };

  return <main className="onboarding-shell">
    <div className="onboarding-orbit" aria-hidden="true"/>
    <section className="onboarding-brand">
      <img src="./brand/lnwjud-watcher-logo-transparent.png" alt="lnwjud Watcher"/>
      <span className="eyebrow">{t('onboarding.kicker')}</span>
      <h1>{t('onboarding.title')}</h1>
      <p>{t('onboarding.subtitle')}</p>
      <div className="read-only-note"><LockKeyhole size={18}/><span>{t('onboarding.readOnly')}</span></div>
    </section>

    <section className="onboarding-card">
      <div className="onboarding-step">{t('onboarding.step', { current: step + 1, total: 3 })}</div>

      {step === 0 && <>
        <h2>{t('onboarding.languageTitle')}</h2>
        <p className="muted">{t('onboarding.languageHelp')}</p>
        <div className="choice-grid two">
          <button className={locale === 'th' ? 'choice active' : 'choice'} onClick={() => setLocale('th')}>
            <strong>ไทย</strong><span>ภาษาไทย</span>
          </button>
          <button className={locale === 'en' ? 'choice active' : 'choice'} onClick={() => setLocale('en')}>
            <strong>English</strong><span>English</span>
          </button>
        </div>
      </>}

      {step === 1 && <>
        <h2>{t('onboarding.connectionTitle')}</h2>
        <p className="muted">{t('onboarding.connectionHelp')}</p>
        <div className="choice-grid">
          <button className={connectionKind === 'local' ? 'choice active' : 'choice'} onClick={() => chooseKind('local')}>
            <MonitorSmartphone/><strong>{t('onboarding.local')}</strong><span>{t('provider.localHelp')}</span>
          </button>
          <button className={connectionKind === 'public' ? 'choice active' : 'choice'} onClick={() => chooseKind('public')}>
            <Globe2/><strong>{t('onboarding.public')}</strong><span>{t('provider.zrokHelp')}</span>
          </button>
          <button className={connectionKind === 'private' ? 'choice active' : 'choice'} onClick={() => chooseKind('private')}>
            <RadioTower/><strong>{t('onboarding.private')}</strong><span>{t('provider.tailscale-serveHelp')}</span>
          </button>
        </div>

        <h3>{t('onboarding.providerTitle')}</h3>
        <p className="muted">{t('onboarding.providerHelp')}</p>
        <div className="provider-pills">
          {providers.map((provider) => <button
            key={provider}
            className={profile.provider === provider ? 'provider-pill active' : 'provider-pill'}
            onClick={() => setProfile((current) => ({ ...current, provider }))}
          >{t(('provider.' + provider) as MessageKey)}</button>)}
        </div>
      </>}

      {step === 2 && <>
        <h2>{t('onboarding.endpointTitle')}</h2>
        <p className="muted">{t('onboarding.endpointHelp')}</p>
        <label>{t('settings.name')}
          <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })}/>
        </label>
        <label>{t('settings.endpoint')}
          <input type="url" autoCapitalize="none" autoCorrect="off" placeholder={t('onboarding.endpointPlaceholder')} value={profile.endpoint} onChange={(event) => setProfile({ ...profile, endpoint: event.target.value })}/>
        </label>
        <label>{t('onboarding.tokenOptional')}
          <input type="password" autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)}/>
          <small>{t('onboarding.tokenHelp')}</small>
        </label>
        <SessionTokenHelp/>
      </>}

      <div className="onboarding-actions">
        {step > 0
          ? <button className="secondary-button" onClick={() => setStep(step - 1)}><ArrowLeft size={18}/>{t('onboarding.back')}</button>
          : <button className="secondary-button" onClick={openDemo}>{t('onboarding.demo')}</button>}
        {step < 2
          ? <button className="primary-button" onClick={() => setStep(step + 1)}>{t('onboarding.start')}<ArrowRight size={18}/></button>
          : <button className="primary-button" onClick={connect} disabled={!profile.endpoint.trim() || !token.trim()}>{t('onboarding.connect')}<ArrowRight size={18}/></button>}
      </div>
    </section>
  </main>;
}
