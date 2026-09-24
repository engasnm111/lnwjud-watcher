import type { ObservableStatus } from '../domain/models';

export default function StatusPill({ status }: { status: ObservableStatus }) {
  return <span className={'status-pill status-' + status}><span className="status-dot"/>{status}</span>;
}
