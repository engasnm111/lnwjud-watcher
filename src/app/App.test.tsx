import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { demoSnapshot } from '../data/demo';
import { I18nProvider } from '../i18n/I18nContext';
import App from './App';

const { mockUseWatcher } = vi.hoisted(() => ({ mockUseWatcher: vi.fn() }));
vi.mock('./WatcherContext', () => ({ useWatcher: () => mockUseWatcher() }));
vi.mock('../shared/UpdateGate', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));

afterEach(() => {
  cleanup();
  mockUseWatcher.mockReset();
});

describe('connection failure notice', () => {
  it('guides an unauthorized user to check settings', () => {
    localStorage.setItem('lnwjud-watcher.locale.v1', 'en');
    mockUseWatcher.mockReturnValue({
      snapshot: demoSnapshot, state: 'error', error: 'Watcher API returned HTTP 401',
      profile: { mode: 'remote', name: 'Runtime', provider: 'local', endpoint: 'http://127.0.0.1:17890' },
      lastSyncAt: null, fallbackPolling: true, refreshing: false, onboardingComplete: true,
      refresh: vi.fn(),
    });

    render(<I18nProvider><App/></I18nProvider>);

    expect(screen.getByRole('alert')).toHaveTextContent('Check your Watcher Session token');
    expect(screen.getByRole('link', { name: 'Check settings' })).toHaveAttribute('href', '#/settings');
  });
});
