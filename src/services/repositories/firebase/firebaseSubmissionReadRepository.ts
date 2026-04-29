import { where } from 'firebase/firestore';

import {
  mapSubmissionDocumentToSubmission,
  submissionPath,
  submissionsCollectionPath,
  type SubmissionDocument,
} from '@/src/services/firebase';

import type { SubmissionReadRepository } from '../types';
import { readFirestoreDocument, readFirestoreQuery } from './firestoreRepositoryHelpers';

function isSubmissionInRequestedScope(
  submission: ReturnType<typeof mapSubmissionDocumentToSubmission>,
  clubId: string,
  squadId: string,
  athleteId: string,
) {
  return submission.clubId === clubId && submission.squadId === squadId && submission.athleteId === athleteId;
}

export const firebaseSubmissionReadRepository: SubmissionReadRepository = {
  async getSubmissionById(clubId, squadId, athleteId, submissionId) {
    const submission = await readFirestoreDocument<
      SubmissionDocument,
      ReturnType<typeof mapSubmissionDocumentToSubmission>
    >(submissionPath(clubId, submissionId), mapSubmissionDocumentToSubmission);

    return submission && isSubmissionInRequestedScope(submission, clubId, squadId, athleteId) ? submission : null;
  },

  async listSubmissionsForAthlete(clubId, squadId, athleteId) {
    return readFirestoreQuery<SubmissionDocument, ReturnType<typeof mapSubmissionDocumentToSubmission>>(
      submissionsCollectionPath(clubId),
      [where('clubId', '==', clubId), where('squadId', '==', squadId), where('athleteId', '==', athleteId)],
      mapSubmissionDocumentToSubmission,
    );
  },
};
