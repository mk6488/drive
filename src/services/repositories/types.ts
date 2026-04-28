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

export interface RewardRepository {
  getRewardResultByVerifiedSubmissionId(verifiedSubmissionId: string): Promise<RewardResult | null>;
  listRewardsForAthlete(athleteId: string): Promise<RewardResult[]>;
  // Trusted workflow only: do not expose this directly to athlete-facing actions.
  saveRewardResult(result: RewardResult): Promise<RewardResult>;
}

export interface ProgressRepository {
  getAthleteProgress(athleteId: string): Promise<AthleteProgress | null>;
  // Trusted workflow only: athlete clients should not write progress records directly.
  saveAthleteProgress(progress: AthleteProgress): Promise<AthleteProgress>;
}
