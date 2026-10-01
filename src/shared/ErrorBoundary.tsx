import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in Watcher:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('lnwjud-watcher.profile.v1');
    } catch { /* ignore storage errors */ }
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="page-stack" style={{ padding: '2rem', maxWidth: '600px', margin: '4rem auto' }}>
          <div className="card">
            <h2>Something went wrong / เกิดข้อผิดพลาด</h2>
            <p className="muted" style={{ margin: '1rem 0' }}>
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => window.location.reload()}
              >
                Reload / โหลดใหม่
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={this.handleReset}
              >
                Reset Settings / ล้างค่ากลับเป็นค่าเริ่มต้น
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
