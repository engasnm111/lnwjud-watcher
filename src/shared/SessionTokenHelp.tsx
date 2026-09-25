import { ExternalLink, KeyRound } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

const pairingUrl = 'http://127.0.0.1:17891/api/v1/pair';

export default function SessionTokenHelp() {
  const { t } = useI18n();

  return <div className="session-token-help">
    <div className="session-token-help-copy">
      <KeyRound size={18}/>
      <div>
        <strong>{t('pairing.title')}</strong>
        <span>{t('pairing.body')}</span>
      </div>
    </div>
    <a className="session-token-link" href={pairingUrl} target="_blank" rel="noreferrer">
      <code>127.0.0.1:17891/api/v1/pair</code>
      <span>{t('pairing.open')}</span>
      <ExternalLink size={15}/>
    </a>
    <small>{t('pairing.localOnly')}</small>
  </div>;
}
