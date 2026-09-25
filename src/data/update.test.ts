import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkForUpdate, isNewerVersion, selectReleaseAsset, shouldOfferUpdate } from './update';

afterEach(() => vi.unstubAllGlobals());

const assets = [
  { name: 'lnwjud-watcher-windows-x64.exe', browser_download_url: 'https://github.com/engasnm111/lnwjud-watcher/releases/download/v0.1.0/lnwjud-watcher-windows-x64.exe' },
  { name: 'lnwjud-watcher-linux-x64.AppImage', browser_download_url: 'https://github.com/engasnm111/lnwjud-watcher/releases/download/v0.1.0/lnwjud-watcher-linux-x64.AppImage' },
  { name: 'lnwjud-watcher-android.apk', browser_download_url: 'https://github.com/engasnm111/lnwjud-watcher/releases/download/v0.1.0/lnwjud-watcher-android.apk' },
];

describe('GitHub update policy', () => {
  it('compares semantic release versions', () => {
    expect(isNewerVersion('v1.0.1', '1.0.0')).toBe(true);
    expect(isNewerVersion('v1.0.0', '1.0.0')).toBe(false);
    expect(isNewerVersion('v0.9.9', '1.0.0')).toBe(false);
  });

  it('detects a refreshed canonical build even when the public version remains v0.1.0', () => {
    expect(shouldOfferUpdate('v0.1.0', '0.1.0', 'new-build-sha', 'old-build-sha')).toBe(true);
    expect(shouldOfferUpdate('v0.1.0', '0.1.0', 'same-build-sha', 'same-build-sha')).toBe(false);
    expect(shouldOfferUpdate('v0.1.0', '0.1.0', 'new-build-sha', 'unknown')).toBe(false);
  });

  it('resolves the release commit when the canonical version number is unchanged', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tag_name: 'v0.1.0',
          html_url: 'https://github.com/engasnm111/lnwjud-watcher/releases/tag/v0.1.0',
          assets,
        }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ sha: 'new-build-sha' }) });
    vi.stubGlobal('fetch', fetchMock);

    const update = await checkForUpdate('0.1.0', 'android', undefined, 'old-build-sha');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(update?.version).toBe('0.1.0');
    expect(update?.downloadUrl).toContain('lnwjud-watcher-android.apk');
  });

  it('selects the platform asset and rejects non-GitHub download URLs', () => {
    expect(selectReleaseAsset(assets, 'android')).toContain('lnwjud-watcher-android.apk');
    expect(selectReleaseAsset(assets, 'windows')).toContain('lnwjud-watcher-windows-x64.exe');
    expect(selectReleaseAsset(assets, 'linux')).toContain('lnwjud-watcher-linux-x64.AppImage');
    expect(selectReleaseAsset([
      { name: 'lnwjud-watcher-android.apk', browser_download_url: 'https://evil.example/update.apk' },
    ], 'android')).toBeNull();
  });
});
