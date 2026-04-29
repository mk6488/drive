import { where } from 'firebase/firestore';

import {
  mapQuestDocumentToQuest,
  questPath,
  questsCollectionPath,
  type QuestDocument,
} from '@/src/services/firebase';

import type { QuestRepository } from '../types';
import { readFirestoreDocument, readFirestoreQuery } from './firestoreRepositoryHelpers';

export const firebaseQuestRepository: QuestRepository = {
  async getQuestById(clubId, questId) {
    const quest = await readFirestoreDocument<QuestDocument, ReturnType<typeof mapQuestDocumentToQuest>>(
      questPath(clubId, questId),
      mapQuestDocumentToQuest,
    );

    return quest?.clubId === clubId ? quest : null;
  },

  async listQuestsForSquad(clubId, squadId) {
    return readFirestoreQuery<QuestDocument, ReturnType<typeof mapQuestDocumentToQuest>>(
      questsCollectionPath(clubId),
      [where('clubId', '==', clubId), where('squadId', '==', squadId)],
      mapQuestDocumentToQuest,
    );
  },
};
