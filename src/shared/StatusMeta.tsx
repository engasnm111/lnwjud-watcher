import type { ObservableStatus } from '../domain/models';
import { useI18n } from '../i18n/I18nContext';
import { formatTime } from './format';
import StatusPill from './StatusPill';

export default function StatusMeta({ status, timestamp, className = '' }: {
  status: ObservableStatus;
  timestamp: string;
  className?: string;
}) {
  const { localeTag } = useI18n();
  return <div className={['status-meta', className].filter(Boolean).join(' ')}>
    <StatusPill status={status}/>
    <time>{formatTime(timestamp, localeTag)}</time>
  </div>;
}
