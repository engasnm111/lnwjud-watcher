import { useEffect, useState, type PropsWithChildren } from 'react';
import { Download, RefreshCw, ShieldAlert } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { MessageKey } from '../i18n/messages';
import { checkForUpdate, CURRENT_VERSION, startUpdate, type AvailableUpdate } from '../data/update';

const UPDATE_CHECK_MS = 30 * 60 * 1_000;

export default function UpdateGate({ children }: PropsWithChildren) {
  const { t } = useI18n();
  const [update, setUpdate] = useState<AvailableUpdate | null>(null);
  const [opening, setOpening] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const check = () => {
      void checkForUpdate(CURRENT_VERSION, undefined, controller.signal)
        .then((available) => {
          if (available) setUpdate(available);
        })
        .catch(() => undefined);
    };
    const checkWhenVisible = () => {
      if (document.visibilityState === 'visible') check();
    };

    check();
    const timer = window.setInterval(check, UPDATE_CHECK_MS);
    document.addEventListener('visibilitychange', checkWhenVisible);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', checkWhenVisible);
    };
  }, []);

  const updateNow = async () => {
    if (!update || opening) return;
    setOpening(true);
    setFailed(false);
    try {
      await startUpdate(update);
      setOpening(false);
    } catch {
      setFailed(true);
      setOpening(false);
    }
  };

  return <>
    {children}
    {update && <div className="update-overlay" role="presentation">
      <section className="update-modal" role="dialog" aria-modal="true" aria-labelledby="update-title">
        <div className="update-icon"><ShieldAlert size={30}/></div>
        <span className="eyebrow">{t('update.required')}</span>
        <h2 id="update-title">{t('update.title')}</h2>
        <p>{t('update.body')}</p>
        <div className="update-versions">
          <div><span>{t('update.current')}</span><strong>v{CURRENT_VERSION}</strong></div>
          <div><span>{t('update.latest')}</span><strong>v{update.version}</strong></div>
        </div>
        <p className="update-note">{t(('update.note.' + update.platform) as MessageKey)}</p>
        {failed && <div className="error-banner">{t('update.failed')}</div>}
        <button className="primary-button update-button" type="button" onClick={() => void updateNow()} disabled={opening}>
          {opening ? <RefreshCw size={18} className="spin-once"/> : <Download size={18}/>}
          {opening ? t('update.opening') : t('update.now')}
        </button>
      </section>
    </div>}
  </>;
}
