export type AttributeName = 'Engine' | 'Discipline' | 'Rhythm' | 'Grit';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'secret';

export interface BadgeDefinition {
  id: string;
  name: string;
  tier: BadgeTier;
  description: string;
}

export interface RewardResult {
  id: string;
  verifiedSubmissionId: string;
  athleteId: string;
  questId: string;
  xpAwarded: number;
  attributeDeltas: Partial<Record<AttributeName, number>>;
  unlockedBadgeIds: string[];
  createdAt: string;
}
