import type { Goal } from '../domain/models';
import { useI18n } from '../i18n/I18nContext';
import { goalNeedsFinalization } from './goalState';
import StatusPill from './StatusPill';

export default function GoalStatusPill({ goal }: { goal: Goal }) {
  const { t } = useI18n();
  return <StatusPill status={goal.status} label={goalNeedsFinalization(goal) ? t('goal.readyToFinish') : undefined}/>;
}
