import { where } from 'firebase/firestore';

import {
  athletePath,
  athletesCollectionPath,
  mapAthleteDocumentToAthlete,
  type AthleteDocument,
} from '@/src/services/firebase';

import type { AthleteRepository } from '../types';
import { readFirestoreDocument, readFirestoreQuery } from './firestoreRepositoryHelpers';

export const firebaseAthleteRepository: AthleteRepository = {
  async getAthleteById(clubId, athleteId) {
    const athlete = await readFirestoreDocument<AthleteDocument, ReturnType<typeof mapAthleteDocumentToAthlete>>(
      athletePath(clubId, athleteId),
      mapAthleteDocumentToAthlete,
    );

    return athlete?.clubId === clubId ? athlete : null;
  },

  async listAthletesBySquad(clubId, squadId) {
    return readFirestoreQuery<AthleteDocument, ReturnType<typeof mapAthleteDocumentToAthlete>>(
      athletesCollectionPath(clubId),
      [where('clubId', '==', clubId), where('squadId', '==', squadId)],
      mapAthleteDocumentToAthlete,
    );
  },
};
