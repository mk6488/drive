import type { AttributeName, BadgeDefinition, ExecutionFocus, Quest } from '@/src/types';

export type RewardSignal =
  | 'pacing-discipline'
  | 'rate-control'
  | 'consistency'
  | 'recovery-discipline'
  | 'reflection-quality'
  | 'honest-effort';

export interface RewardFocusSummary {
  signal: RewardSignal;
  attributes: [AttributeName, AttributeName];
  principle: string;
}

export type AttributeFocusMapping = Record<RewardSignal, [AttributeName, AttributeName]>;

const attributeFocusMapping: AttributeFocusMapping = {
  'pacing-discipline': ['Rhythm', 'Discipline'],
  'rate-control': ['Discipline', 'Rhythm'],
  consistency: ['Rhythm', 'Engine'],
  'recovery-discipline': ['Discipline', 'Engine'],
  'reflection-quality': ['Discipline', 'Grit'],
  'honest-effort': ['Grit', 'Discipline'],
};

const rewardSignalPrinciples: Record<RewardSignal, string> = {
  'pacing-discipline': 'Hold target pacing instead of chasing one fast split.',
  'rate-control': 'Respect stroke-rate boundaries and technical control.',
  consistency: 'Repeat quality output block to block.',
  'recovery-discipline': 'Use recovery exactly as prescribed to protect quality.',
  'reflection-quality': 'Show practical learning in a short coach-facing reflection.',
  'honest-effort': 'Submit honest evidence and own the session execution.',
};

export const rewardBadgeExamples: readonly Pick<BadgeDefinition, 'id' | 'name' | 'tier'>[] = [
  { id: 'first-verified-session', name: 'First Verified Session', tier: 'bronze' },
  { id: 'split-discipline', name: 'Split Discipline', tier: 'silver' },
  { id: 'captains-standard', name: "Captain's Standard", tier: 'gold' },
];

export function getAttributeFocusMapping(): AttributeFocusMapping {
  return attributeFocusMapping;
}

export function getRewardSignalPrinciple(signal: RewardSignal): string {
  return rewardSignalPrinciples[signal];
}

export function getRewardFocusSummaryForSignal(signal: RewardSignal): RewardFocusSummary {
  return {
    signal,
    attributes: attributeFocusMapping[signal],
    principle: rewardSignalPrinciples[signal],
  };
}

export function toRewardSignal(focus: ExecutionFocus): RewardSignal {
  return focus;
}

export function listRewardFocusSummariesForQuest(quest: Pick<Quest, 'executionFocus'>): RewardFocusSummary[] {
  return quest.executionFocus.map((focus) => getRewardFocusSummaryForSignal(toRewardSignal(focus)));
}

export function listAttributeEmphasisForQuest(quest: Pick<Quest, 'executionFocus'>): AttributeName[] {
  const seen = new Set<AttributeName>();

  for (const focus of quest.executionFocus) {
    const [primary, secondary] = attributeFocusMapping[focus];
    seen.add(primary);
    seen.add(secondary);
  }

  return Array.from(seen);
}
