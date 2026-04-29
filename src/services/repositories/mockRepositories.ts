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

import {
  mockAthlete,
  mockAthleteProgress,
  mockBoathouseProgress,
  mockQuest,
  mockRiverMapProgress,
  mockSquad,
  mockSquadMission,
  mockSquadMissionProgress,
  mockSubmission,
} from './mockData';
import type {
  AthleteRepository,
  ProgressReadRepository,
  QuestRepository,
  RewardReadRepository,
  SquadRepository,
  SubmissionReadRepository,
  TrustedProgressWriteRepository,
  TrustedRewardWriteRepository,
} from './types';

const delay = async () => Promise.resolve();

const athleteStore: Athlete[] = [mockAthlete];
const squadStore: Squad[] = [mockSquad];
const questStore: Quest[] = [mockQuest];
const submissionStore: Submission[] = [mockSubmission];
const progressStore: AthleteProgress[] = [mockAthleteProgress];
const squadMissionStore: SquadMission[] = [mockSquadMission];
const squadMissionProgressStore: SquadMissionProgress[] = [mockSquadMissionProgress];
const riverMapProgressStore: RiverMapProgress[] = [mockRiverMapProgress];
const boathouseProgressStore: BoathouseProgress[] = [mockBoathouseProgress];
const rewardStore: RewardResult[] = [];

export const mockAthleteRepository: AthleteRepository = {
  async getAthleteById(clubId, athleteId) {
    await delay();
    return athleteStore.find((athlete) => athlete.clubId === clubId && athlete.id === athleteId) ?? null;
  },
  async listAthletesBySquad(clubId, squadId) {
    await delay();
    return athleteStore.filter((athlete) => athlete.clubId === clubId && athlete.squadId === squadId);
  },
};

export const mockSquadRepository: SquadRepository = {
  async getSquadById(clubId, squadId) {
    await delay();
    return squadStore.find((squad) => squad.clubId === clubId && squad.id === squadId) ?? null;
  },
  async listSquadsByClub(clubId) {
    await delay();
    return squadStore.filter((squad) => squad.clubId === clubId);
  },
};

export const mockQuestRepository: QuestRepository = {
  async getQuestById(clubId, questId) {
    await delay();
    return questStore.find((quest) => quest.clubId === clubId && quest.id === questId) ?? null;
  },
  async listQuestsForSquad(clubId, squadId) {
    await delay();
    return questStore.filter((quest) => quest.clubId === clubId && quest.squadId === squadId);
  },
};

export const mockSubmissionReadRepository: SubmissionReadRepository = {
  async getSubmissionById(clubId, squadId, athleteId, submissionId) {
    await delay();
    return (
      submissionStore.find(
        (submission) =>
          submission.clubId === clubId &&
          submission.squadId === squadId &&
          submission.athleteId === athleteId &&
          submission.id === submissionId,
      ) ?? null
    );
  },
  async listSubmissionsForAthlete(clubId, squadId, athleteId) {
    await delay();
    return submissionStore.filter(
      (submission) =>
        submission.clubId === clubId && submission.squadId === squadId && submission.athleteId === athleteId,
    );
  },
};

export const mockRewardReadRepository: RewardReadRepository = {
  async getRewardResultByVerifiedSubmissionId(clubId, athleteId, verifiedSubmissionId) {
    await delay();
    const submission = submissionStore.find(
      (item) =>
        item.clubId === clubId && item.athleteId === athleteId && item.id === verifiedSubmissionId && item.status === 'verified',
    );

    if (!submission) {
      return null;
    }

    return rewardStore.find((reward) => reward.athleteId === athleteId && reward.verifiedSubmissionId === verifiedSubmissionId) ?? null;
  },
  async listRewardsForAthlete(clubId, athleteId) {
    await delay();
    const clubSubmissionIds = new Set(
      submissionStore.filter((submission) => submission.clubId === clubId).map((submission) => submission.id),
    );

    return rewardStore.filter((reward) => reward.athleteId === athleteId && clubSubmissionIds.has(reward.verifiedSubmissionId));
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
  async getAthleteProgress(clubId, athleteId) {
    await delay();
    return progressStore.find((progress) => progress.clubId === clubId && progress.athleteId === athleteId) ?? null;
  },
  async getSquadMission(clubId, squadId) {
    await delay();
    const squad = squadStore.find((item) => item.clubId === clubId && item.id === squadId);
    return squad ? (squadMissionStore.find((mission) => mission.squadId === squadId) ?? null) : null;
  },
  async getSquadMissionProgress(clubId, squadId) {
    await delay();
    const squad = squadStore.find((item) => item.clubId === clubId && item.id === squadId);
    return squad ? (squadMissionProgressStore.find((progress) => progress.squadId === squadId) ?? null) : null;
  },
  async getRiverMapProgress(clubId, squadId) {
    await delay();
    const squad = squadStore.find((item) => item.clubId === clubId && item.id === squadId);
    return squad ? (riverMapProgressStore.find((progress) => progress.squadId === squadId) ?? null) : null;
  },
  async getBoathouseProgress(clubId, squadId) {
    await delay();
    const squad = squadStore.find((item) => item.clubId === clubId && item.id === squadId);
    return squad ? (boathouseProgressStore.find((progress) => progress.squadId === squadId) ?? null) : null;
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

// This mock boundary is for preview reads and shape validation only.
// Reward and progress trusted write boundaries are for service-side workflows only.
// Athlete-facing previews should depend on read repositories.
