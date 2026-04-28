import {
  mockAthleteRepository,
  mockProgressReadRepository,
  mockQuestRepository,
  mockRewardReadRepository,
  mockSquadRepository,
  mockSubmissionReadRepository,
  mockTrustedProgressWriteRepository,
  mockTrustedRewardWriteRepository,
} from './mockRepositories';
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

export type RepositoryProvider = {
  athleteRepository: AthleteRepository;
  squadRepository: SquadRepository;
  questRepository: QuestRepository;
  submissionReadRepository: SubmissionReadRepository;
  rewardReadRepository: RewardReadRepository;
  progressReadRepository: ProgressReadRepository;
};

export const mockRepositoryProvider: RepositoryProvider = {
  athleteRepository: mockAthleteRepository,
  squadRepository: mockSquadRepository,
  questRepository: mockQuestRepository,
  submissionReadRepository: mockSubmissionReadRepository,
  rewardReadRepository: mockRewardReadRepository,
  progressReadRepository: mockProgressReadRepository,
};

// Submission writes, draft saving, and submit workflows are deliberately not exposed yet.
// Add them only in a later explicit workflow step with product approval.

// Trusted reward writes are deliberately outside the screen-facing provider.
// Athlete-facing UI screens must not call this boundary.
export const trustedRewardWriteRepository: TrustedRewardWriteRepository = mockTrustedRewardWriteRepository;

// Trusted progress writes are deliberately outside the screen-facing provider.
// Athlete-facing UI screens must not write XP, attributes, squad, River Map, or Boathouse progress.
export const trustedProgressWriteRepository: TrustedProgressWriteRepository = mockTrustedProgressWriteRepository;

export function getRepositoryProvider(): RepositoryProvider {
  // Mock backed only for now. Firebase provider selection is a later explicit step.
  // Future agents must not add Firebase, auth, config, or environment switching here without approval.
  return mockRepositoryProvider;
}
