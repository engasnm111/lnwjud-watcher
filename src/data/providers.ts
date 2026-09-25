import type { RemoteProvider } from '../domain/models';

export interface ProviderGuide {
  id: RemoteProvider;
  docsUrl: string;
  windowsCommand?: string;
  unixCommand?: string;
}

const docsBase = 'https://github.com/engasnm111/lnwjud-watcher/blob/main/docs/providers';

export const providerGuides: Record<RemoteProvider, ProviderGuide> = {
  local: { id: 'local', docsUrl: docsBase + '/local.md' },
  zrok: {
    id: 'zrok',
    docsUrl: docsBase + '/zrok.md',
    windowsCommand: 'powershell -ExecutionPolicy Bypass -File scripts\\providers\\setup-watcher-access.ps1 -Provider zrok',
    unixCommand: './scripts/providers/setup-watcher-access.sh zrok'
  },
  cloudflare: {
    id: 'cloudflare',
    docsUrl: docsBase + '/cloudflare.md',
    windowsCommand: 'powershell -ExecutionPolicy Bypass -File scripts\\providers\\setup-watcher-access.ps1 -Provider cloudflare',
    unixCommand: './scripts/providers/setup-watcher-access.sh cloudflare'
  },
  'tailscale-serve': {
    id: 'tailscale-serve',
    docsUrl: docsBase + '/tailscale.md',
    windowsCommand: 'powershell -ExecutionPolicy Bypass -File scripts\\providers\\setup-watcher-access.ps1 -Provider tailscale-serve',
    unixCommand: './scripts/providers/setup-watcher-access.sh tailscale-serve'
  },
  'tailscale-funnel': {
    id: 'tailscale-funnel',
    docsUrl: docsBase + '/tailscale.md',
    windowsCommand: 'powershell -ExecutionPolicy Bypass -File scripts\\providers\\setup-watcher-access.ps1 -Provider tailscale-funnel',
    unixCommand: './scripts/providers/setup-watcher-access.sh tailscale-funnel'
  },
  ngrok: {
    id: 'ngrok',
    docsUrl: docsBase + '/ngrok.md',
    windowsCommand: 'powershell -ExecutionPolicy Bypass -File scripts\\providers\\setup-watcher-access.ps1 -Provider ngrok',
    unixCommand: './scripts/providers/setup-watcher-access.sh ngrok'
  },
  custom: { id: 'custom', docsUrl: docsBase + '/custom-https.md' }
};
