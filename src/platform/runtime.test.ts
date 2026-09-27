import { describe, expect, it, vi } from 'vitest';
import { removeNativeServiceWorkers, shouldRegisterServiceWorker } from './runtime';

describe('shouldRegisterServiceWorker', () => {
  it('skips registration for the packaged desktop file protocol', () => {
    expect(shouldRegisterServiceWorker('file:', false)).toBe(false);
  });

  it('keeps PWA registration for web origins', () => {
    expect(shouldRegisterServiceWorker('https:', false)).toBe(true);
    expect(shouldRegisterServiceWorker('http:', false)).toBe(true);
  });

  it('does not register the PWA worker inside a native app with an HTTPS origin', () => {
    expect(shouldRegisterServiceWorker('https:', true)).toBe(false);
  });
});

describe('native service-worker migration', () => {
  it('removes an old worker and requests a fresh page when it controlled the app', async () => {
    const unregister = vi.fn().mockResolvedValue(true);
    const serviceWorker = {
      controller: {} as ServiceWorker,
      getRegistrations: async () => [{ unregister }],
    } as unknown as ServiceWorkerContainer;
    expect(await removeNativeServiceWorkers(serviceWorker)).toBe(true);
    expect(unregister).toHaveBeenCalledOnce();
  });
});
