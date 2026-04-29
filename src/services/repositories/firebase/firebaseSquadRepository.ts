import { where } from 'firebase/firestore';

import {
  mapSquadDocumentToSquad,
  squadPath,
  squadsCollectionPath,
  type SquadDocument,
} from '@/src/services/firebase';

import type { SquadRepository } from '../types';
import { readFirestoreDocument, readFirestoreQuery } from './firestoreRepositoryHelpers';

export const firebaseSquadRepository: SquadRepository = {
  async getSquadById(clubId, squadId) {
    const squad = await readFirestoreDocument<SquadDocument, ReturnType<typeof mapSquadDocumentToSquad>>(
      squadPath(clubId, squadId),
      mapSquadDocumentToSquad,
    );

    return squad?.clubId === clubId ? squad : null;
  },

  async listSquadsByClub(clubId) {
    return readFirestoreQuery<SquadDocument, ReturnType<typeof mapSquadDocumentToSquad>>(
      squadsCollectionPath(clubId),
      [where('clubId', '==', clubId)],
      mapSquadDocumentToSquad,
    );
  },
};
