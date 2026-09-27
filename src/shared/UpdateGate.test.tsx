import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Capacitor } from '@capacitor/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../i18n/I18nContext';
import nativeUpdateMigration from '../../android/app/src/main/assets/native-update-migration.js?raw';
import UpdateGate from './UpdateGate';

afterEach(() => {
  cleanup();
  document.getElementById('watcher-native-update-migration')?.remove();
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

describe('native update behavior', () => {
  it('does not show the old update prompt while an installed APK loads through an old worker', async () => {
    vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('android');
    const originalServiceWorker = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker');
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: { controller: {} } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tag_name: 'v9.9.9' }),
    }));

    try {
      new Function(nativeUpdateMigration)();
      render(<I18nProvider><UpdateGate><main>Watcher app</main></UpdateGate></I18nProvider>);

      expect(await screen.findByRole('dialog', { hidden: true })).not.toBeVisible();
    } finally {
      if (originalServiceWorker) Object.defineProperty(navigator, 'serviceWorker', originalServiceWorker);
      else Reflect.deleteProperty(navigator, 'serviceWorker');
    }
  });

  it('still shows a real newer release after the old worker is gone', async () => {
    vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('android');
    const originalServiceWorker = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker');
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: { controller: null } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tag_name: 'v9.9.9' }),
    }));

    try {
      new Function(nativeUpdateMigration)();
      render(<I18nProvider><UpdateGate><main>Watcher app</main></UpdateGate></I18nProvider>);

      expect(await screen.findByRole('dialog')).toBeVisible();
    } finally {
      if (originalServiceWorker) Object.defineProperty(navigator, 'serviceWorker', originalServiceWorker);
      else Reflect.deleteProperty(navigator, 'serviceWorker');
    }
  });

  it('hides an old update prompt immediately while rechecking on return to the app', async () => {
    vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('android');
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: 'v9.9.9', html_url: 'https://github.com/engasnm111/lnwjud-watcher/releases/tag/v9.9.9' }),
      })
      .mockImplementationOnce(() => new Promise(() => undefined));
    vi.stubGlobal('fetch', fetchMock);

    render(<I18nProvider><UpdateGate><main>Watcher app</main></UpdateGate></I18nProvider>);
    expect(await screen.findByRole('dialog')).toBeVisible();

    fireEvent(document, new Event('visibilitychange'));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('Watcher app')).toBeVisible();
  });

  it('ignores an older update check that finishes after the foreground recheck', async () => {
    vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('android');
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    let finishOldCheck!: (response: unknown) => void;
    const oldCheck = new Promise((resolve) => { finishOldCheck = resolve; });
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => oldCheck)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ tag_name: 'v0.0.1' }) });
    vi.stubGlobal('fetch', fetchMock);

    render(<I18nProvider><UpdateGate><main>Watcher app</main></UpdateGate></I18nProvider>);
    fireEvent(document, new Event('visibilitychange'));
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await act(async () => {
      finishOldCheck({ ok: true, json: async () => ({ tag_name: 'v9.9.9' }) });
      await oldCheck;
    });

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
