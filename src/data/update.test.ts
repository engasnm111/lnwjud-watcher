import { describe, expect, it } from 'vitest';
import { isNewerVersion, selectReleaseAsset } from './update';

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

  it('selects the platform asset and rejects non-GitHub download URLs', () => {
    expect(selectReleaseAsset(assets, 'android')).toContain('lnwjud-watcher-android.apk');
    expect(selectReleaseAsset(assets, 'windows')).toContain('lnwjud-watcher-windows-x64.exe');
    expect(selectReleaseAsset(assets, 'linux')).toContain('lnwjud-watcher-linux-x64.AppImage');
    expect(selectReleaseAsset([
      { name: 'lnwjud-watcher-android.apk', browser_download_url: 'https://evil.example/update.apk' },
    ], 'android')).toBeNull();
  });
});
