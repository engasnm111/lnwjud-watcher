import type { ObservableStatus } from '../domain/models';
import { useI18n } from '../i18n/I18nContext';
import type { MessageKey } from '../i18n/messages';

export default function StatusPill({ status }: { status: ObservableStatus }) {
  const { t } = useI18n();
  return <span className={'status-pill status-' + status}>
    <span className="status-dot"/>
    {t(('status.' + status) as MessageKey)}
  </span>;
}
