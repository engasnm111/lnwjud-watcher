import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { demoSnapshot } from '../../data/demo';
import { I18nProvider } from '../../i18n/I18nContext';
import GoalsPage from './GoalsPage';

const { mockUseWatcher } = vi.hoisted(() => ({ mockUseWatcher: vi.fn() }));
vi.mock('../../app/WatcherContext', () => ({ useWatcher: () => mockUseWatcher() }));

afterEach(() => {
  cleanup();
  mockUseWatcher.mockReset();
});

describe('active goal with completed milestones', () => {
  it('shows that runtime finalization is pending without calling the goal done', () => {
    const snapshot = structuredClone(demoSnapshot);
    const goal = snapshot.workspaces[0]!.goals[0]!;
    goal.status = 'waiting';
    goal.milestones = goal.milestones.map((step) => ({ ...step, status: 'completed' }));
    snapshot.workspaces = [{ ...snapshot.workspaces[0]!, goals: [goal] }];
    mockUseWatcher.mockReturnValue({ snapshot });

    render(<I18nProvider><GoalsPage/></I18nProvider>);

    expect(screen.getByText('Ready to finish')).toBeVisible();
    expect(screen.getByText(/LNWJUD still reports this goal as active/)).toBeVisible();
    expect(screen.getByText('100%')).toBeVisible();
    expect(screen.queryByText('Done')).toBeNull();
  });
});
