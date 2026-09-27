import type { MessageKey } from '../i18n/messages';

export function connectionHelpKey(error: string): MessageKey {
  if (/HTTP (401|403)\b/.test(error)) return 'connection.checkToken';
  if (/HTTP (404|405|426)\b/.test(error)) return 'connection.checkEndpoint';
  return 'connection.checkSettings';
}
