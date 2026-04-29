import {
  athleteProgressPath,
  mapAthleteProgressDocumentToAthleteProgress,
  mapSquadProgressDocumentToSquadProgress,
  squadProgressPath,
  type AthleteProgressDocument,
  type SquadProgressDocument,
} from '@/src/services/firebase';

import type { ProgressReadRepository } from '../types';
import { readFirestoreDocument } from './firestoreRepositoryHelpers';

export const firebaseProgressReadRepository: ProgressReadRepository = {
  async getAthleteProgress(clubId, athleteId) {
    const progress = await readFirestoreDocument<
      AthleteProgressDocument,
      ReturnType<typeof mapAthleteProgressDocumentToAthleteProgress>
    >(athleteProgressPath(clubId, athleteId), mapAthleteProgressDocumentToAthleteProgress);

    return progress?.clubId === clubId && progress.athleteId === athleteId ? progress : null;
  },

  async getSquadMission(clubId, squadId) {
    if (!clubId || !squadId) {
      return null;
    }

    // No live squad mission document shape exists yet, so this repository does not invent one.
    return null;
  },

  async getSquadMissionProgress(clubId, squadId) {
    const progress = await readFirestoreDocument<
      SquadProgressDocument,
      ReturnType<typeof mapSquadProgressDocumentToSquadProgress>
    >(squadProgressPath(clubId, squadId), mapSquadProgressDocumentToSquadProgress);

    return progress?.squadId === squadId ? progress : null;
  },

  async getRiverMapProgress(clubId, squadId) {
    if (!clubId || !squadId) {
      return null;
    }

    // River Map live document mapping is future work; avoid fabricating preview-only progress from Firestore.
    return null;
  },

  async getBoathouseProgress(clubId, squadId) {
    if (!clubId || !squadId) {
      return null;
    }

    // Boathouse live document mapping is future work; avoid fabricating preview-only progress from Firestore.
    return null;
  },
};
