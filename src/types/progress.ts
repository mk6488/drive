import type { AttributeName } from './reward';

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
  squadId: string;
  missionTitle: string;
  current: number;
  target: number;
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
