import type { Athlete, AthleteProgress, Quest, RewardResult, Squad, Submission } from '@/src/types';

import { mockAthlete, mockAthleteProgress, mockQuest, mockSquad, mockSubmission } from './mockData';
import type {
  AthleteRepository,
  ProgressReadRepository,
  QuestRepository,
  RewardReadRepository,
  SquadRepository,
  SubmissionRepository,
  TrustedProgressWriteRepository,
  TrustedRewardWriteRepository,
} from './types';

const delay = async () => Promise.resolve();

const athleteStore: Athlete[] = [mockAthlete];
const squadStore: Squad[] = [mockSquad];
const questStore: Quest[] = [mockQuest];
const submissionStore: Submission[] = [mockSubmission];
const progressStore: AthleteProgress[] = [mockAthleteProgress];
const rewardStore: RewardResult[] = [];

export const mockAthleteRepository: AthleteRepository = {
  async getAthleteById(athleteId) {
    await delay();
    return athleteStore.find((athlete) => athlete.id === athleteId) ?? null;
  },
  async listAthletesBySquad(clubId, squadId) {
    await delay();
    return athleteStore.filter((athlete) => athlete.clubId === clubId && athlete.squadId === squadId);
  },
};

export const mockSquadRepository: SquadRepository = {
  async getSquadById(squadId) {
    await delay();
    return squadStore.find((squad) => squad.id === squadId) ?? null;
  },
  async listSquadsByClub(clubId) {
    await delay();
    return squadStore.filter((squad) => squad.clubId === clubId);
  },
};

export const mockQuestRepository: QuestRepository = {
  async getQuestById(questId) {
    await delay();
    return questStore.find((quest) => quest.id === questId) ?? null;
  },
  async listQuestsForSquad(clubId, squadId) {
    await delay();
    return questStore.filter((quest) => quest.clubId === clubId && quest.squadId === squadId);
  },
};

export const mockSubmissionRepository: SubmissionRepository = {
  async getSubmissionById(submissionId) {
    await delay();
    return submissionStore.find((submission) => submission.id === submissionId) ?? null;
  },
  async listSubmissionsForAthlete(athleteId) {
    await delay();
    return submissionStore.filter((submission) => submission.athleteId === athleteId);
  },
  async saveAthleteSubmissionDraft(submission) {
    await delay();
    const existingSubmissionIndex = submissionStore.findIndex((item) => item.id === submission.id);

    if (existingSubmissionIndex >= 0) {
      submissionStore[existingSubmissionIndex] = submission;
    } else {
      submissionStore.push(submission);
    }

    return submission;
  },
};

export const mockRewardReadRepository: RewardReadRepository = {
  async getRewardResultByVerifiedSubmissionId(verifiedSubmissionId) {
    await delay();
    return rewardStore.find((reward) => reward.verifiedSubmissionId === verifiedSubmissionId) ?? null;
  },
  async listRewardsForAthlete(athleteId) {
    await delay();
    return rewardStore.filter((reward) => reward.athleteId === athleteId);
  },
};

export const mockTrustedRewardWriteRepository: TrustedRewardWriteRepository = {
  async saveRewardResult(result) {
    await delay();
    const existingRewardIndex = rewardStore.findIndex((reward) => reward.id === result.id);

    if (existingRewardIndex >= 0) {
      rewardStore[existingRewardIndex] = result;
    } else {
      rewardStore.push(result);
    }

    return result;
  },
};

export const mockProgressReadRepository: ProgressReadRepository = {
  async getAthleteProgress(athleteId) {
    await delay();
    return progressStore.find((progress) => progress.athleteId === athleteId) ?? null;
  },
};

export const mockTrustedProgressWriteRepository: TrustedProgressWriteRepository = {
  async saveAthleteProgress(progress) {
    await delay();
    const existingProgressIndex = progressStore.findIndex((item) => item.athleteId === progress.athleteId);

    if (existingProgressIndex >= 0) {
      progressStore[existingProgressIndex] = progress;
    } else {
      progressStore.push(progress);
    }

    return progress;
  },
};

export const mockRewardRepository = {
  ...mockRewardReadRepository,
  ...mockTrustedRewardWriteRepository,
};

export const mockProgressRepository = {
  ...mockProgressReadRepository,
  ...mockTrustedProgressWriteRepository,
};

// This mock boundary is for preview reads and shape validation only.
// Reward and progress trusted write boundaries are for service-side workflows only.
// Athlete-facing previews should depend on read repositories.
