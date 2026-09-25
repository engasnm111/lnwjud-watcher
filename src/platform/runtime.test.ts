import { describe, expect, it } from 'vitest';
import { shouldRegisterServiceWorker } from './runtime';

describe('shouldRegisterServiceWorker', () => {
  it('skips registration for the packaged desktop file protocol', () => {
    expect(shouldRegisterServiceWorker('file:')).toBe(false);
  });

  it('keeps PWA registration for web origins', () => {
    expect(shouldRegisterServiceWorker('https:')).toBe(true);
    expect(shouldRegisterServiceWorker('http:')).toBe(true);
  });
});
