import type { SubmissionDocumentDraft } from '@/src/services/firebase/firestoreDocuments';
import { mapSubmissionDraftToSubmissionDocumentDraft } from '@/src/services/firebase/firestoreMappers';

import {
  createAthleteDraftSubmissionWritePlan,
  createAthleteSubmitForReviewWritePlan,
  type AthleteDraftSubmissionWriteInput,
  type AthleteSubmitForReviewWriteInput,
  type SubmissionWritePlan,
} from './submissionWriteCommandService';

export interface SubmissionWriteDocumentPlan {
  writePlan: SubmissionWritePlan;
  submissionId: string;
  documentPath: string;
  documentDraft: SubmissionDocumentDraft | null;
  notes: string[];
}

function buildSubmissionDocumentPath(clubId: string, submissionId: string): string {
  return `clubs/${clubId}/submissions/${submissionId}`;
}

function buildDraftDocument(
  input: AthleteDraftSubmissionWriteInput | AthleteSubmitForReviewWriteInput,
  status: 'draft' | 'submitted',
): SubmissionDocumentDraft {
  return mapSubmissionDraftToSubmissionDocumentDraft({
    questId: input.questId.trim(),
    clubId: input.clubId.trim(),
    squadId: input.squadId.trim(),
    athleteId: input.athleteId.trim(),
    createdByUserId: input.createdByUserId?.trim() || input.athleteId.trim(),
    pm5PhotoPath: input.pm5PhotoPath?.trim() ?? '',
    reflection: input.reflection?.trim() ?? '',
    status,
    submittedAt: status === 'submitted' ? new Date(0).toISOString() : undefined,
    updatedAt: new Date(0).toISOString(),
  });
}

function createDocumentPlan(
  input: AthleteDraftSubmissionWriteInput | AthleteSubmitForReviewWriteInput,
  writePlan: SubmissionWritePlan,
): SubmissionWriteDocumentPlan {
  return {
    writePlan,
    submissionId: input.submissionId,
    documentPath: buildSubmissionDocumentPath(input.clubId, input.submissionId),
    documentDraft: writePlan.status === 'valid' ? buildDraftDocument(input, writePlan.targetStatus) : null,
    notes: [
      'Plain object preview only; no Firestore write happens.',
      'No Firebase import, repository call, or Storage upload happens here.',
      'Athlete-side document drafts are limited to draft or submitted status.',
      'Coach review, reward, athlete progress, and squad progress fields are excluded.',
    ],
  };
}

export function createAthleteDraftSubmissionWriteDocumentPlan(
  input: AthleteDraftSubmissionWriteInput,
): SubmissionWriteDocumentPlan {
  return createDocumentPlan(input, createAthleteDraftSubmissionWritePlan(input));
}

export function createAthleteSubmitForReviewWriteDocumentPlan(
  input: AthleteSubmitForReviewWriteInput,
): SubmissionWriteDocumentPlan {
  return createDocumentPlan(input, createAthleteSubmitForReviewWritePlan(input));
}
