import type {
  Athlete,
  AthleteProgress,
  BoathouseProgress,
  Quest,
  RewardResult,
  RiverMapProgress,
  Squad,
  SquadMission,
  SquadMissionProgress,
  Submission,
} from '@/src/types';

export interface AthleteRepository {
  getAthleteById(athleteId: string): Promise<Athlete | null>;
  listAthletesBySquad(clubId: string, squadId: string): Promise<Athlete[]>;
}

export interface SquadRepository {
  getSquadById(squadId: string): Promise<Squad | null>;
  listSquadsByClub(clubId: string): Promise<Squad[]>;
}

export interface QuestRepository {
  getQuestById(questId: string): Promise<Quest | null>;
  listQuestsForSquad(clubId: string, squadId: string): Promise<Quest[]>;
}

export interface SubmissionReadRepository {
  getSubmissionById(submissionId: string): Promise<Submission | null>;
  listSubmissionsForAthlete(athleteId: string): Promise<Submission[]>;
}

export interface RewardReadRepository {
  getRewardResultByVerifiedSubmissionId(verifiedSubmissionId: string): Promise<RewardResult | null>;
  listRewardsForAthlete(athleteId: string): Promise<RewardResult[]>;
}

export interface TrustedRewardWriteRepository {
  // Trusted workflows only; do not call from athlete-facing UI screens.
  saveRewardResult(result: RewardResult): Promise<RewardResult>;
}

export interface ProgressReadRepository {
  getAthleteProgress(athleteId: string): Promise<AthleteProgress | null>;
  getSquadMission(squadId: string): Promise<SquadMission | null>;
  getSquadMissionProgress(squadId: string): Promise<SquadMissionProgress | null>;
  getRiverMapProgress(squadId: string): Promise<RiverMapProgress | null>;
  getBoathouseProgress(squadId: string): Promise<BoathouseProgress | null>;
}

export interface TrustedProgressWriteRepository {
  // Trusted workflows only; do not call from athlete-facing UI screens.
  saveAthleteProgress(progress: AthleteProgress): Promise<AthleteProgress>;
}
