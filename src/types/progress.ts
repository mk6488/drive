import type { AttributeName } from './reward';

export type SquadMissionContributionType =
  | 'verified-sessions'
  | 'pacing-discipline'
  | 'rate-control'
  | 'reflection-quality'
  | 'squad-contribution';

export type TrainingResourceName = 'Energy' | 'Grit' | 'Rhythm' | 'Power' | 'Crew Points' | 'Repair Tokens';

export interface TrainingResourceBalance {
  name: TrainingResourceName;
  amount: number;
  description: string;
  previewOnly: true;
}

export type BoathouseUpgradeName =
  | 'Erg Corner'
  | 'Blade Rack'
  | 'Repair Bench'
  | 'Crew Noticeboard'
  | 'Trophy Shelf'
  | 'Regatta Prep Area';

export type BoathouseUpgradeStatus = 'preview-ready' | 'preview-building' | 'preview-locked';

export interface BoathouseUpgrade {
  id: string;
  name: BoathouseUpgradeName;
  status: BoathouseUpgradeStatus;
  description: string;
  qualityUnlockExplanation: string;
  resourceFocus: TrainingResourceName[];
  previewOnly: true;
}

export interface BoathouseProgress {
  squadId: string;
  title: string;
  description: string;
  resourceBalances: TrainingResourceBalance[];
  upgrades: BoathouseUpgrade[];
  previewOnly: true;
  updatedAt: string;
}

export interface AttributeProgress {
  name: AttributeName;
  value: number;
  updatedAt: string;
}

export interface BadgeProgress {
  badgeId: string;
  unlockedAt: string;
}

export interface SquadMissionProgress {
  missionId?: string;
  squadId: string;
  missionTitle: string;
  current: number;
  target: number;
  completedVerifiedSessions?: number;
  pacingDisciplineContributions?: number;
  rateControlContributions?: number;
  reflectionContributions?: number;
  squadContribution?: number;
  updatedAt: string;
}

export interface SquadMissionTarget {
  id: string;
  label: string;
  description: string;
  contributionType: SquadMissionContributionType;
  current: number;
  target: number;
  unit: string;
}

export interface SquadMission {
  id: string;
  squadId: string;
  title: string;
  description: string;
  targets: SquadMissionTarget[];
  previewOnly: true;
  updatedAt: string;
}

export interface RiverMapNode {
  id: string;
  title: string;
  description: string;
  order: number;
  qualityFocus: string;
}

export interface RiverMapProgress {
  squadId: string;
  currentNodeId: string;
  unlockedNodeIds: string[];
  nodes: RiverMapNode[];
  completedVerifiedSessions: number;
  pacingDisciplineContributions: number;
  rateControlContributions: number;
  reflectionContributions: number;
  squadContribution: number;
  previewOnly: true;
  updatedAt: string;
}

export interface AthleteProgress {
  athleteId: string;
  clubId: string;
  squadId: string;
  totalXp: number;
  level: number;
  attributes: AttributeProgress[];
  badges: BadgeProgress[];
  squadMission?: SquadMissionProgress;
  updatedAt: string;
}

// Athlete progress is a trusted record and should not be written directly by athlete-facing clients.
