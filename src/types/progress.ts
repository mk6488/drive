import type { AttributeName } from './reward';

export type SquadMissionContributionType =
  | 'verified-sessions'
  | 'pacing-discipline'
  | 'rate-control'
  | 'reflection-quality'
  | 'squad-contribution';

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
