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

  it('detects the signed v0.1.0 to v0.2.0 release upgrade', () => {
    expect(shouldOfferUpdate('v0.2.0', '0.1.0')).toBe(true);
  });

  it('never offers a same-version release even when its tag points to another commit', () => {
    expect(shouldOfferUpdate('v0.1.0', '0.1.0')).toBe(false);
    expect(shouldOfferUpdate('v0.0.9', '0.1.0')).toBe(false);
  });

  it('skips the release commit lookup when the installed version is current', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tag_name: 'v0.1.0',
          html_url: 'https://github.com/engasnm111/lnwjud-watcher/releases/tag/v0.1.0',
          assets,
        }),
      });
    vi.stubGlobal('fetch', fetchMock);

    const update = await checkForUpdate('0.1.0', 'android');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(update).toBeNull();
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
