import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import packageInfo from '../../package.json';

export type UpdatePlatform = 'web' | 'android' | 'ios' | 'windows' | 'macos' | 'linux';

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

export interface AvailableUpdate {
  version: string;
  releaseUrl: string;
  downloadUrl: string | null;
  platform: UpdatePlatform;
}

interface GitHubRelease {
  tag_name?: unknown;
  html_url?: unknown;
  draft?: unknown;
  prerelease?: unknown;
  assets?: unknown;
}

interface GitHubCommit {
  sha?: unknown;
}

const LATEST_RELEASE_API = 'https://api.github.com/repos/engasnm111/lnwjud-watcher/releases/latest';
const RELEASE_COMMIT_API = 'https://api.github.com/repos/engasnm111/lnwjud-watcher/commits/';
const RELEASES_URL = 'https://github.com/engasnm111/lnwjud-watcher/releases/latest';

export const CURRENT_VERSION = packageInfo.version;
export const CURRENT_BUILD_SHA = __WATCHER_BUILD_SHA__;

function parseVersion(value: string): [number, number, number] | null {
  const match = /^v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(value.trim());
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function isNewerVersion(latest: string, current: string): boolean {
  const next = parseVersion(latest);
  const installed = parseVersion(current);
  if (!next || !installed) return false;
  for (let index = 0; index < 3; index += 1) {
    const left = next[index] ?? 0;
    const right = installed[index] ?? 0;
    if (left !== right) return left > right;
  }
  return false;
}

function isSameVersion(latest: string, current: string): boolean {
  const next = parseVersion(latest);
  const installed = parseVersion(current);
  return next !== null && installed !== null && next.every((value, index) => value === installed[index]);
}

export function shouldOfferUpdate(
  latestVersion: string,
  currentVersion: string,
  latestBuildSha: string | null,
  currentBuildSha = CURRENT_BUILD_SHA,
): boolean {
  if (isNewerVersion(latestVersion, currentVersion)) return true;
  if (!isSameVersion(latestVersion, currentVersion)) return false;
  if (!latestBuildSha || currentBuildSha === 'unknown') return false;
  return latestBuildSha !== currentBuildSha;
}

function trustedGitHubUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'github.com' || url.hostname.endsWith('.githubusercontent.com'))
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function detectUpdatePlatform(): UpdatePlatform {
  const capacitorPlatform = Capacitor.getPlatform();
  if (capacitorPlatform === 'android' || capacitorPlatform === 'ios') return capacitorPlatform;

  const userAgent = navigator.userAgent;
  if (/Electron/i.test(userAgent)) {
    if (/Windows/i.test(userAgent)) return 'windows';
    if (/Macintosh|Mac OS X/i.test(userAgent)) return 'macos';
    if (/Linux/i.test(userAgent)) return 'linux';
  }
  return 'web';
}

export function selectReleaseAsset(assets: readonly ReleaseAsset[], platform: UpdatePlatform): string | null {
  const match = platform === 'android'
    ? assets.find((asset) => /android.*\.apk$/i.test(asset.name))
    : platform === 'windows'
      ? assets.find((asset) => /windows.*\.exe$/i.test(asset.name))
      : platform === 'linux'
        ? assets.find((asset) => /linux.*\.AppImage$/i.test(asset.name))
        : undefined;
  return match ? trustedGitHubUrl(match.browser_download_url) : null;
}

async function resolveReleaseCommitSha(tag: string, signal?: AbortSignal): Promise<string | null> {
  const response = await fetch(RELEASE_COMMIT_API + encodeURIComponent(tag), {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-store',
    signal,
  });
  if (!response.ok) return null;
  const commit = await response.json() as GitHubCommit;
  return typeof commit.sha === 'string' ? commit.sha : null;
}

export async function checkForUpdate(
  currentVersion = CURRENT_VERSION,
  platform = detectUpdatePlatform(),
  signal?: AbortSignal,
  currentBuildSha = CURRENT_BUILD_SHA,
): Promise<AvailableUpdate | null> {
  const response = await fetch(LATEST_RELEASE_API, {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-store',
    signal,
  });
  if (!response.ok) throw new Error(`GitHub release check failed with HTTP ${response.status}`);

  const release = await response.json() as GitHubRelease;
  if (release.draft === true || release.prerelease === true || typeof release.tag_name !== 'string') return null;

  let latestBuildSha: string | null = null;
  if (isSameVersion(release.tag_name, currentVersion) && currentBuildSha !== 'unknown') {
    latestBuildSha = await resolveReleaseCommitSha(release.tag_name, signal);
  }
  if (!shouldOfferUpdate(release.tag_name, currentVersion, latestBuildSha, currentBuildSha)) return null;

  const releaseUrl = trustedGitHubUrl(release.html_url) ?? RELEASES_URL;
  const assets = Array.isArray(release.assets)
    ? release.assets.flatMap((asset): ReleaseAsset[] => {
        if (typeof asset !== 'object' || asset === null) return [];
        const record = asset as Record<string, unknown>;
        return typeof record.name === 'string' && typeof record.browser_download_url === 'string'
          ? [{ name: record.name, browser_download_url: record.browser_download_url }]
          : [];
      })
    : [];

  return {
    version: release.tag_name.replace(/^v/, ''),
    releaseUrl,
    downloadUrl: selectReleaseAsset(assets, platform),
    platform,
  };
}

async function refreshWebApp(version: string): Promise<void> {
  const registrations = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistrations() : [];
  await Promise.all(registrations.map((registration) => registration.update().catch(() => undefined)));
  const url = new URL(window.location.href);
  url.searchParams.set('update', version);
  window.location.replace(url.toString());
}

export async function startUpdate(update: AvailableUpdate): Promise<void> {
  if (update.platform === 'web') {
    await refreshWebApp(update.version);
    return;
  }

  const url = update.downloadUrl ?? update.releaseUrl;
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url });
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}
