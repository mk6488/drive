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
  getAthleteById(clubId: string, athleteId: string): Promise<Athlete | null>;
  listAthletesBySquad(clubId: string, squadId: string): Promise<Athlete[]>;
}

export interface SquadRepository {
  getSquadById(clubId: string, squadId: string): Promise<Squad | null>;
  listSquadsByClub(clubId: string): Promise<Squad[]>;
}

export interface QuestRepository {
  getQuestById(clubId: string, questId: string): Promise<Quest | null>;
  listQuestsForSquad(clubId: string, squadId: string): Promise<Quest[]>;
}

export interface SubmissionReadRepository {
  // Firestore reads must stay club, squad, and athlete scoped so PM5 evidence is not exposed broadly.
  getSubmissionById(clubId: string, squadId: string, athleteId: string, submissionId: string): Promise<Submission | null>;
  listSubmissionsForAthlete(clubId: string, squadId: string, athleteId: string): Promise<Submission[]>;
}

export interface RewardReadRepository {
  getRewardResultByVerifiedSubmissionId(clubId: string, athleteId: string, verifiedSubmissionId: string): Promise<RewardResult | null>;
  listRewardsForAthlete(clubId: string, athleteId: string): Promise<RewardResult[]>;
}

export interface TrustedRewardWriteRepository {
  // Trusted workflows only; do not call from athlete-facing UI screens.
  saveRewardResult(result: RewardResult): Promise<RewardResult>;
}

export interface ProgressReadRepository {
  getAthleteProgress(clubId: string, athleteId: string): Promise<AthleteProgress | null>;
  getSquadMission(clubId: string, squadId: string): Promise<SquadMission | null>;
  getSquadMissionProgress(clubId: string, squadId: string): Promise<SquadMissionProgress | null>;
  getRiverMapProgress(clubId: string, squadId: string): Promise<RiverMapProgress | null>;
  getBoathouseProgress(clubId: string, squadId: string): Promise<BoathouseProgress | null>;
}

export interface TrustedProgressWriteRepository {
  // Trusted workflows only; do not call from athlete-facing UI screens.
  saveAthleteProgress(progress: AthleteProgress): Promise<AthleteProgress>;
}
