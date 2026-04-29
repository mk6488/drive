import { where } from 'firebase/firestore';

import {
  mapRewardResultDocumentToRewardResult,
  rewardResultsCollectionPath,
  type RewardResultDocument,
} from '@/src/services/firebase';

import type { RewardReadRepository } from '../types';
import { readFirestoreQuery } from './firestoreRepositoryHelpers';

export const firebaseRewardReadRepository: RewardReadRepository = {
  async getRewardResultByVerifiedSubmissionId(clubId, athleteId, verifiedSubmissionId) {
    const rewards = await readFirestoreQuery<
      RewardResultDocument,
      ReturnType<typeof mapRewardResultDocumentToRewardResult>
    >(
      rewardResultsCollectionPath(clubId),
      [
        where('clubId', '==', clubId),
        where('athleteId', '==', athleteId),
        where('verifiedSubmissionId', '==', verifiedSubmissionId),
      ],
      mapRewardResultDocumentToRewardResult,
    );

    return rewards[0] ?? null;
  },

  async listRewardsForAthlete(clubId, athleteId) {
    return readFirestoreQuery<RewardResultDocument, ReturnType<typeof mapRewardResultDocumentToRewardResult>>(
      rewardResultsCollectionPath(clubId),
      [where('clubId', '==', clubId), where('athleteId', '==', athleteId)],
      mapRewardResultDocumentToRewardResult,
    );
  },
};
