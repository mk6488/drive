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
import { firebaseRepositoryProvider } from './firebase';
import { getMissingFirebaseConfigKeys, isFirebaseConfigComplete } from '@/src/services/firebase/firebaseConfig';
import { getRepositoryProviderModeStatus, getRequestedRepositoryProviderMode } from './repositoryProviderMode';
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

export function getRepositoryProviderStatus() {
  const modeStatus = getRepositoryProviderModeStatus();
  const firebaseConfigComplete = isFirebaseConfigComplete();
  const firebaseModeCanActivate = modeStatus.isFirebaseExplicitlyRequested && firebaseConfigComplete;

  return {
    ...modeStatus,
    activeProviderMode: firebaseModeCanActivate ? ('firebase' as const) : ('mock' as const),
    firebaseConfigComplete,
    missingFirebaseConfigKeys: getMissingFirebaseConfigKeys(),
    isUsingMockFallback: modeStatus.isFirebaseExplicitlyRequested && !firebaseConfigComplete,
  };
}

export function getRepositoryProvider(): RepositoryProvider {
  const requestedProviderMode = getRequestedRepositoryProviderMode();

  if (requestedProviderMode === 'firebase' && isFirebaseConfigComplete()) {
    return firebaseRepositoryProvider;
  }

  // Mock remains the safe default for preview mode, missing env values, invalid env values,
  // and explicitly requested Firebase mode without complete Firebase config.
  return mockRepositoryProvider;
}
