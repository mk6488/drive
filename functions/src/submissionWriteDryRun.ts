export type SubmissionWriteDryRunMode = 'draft' | 'submit';
export type SubmissionWriteDryRunStatus = 'valid' | 'blocked';
export type SubmissionWriteDryRunPlannedStatus = 'draft' | 'submitted';
export type SubmissionWriteDryRunCheckStatus = 'passed' | 'blocked';

export interface SubmissionWriteDryRunInput {
  readonly mode: SubmissionWriteDryRunMode | string;
  readonly clubId?: string;
  readonly squadId?: string;
  readonly athleteId?: string;
  readonly questId?: string;
  readonly submissionId?: string;
  readonly createdByUserId?: string;
  readonly pm5PhotoPath?: string;
  readonly reflection?: string;
  readonly status?: string;
  readonly currentStatus?: string | null;
  readonly submittedAt?: string;
  readonly reviewedByUserId?: unknown;
  readonly reviewedAt?: unknown;
  readonly coachNote?: unknown;
  readonly rewardResultId?: unknown;
  readonly athleteProgress?: unknown;
  readonly squadProgress?: unknown;
}

export interface SubmissionWriteDryRunCheck {
  readonly id: string;
  readonly status: SubmissionWriteDryRunCheckStatus;
  readonly message: string;
}

export interface SubmissionWriteDryRunDocumentShape {
  readonly questId: string;
  readonly clubId: string;
  readonly squadId: string;
  readonly athleteId: string;
  readonly createdByUserId: string;
  readonly pm5PhotoPath: string;
  readonly reflection: string;
  readonly status: SubmissionWriteDryRunPlannedStatus;
  readonly submittedAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface SubmissionWriteDryRunSafetySummary {
  readonly noFirestoreWrite: true;
  readonly noFirestoreRead: true;
  readonly noStorageUpload: true;
  readonly noFirebaseAdminInitialisation: true;
  readonly noRewardOrProgressWrite: true;
  readonly fakeDataOnly: true;
  readonly liveSubmissionWriteImplemented: false;
}

export interface SubmissionWriteDryRunReport {
  readonly mode: SubmissionWriteDryRunMode | 'unknown';
  readonly status: SubmissionWriteDryRunStatus;
  readonly plannedSubmissionDocumentPath: string;
  readonly plannedFutureDocumentShape: SubmissionWriteDryRunDocumentShape | null;
  readonly checks: readonly SubmissionWriteDryRunCheck[];
  readonly blockedReasons: readonly string[];
  readonly safety: SubmissionWriteDryRunSafetySummary;
}

const exampleIds = {
  clubId: 'example-club',
  squadId: 'example-j15-squad',
  athleteId: 'example-athlete',
  questId: 'example-quest-rate-20',
  submissionId: 'example-submission-rate-20',
  createdByUserId: 'example-athlete-user',
  pm5PhotoPath: 'clubs/example-club/submissions/example-submission-rate-20/pm5/example-pm5-screen.jpg',
} as const;

const dryRunTimestamp = '2026-01-16T18:45:00.000Z';
const maxReflectionLength = 400;
const trainingFocusWords = [
  'pace',
  'pacing',
  'rate',
  'rhythm',
  'split',
  'control',
  'controlled',
  'session',
  'piece',
  'effort',
  'form',
  'steady',
  'erg',
  'training',
] as const;

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function normaliseMode(mode: string): SubmissionWriteDryRunMode | 'unknown' {
  return mode === 'draft' || mode === 'submit' ? mode : 'unknown';
}

function plannedStatusForMode(mode: SubmissionWriteDryRunMode | 'unknown'): SubmissionWriteDryRunPlannedStatus | null {
  if (mode === 'draft') {
    return 'draft';
  }

  if (mode === 'submit') {
    return 'submitted';
  }

  return null;
}

function createCheck(id: string, blocked: boolean, message: string): SubmissionWriteDryRunCheck {
  return {
    id,
    status: blocked ? 'blocked' : 'passed',
    message,
  };
}

function checkExactFakeId(fieldName: keyof typeof exampleIds, actualValue: string | undefined): SubmissionWriteDryRunCheck {
  const expectedValue = exampleIds[fieldName];
  const blocked = actualValue !== expectedValue;

  return createCheck(
    `fake-${fieldName}`,
    blocked,
    blocked
      ? `${fieldName} must use the fake example value ${expectedValue}.`
      : `${fieldName} uses the fake example value ${expectedValue}.`,
  );
}

function checkOptionalCreatedByUserId(createdByUserId: string | undefined): SubmissionWriteDryRunCheck {
  if (createdByUserId === undefined || createdByUserId === exampleIds.createdByUserId) {
    return createCheck('fake-createdByUserId', false, 'createdByUserId is omitted or uses the fake example athlete user.');
  }

  return createCheck('fake-createdByUserId', true, `createdByUserId must be omitted or ${exampleIds.createdByUserId}.`);
}

function checkStatus(input: SubmissionWriteDryRunInput, mode: SubmissionWriteDryRunMode | 'unknown') {
  const plannedStatus = plannedStatusForMode(mode);

  if (input.status === 'pending' || input.currentStatus === 'pending') {
    return createCheck('pending-forbidden', true, '`pending` is not a DRIVE submission domain status.');
  }

  if (input.status === 'verified' || input.currentStatus === 'verified') {
    return createCheck('verified-blocked', true, '`verified` remains coach-only and cannot be planned by an athlete dry run.');
  }

  if (input.status === 'rejected' || input.currentStatus === 'rejected') {
    return createCheck('rejected-blocked', true, '`rejected` remains coach-only and cannot be planned by an athlete dry run.');
  }

  if (plannedStatus === null) {
    return createCheck('mode-supported', true, 'Submission write dry runs support only draft and submit modes.');
  }

  if (input.status !== undefined && input.status !== plannedStatus) {
    return createCheck('mode-status-match', true, `${mode} dry run may only plan status ${plannedStatus}.`);
  }

  return createCheck('mode-status-match', false, `${mode} dry run plans status ${plannedStatus} only.`);
}

function checkForbiddenFields(input: SubmissionWriteDryRunInput): SubmissionWriteDryRunCheck[] {
  return [
    createCheck(
      'review-fields-excluded',
      input.reviewedByUserId !== undefined || input.reviewedAt !== undefined || input.coachNote !== undefined,
      'Coach review fields are excluded from athlete-side dry runs.',
    ),
    createCheck(
      'reward-result-excluded',
      input.rewardResultId !== undefined,
      'rewardResultId is excluded from athlete-side dry runs.',
    ),
    createCheck(
      'progress-writes-excluded',
      input.athleteProgress !== undefined || input.squadProgress !== undefined,
      'Athlete progress and squad progress writes are excluded.',
    ),
  ];
}

function checkPm5EvidencePath(input: SubmissionWriteDryRunInput, mode: SubmissionWriteDryRunMode | 'unknown') {
  if (mode === 'submit' && !hasText(input.pm5PhotoPath)) {
    return createCheck('submit-pm5-path-present', true, 'Submit dry run requires the fake PM5 evidence path.');
  }

  if (hasText(input.pm5PhotoPath) && input.pm5PhotoPath !== exampleIds.pm5PhotoPath) {
    return createCheck('fake-pm5-path', true, `PM5 evidence path must use the fake example path ${exampleIds.pm5PhotoPath}.`);
  }

  return createCheck(
    'fake-pm5-path',
    false,
    mode === 'submit'
      ? 'PM5 evidence path uses the fake example path.'
      : 'PM5 evidence path is absent for draft or uses the fake example path.',
  );
}

function checkReflection(reflection: string | undefined) {
  const trimmedReflection = reflection?.trim() ?? '';

  if (!trimmedReflection) {
    return createCheck('reflection-short-training-focused', true, 'Reflection must be present and training focused.');
  }

  if (trimmedReflection.length > maxReflectionLength) {
    return createCheck('reflection-short-training-focused', true, 'Reflection must stay short and training focused.');
  }

  const lowerReflection = trimmedReflection.toLowerCase();
  const appearsTrainingFocused = trainingFocusWords.some((word) => lowerReflection.includes(word));

  return createCheck(
    'reflection-short-training-focused',
    !appearsTrainingFocused,
    appearsTrainingFocused
      ? 'Reflection is short and training focused.'
      : 'Reflection should mention training execution such as pace, rate, rhythm, split, form, or session control.',
  );
}

function createPlannedDocumentShape(
  input: SubmissionWriteDryRunInput,
  mode: SubmissionWriteDryRunMode | 'unknown',
): SubmissionWriteDryRunDocumentShape | null {
  const status = plannedStatusForMode(mode);

  if (status === null) {
    return null;
  }

  return {
    questId: input.questId?.trim() ?? '',
    clubId: input.clubId?.trim() ?? '',
    squadId: input.squadId?.trim() ?? '',
    athleteId: input.athleteId?.trim() ?? '',
    createdByUserId: input.createdByUserId?.trim() || exampleIds.createdByUserId,
    pm5PhotoPath: input.pm5PhotoPath?.trim() ?? '',
    reflection: input.reflection?.trim() ?? '',
    status,
    submittedAt: status === 'submitted' ? dryRunTimestamp : undefined,
    createdAt: dryRunTimestamp,
    updatedAt: dryRunTimestamp,
  };
}

export function createSubmissionWriteDryRunReport(input: SubmissionWriteDryRunInput): SubmissionWriteDryRunReport {
  const mode = normaliseMode(input.mode);
  const checks: SubmissionWriteDryRunCheck[] = [
    createCheck('mode-supported', mode === 'unknown', 'Submission write dry runs support only draft and submit modes.'),
    checkExactFakeId('clubId', input.clubId),
    checkExactFakeId('squadId', input.squadId),
    checkExactFakeId('athleteId', input.athleteId),
    checkExactFakeId('questId', input.questId),
    checkExactFakeId('submissionId', input.submissionId),
    checkOptionalCreatedByUserId(input.createdByUserId),
    checkStatus(input, mode),
    checkPm5EvidencePath(input, mode),
    checkReflection(input.reflection),
    ...checkForbiddenFields(input),
  ];

  const blockedReasons = checks.filter((check) => check.status === 'blocked').map((check) => check.message);
  const plannedSubmissionDocumentPath = `clubs/${input.clubId ?? exampleIds.clubId}/submissions/${
    input.submissionId ?? exampleIds.submissionId
  }`;

  return {
    mode,
    status: blockedReasons.length === 0 ? 'valid' : 'blocked',
    plannedSubmissionDocumentPath,
    plannedFutureDocumentShape: blockedReasons.length === 0 ? createPlannedDocumentShape(input, mode) : null,
    checks,
    blockedReasons,
    safety: {
      noFirestoreWrite: true,
      noFirestoreRead: true,
      noStorageUpload: true,
      noFirebaseAdminInitialisation: true,
      noRewardOrProgressWrite: true,
      fakeDataOnly: true,
      liveSubmissionWriteImplemented: false,
    },
  };
}
