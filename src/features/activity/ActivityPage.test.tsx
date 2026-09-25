import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { demoSnapshot } from '../../data/demo';
import ActivityPage, { ACTIVITY_PAGE_SIZE } from './ActivityPage';

const { mockUseWatcher } = vi.hoisted(() => ({ mockUseWatcher: vi.fn() }));

vi.mock('../../app/WatcherContext', () => ({
  useWatcher: () => mockUseWatcher(),
}));

vi.mock('../../i18n/I18nContext', () => ({
  useI18n: () => ({
    localeTag: 'en-US',
    t: (key: string, values?: Record<string, string | number>) => {
      if (key === 'activity.more') return 'Load older activity';
      if (key === 'activity.showing') return `Showing ${values?.visible} of ${values?.total}`;
      return key;
    },
  }),
}));

vi.mock('../../shared/StatusPill', () => ({
  default: ({ status }: { status: string }) => <span>{status}</span>,
}));

function activitySnapshot(count: number) {
  return {
    ...demoSnapshot,
    activity: Array.from({ length: count }, (_, index) => ({
      id: `activity-${index}`,
      timestamp: new Date(Date.UTC(2026, 8, 26, 4, 0, count - index)).toISOString(),
      kind: 'shell',
      status: 'done' as const,
      actor: '@lnwjud',
      summary: `Activity ${index}`,
      detail: `detail-${index}-${'x'.repeat(120)}`,
    })),
  };
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  mockUseWatcher.mockReset();
});

describe('ActivityPage progressive rendering', () => {
  it('renders a bounded first page and progressively reveals older activity', () => {
    mockUseWatcher.mockReturnValue({ snapshot: activitySnapshot(45) });

    render(<ActivityPage/>);

    expect(screen.getAllByRole('article')).toHaveLength(ACTIVITY_PAGE_SIZE);
    fireEvent.click(screen.getByRole('button', { name: 'Load older activity' }));
    expect(screen.getAllByRole('article')).toHaveLength(40);
    fireEvent.click(screen.getByRole('button', { name: 'Load older activity' }));
    expect(screen.getAllByRole('article')).toHaveLength(45);
    expect(screen.queryByRole('button', { name: 'Load older activity' })).toBeNull();
  });

  it('loads the next page automatically when the sentinel approaches the viewport', () => {
    let callback: IntersectionObserverCallback | null = null;
    class FakeIntersectionObserver {
      constructor(next: IntersectionObserverCallback) { callback = next; }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords(): IntersectionObserverEntry[] { return []; }
      readonly root = null;
      readonly rootMargin = '320px 0px';
      readonly thresholds = [0];
    }
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    mockUseWatcher.mockReturnValue({ snapshot: activitySnapshot(45) });

    render(<ActivityPage/>);
    expect(screen.getAllByRole('article')).toHaveLength(ACTIVITY_PAGE_SIZE);

    act(() => {
      callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    expect(screen.getAllByRole('article')).toHaveLength(40);
  });
});
