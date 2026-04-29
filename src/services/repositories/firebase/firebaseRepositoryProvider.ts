import type { RepositoryProvider } from '../repositoryProvider';
import { firebaseAthleteRepository } from './firebaseAthleteRepository';
import { firebaseProgressReadRepository } from './firebaseProgressReadRepository';
import { firebaseQuestRepository } from './firebaseQuestRepository';
import { firebaseRewardReadRepository } from './firebaseRewardReadRepository';
import { firebaseSquadRepository } from './firebaseSquadRepository';
import { firebaseSubmissionReadRepository } from './firebaseSubmissionReadRepository';

export const firebaseRepositoryProvider: RepositoryProvider = {
  athleteRepository: firebaseAthleteRepository,
  squadRepository: firebaseSquadRepository,
  questRepository: firebaseQuestRepository,
  submissionReadRepository: firebaseSubmissionReadRepository,
  rewardReadRepository: firebaseRewardReadRepository,
  progressReadRepository: firebaseProgressReadRepository,
};
