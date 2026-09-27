import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Capacitor } from '@capacitor/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../i18n/I18nContext';
import UpdateGate from './UpdateGate';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Web/PWA update behavior', () => {
  it('shows the website without checking GitHub for installable releases', () => {
    vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('web');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(<I18nProvider><UpdateGate><main>Watcher website</main></UpdateGate></I18nProvider>);

    expect(screen.getByText('Watcher website')).toBeVisible();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
