import type { Athlete, AthleteProgress, Quest, RewardResult, Squad, Submission } from '@/src/types';

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

export interface SubmissionRepository {
  getSubmissionById(submissionId: string): Promise<Submission | null>;
  listSubmissionsForAthlete(athleteId: string): Promise<Submission[]>;
  saveAthleteSubmissionDraft(
    submission: Omit<Submission, 'status'> & { status: 'draft' | 'submitted' },
  ): Promise<Submission>;
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
}

export interface TrustedProgressWriteRepository {
  // Trusted workflows only; do not call from athlete-facing UI screens.
  saveAthleteProgress(progress: AthleteProgress): Promise<AthleteProgress>;
}

export type RewardRepository = RewardReadRepository & TrustedRewardWriteRepository;
export type ProgressRepository = ProgressReadRepository & TrustedProgressWriteRepository;
