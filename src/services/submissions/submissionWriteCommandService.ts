import type { SubmissionStatus } from '@/src/types/submission';

export type SubmissionWriteCommandType = 'createOrUpdateDraft' | 'submitForCoachReview';
export type SubmissionWritePlanStatus = 'valid' | 'blocked';

export type SubmissionWriteBlockReason =
  | 'missingClubId'
  | 'missingSquadId'
  | 'missingAthleteId'
  | 'missingQuestId'
  | 'missingSubmissionId'
  | 'missingPm5PhotoPathForSubmit'
  | 'missingReflection'
  | 'reflectionTooLong'
  | 'pendingStatusForbidden'
  | 'athleteCannotWriteVerified'
  | 'athleteCannotWriteRejected'
  | 'invalidDraftStatus'
  | 'invalidSubmitStatus'
  | 'invalidAthleteStatusTransition'
  | 'submittedEvidenceLockedFromAthleteEdits'
  | 'rewardResultForbidden'
  | 'reviewFieldsForbidden'
  | 'progressWritesOutOfScope';

export interface SubmissionWriteTransitionCheck {
  fromStatus: SubmissionStatus | null;
  toStatus: SubmissionStatus;
  canTransition: boolean;
  blockReasons: SubmissionWriteBlockReason[];
  message: string;
}

export interface SubmissionWritePlan {
  commandType: SubmissionWriteCommandType;
  status: SubmissionWritePlanStatus;
  targetStatus: 'draft' | 'submitted';
  blockReasons: SubmissionWriteBlockReason[];
  summary: string;
  safePreview: {
    doesWriteFirestore: false;
    doesUploadStorage: false;
    doesWriteRewardsOrProgress: false;
    allowsCoachReviewFields: false;
  };
}

interface AthleteSubmissionForbiddenWriteFields {
  rewardResultId?: unknown;
  reviewedByUserId?: unknown;
  reviewedAt?: unknown;
  coachNote?: unknown;
  athleteProgress?: unknown;
  squadProgress?: unknown;
}

interface AthleteSubmissionWriteBaseInput extends AthleteSubmissionForbiddenWriteFields {
  clubId: string;
  squadId: string;
  athleteId: string;
  questId: string;
  submissionId: string;
  pm5PhotoPath?: string;
  reflection?: string;
  currentStatus?: SubmissionStatus | null;
  status?: SubmissionStatus | 'pending';
  createdByUserId?: string;
}

export interface AthleteDraftSubmissionWriteInput extends AthleteSubmissionWriteBaseInput {
  commandType?: 'createOrUpdateDraft';
  targetStatus?: 'draft';
}

export interface AthleteSubmitForReviewWriteInput extends AthleteSubmissionWriteBaseInput {
  commandType?: 'submitForCoachReview';
  currentStatus: SubmissionStatus;
  targetStatus?: 'submitted';
}

const maxReflectionLength = 400;

const blockReasonMessages: Record<SubmissionWriteBlockReason, string> = {
  missingClubId: 'Club id is required before a future athlete submission write can be planned.',
  missingSquadId: 'Squad id is required before a future athlete submission write can be planned.',
  missingAthleteId: 'Athlete id is required before a future athlete submission write can be planned.',
  missingQuestId: 'Quest id is required before a future athlete submission write can be planned.',
  missingSubmissionId: 'Submission id is required before a future athlete submission write can be planned.',
  missingPm5PhotoPathForSubmit: 'PM5 evidence path is required before an athlete can submit for coach review.',
  missingReflection: 'A short training reflection is required before an athlete can submit for coach review.',
  reflectionTooLong: 'Reflection must stay short and training focused.',
  pendingStatusForbidden: '`pending` is not a DRIVE submission domain status.',
  athleteCannotWriteVerified: 'Athlete write plans must not create or move to `verified`.',
  athleteCannotWriteRejected: 'Athlete write plans must not create or move to `rejected`.',
  invalidDraftStatus: 'Athlete draft write plans may only target `draft`.',
  invalidSubmitStatus: 'Athlete submit write plans may only target `submitted`.',
  invalidAthleteStatusTransition: 'Athlete write plans may only keep drafts as drafts or move drafts to submitted.',
  submittedEvidenceLockedFromAthleteEdits: 'Submitted evidence is locked from athlete edits for coach review.',
  rewardResultForbidden: 'Athlete write plans must not include reward result fields.',
  reviewFieldsForbidden: 'Athlete write plans must not include coach review fields.',
  progressWritesOutOfScope: 'Athlete and squad progress writes are out of scope.',
};

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function addReason(reasons: SubmissionWriteBlockReason[], reason: SubmissionWriteBlockReason) {
  if (!reasons.includes(reason)) {
    reasons.push(reason);
  }
}

function validateRequiredIds(
  input: AthleteDraftSubmissionWriteInput | AthleteSubmitForReviewWriteInput,
  reasons: SubmissionWriteBlockReason[],
) {
  if (!hasText(input.clubId)) {
    addReason(reasons, 'missingClubId');
  }

  if (!hasText(input.squadId)) {
    addReason(reasons, 'missingSquadId');
  }

  if (!hasText(input.athleteId)) {
    addReason(reasons, 'missingAthleteId');
  }

  if (!hasText(input.questId)) {
    addReason(reasons, 'missingQuestId');
  }

  if (!hasText(input.submissionId)) {
    addReason(reasons, 'missingSubmissionId');
  }
}

function validateForbiddenFields(
  input: AthleteDraftSubmissionWriteInput | AthleteSubmitForReviewWriteInput,
  reasons: SubmissionWriteBlockReason[],
) {
  if (input.rewardResultId !== undefined) {
    addReason(reasons, 'rewardResultForbidden');
  }

  if (input.reviewedByUserId !== undefined || input.reviewedAt !== undefined || input.coachNote !== undefined) {
    addReason(reasons, 'reviewFieldsForbidden');
  }

  if (input.athleteProgress !== undefined || input.squadProgress !== undefined) {
    addReason(reasons, 'progressWritesOutOfScope');
  }
}

function validateDomainStatus(
  input: AthleteDraftSubmissionWriteInput | AthleteSubmitForReviewWriteInput,
  reasons: SubmissionWriteBlockReason[],
) {
  if (input.status === 'pending') {
    addReason(reasons, 'pendingStatusForbidden');
  }

  if (input.status === 'verified' || input.currentStatus === 'verified') {
    addReason(reasons, 'athleteCannotWriteVerified');
  }

  if (input.status === 'rejected' || input.currentStatus === 'rejected') {
    addReason(reasons, 'athleteCannotWriteRejected');
  }
}

function validateReflection(reflection: string | undefined, shouldRequireReflection: boolean): SubmissionWriteBlockReason[] {
  const reasons: SubmissionWriteBlockReason[] = [];
  const trimmedReflection = reflection?.trim() ?? '';

  if (shouldRequireReflection && !trimmedReflection) {
    addReason(reasons, 'missingReflection');
  }

  if (trimmedReflection.length > maxReflectionLength) {
    addReason(reasons, 'reflectionTooLong');
  }

  return reasons;
}

export function canAthleteTransitionSubmissionStatus(
  fromStatus: SubmissionStatus | null | undefined,
  toStatus: SubmissionStatus,
): SubmissionWriteTransitionCheck {
  const normalisedFromStatus = fromStatus ?? null;
  const blockReasons: SubmissionWriteBlockReason[] = [];

  if (toStatus === 'verified') {
    addReason(blockReasons, 'athleteCannotWriteVerified');
  }

  if (toStatus === 'rejected') {
    addReason(blockReasons, 'athleteCannotWriteRejected');
  }

  if (normalisedFromStatus === 'submitted') {
    addReason(blockReasons, 'submittedEvidenceLockedFromAthleteEdits');
  }

  if (normalisedFromStatus === 'verified') {
    addReason(blockReasons, 'athleteCannotWriteVerified');
  }

  if (normalisedFromStatus === 'rejected') {
    addReason(blockReasons, 'athleteCannotWriteRejected');
  }

  const isAllowedTransition =
    (normalisedFromStatus === null && toStatus === 'draft') ||
    (normalisedFromStatus === 'draft' && (toStatus === 'draft' || toStatus === 'submitted'));

  if (!isAllowedTransition) {
    addReason(blockReasons, 'invalidAthleteStatusTransition');
  }

  return {
    fromStatus: normalisedFromStatus,
    toStatus,
    canTransition: blockReasons.length === 0,
    blockReasons,
    message:
      blockReasons.length === 0
        ? 'Athlete status transition is allowed for a future write plan.'
        : 'Athlete status transition is blocked by the submission write boundary.',
  };
}

export function validateAthleteSubmissionWriteInput(
  input: AthleteDraftSubmissionWriteInput | AthleteSubmitForReviewWriteInput,
): SubmissionWriteBlockReason[] {
  const reasons: SubmissionWriteBlockReason[] = [];

  validateRequiredIds(input, reasons);
  validateForbiddenFields(input, reasons);
  validateDomainStatus(input, reasons);

  for (const reason of validateReflection(input.reflection, false)) {
    addReason(reasons, reason);
  }

  return reasons;
}

function createPlan(
  commandType: SubmissionWriteCommandType,
  targetStatus: 'draft' | 'submitted',
  blockReasons: SubmissionWriteBlockReason[],
): SubmissionWritePlan {
  const status: SubmissionWritePlanStatus = blockReasons.length === 0 ? 'valid' : 'blocked';

  return {
    commandType,
    status,
    targetStatus,
    blockReasons,
    summary:
      status === 'valid'
        ? `Future ${commandType} command is valid for a ${targetStatus} submission document preview only.`
        : `Future ${commandType} command is blocked: ${blockReasons.map((reason) => blockReasonMessages[reason]).join(' ')}`,
    safePreview: {
      doesWriteFirestore: false,
      doesUploadStorage: false,
      doesWriteRewardsOrProgress: false,
      allowsCoachReviewFields: false,
    },
  };
}

export function createAthleteDraftSubmissionWritePlan(input: AthleteDraftSubmissionWriteInput): SubmissionWritePlan {
  const blockReasons = validateAthleteSubmissionWriteInput(input);
  const targetStatus = input.targetStatus ?? 'draft';

  if (targetStatus !== 'draft') {
    addReason(blockReasons, 'invalidDraftStatus');
  }

  const transition = canAthleteTransitionSubmissionStatus(input.currentStatus, 'draft');

  for (const reason of transition.blockReasons) {
    addReason(blockReasons, reason);
  }

  return createPlan('createOrUpdateDraft', 'draft', blockReasons);
}

export function createAthleteSubmitForReviewWritePlan(input: AthleteSubmitForReviewWriteInput): SubmissionWritePlan {
  const blockReasons = validateAthleteSubmissionWriteInput(input);
  const targetStatus = input.targetStatus ?? 'submitted';

  if (targetStatus !== 'submitted') {
    addReason(blockReasons, 'invalidSubmitStatus');
  }

  if (!hasText(input.pm5PhotoPath)) {
    addReason(blockReasons, 'missingPm5PhotoPathForSubmit');
  }

  for (const reason of validateReflection(input.reflection, true)) {
    addReason(blockReasons, reason);
  }

  const transition = canAthleteTransitionSubmissionStatus(input.currentStatus, 'submitted');

  for (const reason of transition.blockReasons) {
    addReason(blockReasons, reason);
  }

  return createPlan('submitForCoachReview', 'submitted', blockReasons);
}

export function getSubmissionWritePlanSummary(plan: SubmissionWritePlan): string {
  return plan.summary;
}

export function getSubmissionWriteBlockReasonMessage(reason: SubmissionWriteBlockReason): string {
  return blockReasonMessages[reason];
}
