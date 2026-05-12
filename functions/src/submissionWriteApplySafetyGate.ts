export const REQUIRED_SUBMISSION_WRITE_APPLY_CONFIRMATION_PHRASE = 'APPLY_DRIVE_SUBMISSION_WRITE';
export const REQUIRED_SUBMISSION_WRITE_CLUB_ID = 'example-club';
export const REQUIRED_SUBMISSION_WRITE_SQUAD_ID = 'example-j15-squad';
export const REQUIRED_SUBMISSION_WRITE_ATHLETE_ID = 'example-athlete';
export const REQUIRED_SUBMISSION_WRITE_QUEST_ID = 'example-quest-rate-20';
export const REQUIRED_SUBMISSION_WRITE_SUBMISSION_ID = 'example-submission-rate-20';

export type SubmissionWriteApplyMode = 'dryRun' | 'live';
export type SubmissionWriteApplyCommandType = 'createOrUpdateDraft' | 'submitForCoachReview';
export type SubmissionWriteApplyStatus = 'draft' | 'submitted' | 'pending' | 'verified' | 'rejected' | string;
export type SubmissionWriteApplyValidationStatus = 'valid' | 'blocked' | string;

export type SubmissionWriteApplyBlockReason =
  | 'missingConfirmationPhrase'
  | 'confirmationPhraseMismatch'
  | 'missingRequestedApplyMode'
  | 'requestedApplyModeNotLive'
  | 'submissionWriteApplyNotEnabled'
  | 'missingTrustedActorId'
  | 'missingAuditReason'
  | 'missingEnvironmentName'
  | 'missingValidDryRunOrWritePlan'
  | 'invalidWriteCommandType'
  | 'invalidAthleteWriteStatus'
  | 'pendingStatusBlocked'
  | 'verifiedStatusBlocked'
  | 'rejectedStatusBlocked'
  | 'reviewFieldsPresent'
  | 'rewardResultPresent'
  | 'progressWritesPresent'
  | 'missingPm5EvidencePathForSubmit'
  | 'clubIdNotExampleOnly'
  | 'squadIdNotExampleOnly'
  | 'athleteIdNotExampleOnly'
  | 'questIdNotExampleOnly'
  | 'submissionIdNotExampleOnly'
  | 'realJuniorDataPresent';

export interface SubmissionWriteApplySafetyGateInput {
  readonly requestedApplyMode: SubmissionWriteApplyMode | string | null;
  readonly confirmationPhrase: string | null;
  readonly submissionWriteApplyEnabled: boolean;
  readonly trustedActorId: string | null;
  readonly auditReason: string | null;
  readonly environmentName: string | null;
  readonly dryRunStatus?: SubmissionWriteApplyValidationStatus | null;
  readonly writePlanStatus?: SubmissionWriteApplyValidationStatus | null;
  readonly commandType: SubmissionWriteApplyCommandType | string | null;
  readonly status: SubmissionWriteApplyStatus | null;
  readonly clubId: string | null;
  readonly squadId: string | null;
  readonly athleteId: string | null;
  readonly questId: string | null;
  readonly submissionId: string | null;
  readonly pm5PhotoPath?: string | null;
  readonly reviewedByUserId?: unknown;
  readonly reviewedAt?: unknown;
  readonly coachNote?: unknown;
  readonly rewardResultId?: unknown;
  readonly athleteProgress?: unknown;
  readonly squadProgress?: unknown;
  readonly realJuniorDataPresent?: boolean;
}

export interface SubmissionWriteApplySafetyChecklist {
  readonly dryRunDisplayAllowed: boolean;
  readonly requestedApplyMode: SubmissionWriteApplyMode | null;
  readonly liveModeRequested: boolean;
  readonly hasConfirmationPhrase: boolean;
  readonly confirmationPhraseMatched: boolean;
  readonly requiredConfirmationPhrase: typeof REQUIRED_SUBMISSION_WRITE_APPLY_CONFIRMATION_PHRASE;
  readonly submissionWriteApplyEnabled: boolean;
  readonly hasTrustedActorId: boolean;
  readonly hasAuditReason: boolean;
  readonly hasEnvironmentName: boolean;
  readonly hasValidDryRunOrWritePlan: boolean;
  readonly commandTypeAllowed: boolean;
  readonly statusAllowedForAthleteWrite: boolean;
  readonly pendingBlocked: boolean;
  readonly verifiedBlocked: boolean;
  readonly rejectedBlocked: boolean;
  readonly reviewFieldsAbsent: boolean;
  readonly rewardResultAbsent: boolean;
  readonly progressWritesAbsent: boolean;
  readonly pm5EvidencePathPresentForSubmit: boolean;
  readonly usesExampleClubOnly: boolean;
  readonly usesExampleSquadOnly: boolean;
  readonly usesExampleAthleteOnly: boolean;
  readonly usesExampleQuestOnly: boolean;
  readonly usesExampleSubmissionOnly: boolean;
  readonly noRealJuniorData: boolean;
  readonly firestoreWritingAvoided: true;
  readonly firestoreDeletingAvoided: true;
  readonly storageUploadingAvoided: true;
  readonly firebaseAdminInitialisationAvoided: true;
  readonly rewardOrProgressWritingAvoided: true;
  readonly summary: readonly string[];
}

export interface SubmissionWriteApplySafetyGateResult {
  readonly status: 'blocked' | 'allowedForDisplay' | 'allowed';
  readonly canDisplayDryRun: boolean;
  readonly canApplySubmissionWriteNow: boolean;
  readonly futureLiveApplyWouldBeBlocked: boolean;
  readonly requestedApplyMode: SubmissionWriteApplyMode | null;
  readonly requiredConfirmationPhrase: typeof REQUIRED_SUBMISSION_WRITE_APPLY_CONFIRMATION_PHRASE;
  readonly blockReasons: readonly SubmissionWriteApplyBlockReason[];
  readonly checklist: SubmissionWriteApplySafetyChecklist;
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normaliseApplyMode(mode: SubmissionWriteApplySafetyGateInput['requestedApplyMode']): SubmissionWriteApplyMode | null {
  return mode === 'dryRun' || mode === 'live' ? mode : null;
}

function hasReviewFields(input: SubmissionWriteApplySafetyGateInput) {
  return input.reviewedByUserId !== undefined || input.reviewedAt !== undefined || input.coachNote !== undefined;
}

function hasProgressWrites(input: SubmissionWriteApplySafetyGateInput) {
  return input.athleteProgress !== undefined || input.squadProgress !== undefined;
}

function isAllowedCommandType(commandType: SubmissionWriteApplySafetyGateInput['commandType']) {
  return commandType === 'createOrUpdateDraft' || commandType === 'submitForCoachReview';
}

function isAllowedAthleteWriteStatus(status: SubmissionWriteApplySafetyGateInput['status']) {
  return status === 'draft' || status === 'submitted';
}

function isValidPlanningStatus(status: SubmissionWriteApplyValidationStatus | null | undefined) {
  return status === 'valid';
}

function getSafetySummary(
  blockReasons: readonly SubmissionWriteApplyBlockReason[],
  checklist: Omit<SubmissionWriteApplySafetyChecklist, 'summary'>,
) {
  return [
    checklist.dryRunDisplayAllowed
      ? 'Dry run mode may display the future write plan only.'
      : 'Dry run display is unavailable.',
    checklist.liveModeRequested
      ? 'Requested apply mode is live.'
      : 'Requested apply mode is not live, so future submission write apply must stay blocked.',
    checklist.confirmationPhraseMatched
      ? 'Required submission write confirmation phrase matched exactly.'
      : 'Required submission write confirmation phrase did not match exactly.',
    checklist.submissionWriteApplyEnabled
      ? 'Submission write apply environment flag is enabled in the input.'
      : 'Submission write apply environment flag is not enabled in the input.',
    checklist.hasTrustedActorId ? 'Trusted actor id is present.' : 'Trusted actor id is missing.',
    checklist.hasAuditReason ? 'Audit reason is present.' : 'Audit reason is missing.',
    checklist.hasEnvironmentName ? 'Environment name is present.' : 'Environment name is missing.',
    checklist.hasValidDryRunOrWritePlan
      ? 'Dry run report or write plan status is valid.'
      : 'Dry run report or write plan status is not valid.',
    checklist.commandTypeAllowed
      ? 'Write command type is limited to athlete draft or submit.'
      : 'Write command type is not allowed.',
    checklist.statusAllowedForAthleteWrite
      ? 'Submission status is limited to draft or submitted.'
      : 'Submission status is not allowed for athlete-side apply.',
    checklist.reviewFieldsAbsent
      ? 'Coach review fields are absent.'
      : 'Coach review fields are present and must stay blocked.',
    checklist.rewardResultAbsent
      ? 'Reward result field is absent.'
      : 'Reward result field is present and must stay blocked.',
    checklist.progressWritesAbsent
      ? 'Athlete and squad progress writes are absent.'
      : 'Athlete or squad progress writes are present and must stay blocked.',
    checklist.pm5EvidencePathPresentForSubmit
      ? 'PM5 evidence path requirement is satisfied for the requested command.'
      : 'PM5 evidence path is missing for submit for coach review.',
    checklist.noRealJuniorData ? 'No real junior data was indicated.' : 'Real junior data was indicated.',
    blockReasons.length === 0
      ? 'All future live submission write safety gates passed.'
      : 'One or more future live submission write safety gates blocked execution.',
  ];
}

function getSubmissionWriteApplyBlockReasonsFromChecklist(
  checklist: Omit<SubmissionWriteApplySafetyChecklist, 'summary'>,
): readonly SubmissionWriteApplyBlockReason[] {
  const blockReasons: SubmissionWriteApplyBlockReason[] = [];

  if (!checklist.hasConfirmationPhrase) {
    blockReasons.push('missingConfirmationPhrase');
  } else if (!checklist.confirmationPhraseMatched) {
    blockReasons.push('confirmationPhraseMismatch');
  }

  if (checklist.requestedApplyMode === null) {
    blockReasons.push('missingRequestedApplyMode');
  }

  if (!checklist.liveModeRequested) {
    blockReasons.push('requestedApplyModeNotLive');
  }

  if (!checklist.submissionWriteApplyEnabled) {
    blockReasons.push('submissionWriteApplyNotEnabled');
  }

  if (!checklist.hasTrustedActorId) {
    blockReasons.push('missingTrustedActorId');
  }

  if (!checklist.hasAuditReason) {
    blockReasons.push('missingAuditReason');
  }

  if (!checklist.hasEnvironmentName) {
    blockReasons.push('missingEnvironmentName');
  }

  if (!checklist.hasValidDryRunOrWritePlan) {
    blockReasons.push('missingValidDryRunOrWritePlan');
  }

  if (!checklist.commandTypeAllowed) {
    blockReasons.push('invalidWriteCommandType');
  }

  if (!checklist.statusAllowedForAthleteWrite) {
    blockReasons.push('invalidAthleteWriteStatus');
  }

  if (!checklist.pendingBlocked) {
    blockReasons.push('pendingStatusBlocked');
  }

  if (!checklist.verifiedBlocked) {
    blockReasons.push('verifiedStatusBlocked');
  }

  if (!checklist.rejectedBlocked) {
    blockReasons.push('rejectedStatusBlocked');
  }

  if (!checklist.reviewFieldsAbsent) {
    blockReasons.push('reviewFieldsPresent');
  }

  if (!checklist.rewardResultAbsent) {
    blockReasons.push('rewardResultPresent');
  }

  if (!checklist.progressWritesAbsent) {
    blockReasons.push('progressWritesPresent');
  }

  if (!checklist.pm5EvidencePathPresentForSubmit) {
    blockReasons.push('missingPm5EvidencePathForSubmit');
  }

  if (!checklist.usesExampleClubOnly) {
    blockReasons.push('clubIdNotExampleOnly');
  }

  if (!checklist.usesExampleSquadOnly) {
    blockReasons.push('squadIdNotExampleOnly');
  }

  if (!checklist.usesExampleAthleteOnly) {
    blockReasons.push('athleteIdNotExampleOnly');
  }

  if (!checklist.usesExampleQuestOnly) {
    blockReasons.push('questIdNotExampleOnly');
  }

  if (!checklist.usesExampleSubmissionOnly) {
    blockReasons.push('submissionIdNotExampleOnly');
  }

  if (!checklist.noRealJuniorData) {
    blockReasons.push('realJuniorDataPresent');
  }

  return Array.from(new Set(blockReasons));
}

export function getSubmissionWriteApplyChecklist(
  input: SubmissionWriteApplySafetyGateInput,
): SubmissionWriteApplySafetyChecklist {
  const requestedApplyMode = normaliseApplyMode(input.requestedApplyMode);
  const hasConfirmationPhrase = hasText(input.confirmationPhrase);
  const checklistWithoutSummary = {
    dryRunDisplayAllowed: requestedApplyMode === 'dryRun',
    requestedApplyMode,
    liveModeRequested: requestedApplyMode === 'live',
    hasConfirmationPhrase,
    confirmationPhraseMatched: input.confirmationPhrase === REQUIRED_SUBMISSION_WRITE_APPLY_CONFIRMATION_PHRASE,
    requiredConfirmationPhrase: REQUIRED_SUBMISSION_WRITE_APPLY_CONFIRMATION_PHRASE,
    submissionWriteApplyEnabled: input.submissionWriteApplyEnabled === true,
    hasTrustedActorId: hasText(input.trustedActorId),
    hasAuditReason: hasText(input.auditReason),
    hasEnvironmentName: hasText(input.environmentName),
    hasValidDryRunOrWritePlan: isValidPlanningStatus(input.dryRunStatus) || isValidPlanningStatus(input.writePlanStatus),
    commandTypeAllowed: isAllowedCommandType(input.commandType),
    statusAllowedForAthleteWrite: isAllowedAthleteWriteStatus(input.status),
    pendingBlocked: input.status !== 'pending',
    verifiedBlocked: input.status !== 'verified',
    rejectedBlocked: input.status !== 'rejected',
    reviewFieldsAbsent: !hasReviewFields(input),
    rewardResultAbsent: input.rewardResultId === undefined,
    progressWritesAbsent: !hasProgressWrites(input),
    pm5EvidencePathPresentForSubmit: input.commandType !== 'submitForCoachReview' || hasText(input.pm5PhotoPath),
    usesExampleClubOnly: input.clubId === REQUIRED_SUBMISSION_WRITE_CLUB_ID,
    usesExampleSquadOnly: input.squadId === REQUIRED_SUBMISSION_WRITE_SQUAD_ID,
    usesExampleAthleteOnly: input.athleteId === REQUIRED_SUBMISSION_WRITE_ATHLETE_ID,
    usesExampleQuestOnly: input.questId === REQUIRED_SUBMISSION_WRITE_QUEST_ID,
    usesExampleSubmissionOnly: input.submissionId === REQUIRED_SUBMISSION_WRITE_SUBMISSION_ID,
    noRealJuniorData: input.realJuniorDataPresent !== true,
    firestoreWritingAvoided: true,
    firestoreDeletingAvoided: true,
    storageUploadingAvoided: true,
    firebaseAdminInitialisationAvoided: true,
    rewardOrProgressWritingAvoided: true,
  } satisfies Omit<SubmissionWriteApplySafetyChecklist, 'summary'>;
  const blockReasons = getSubmissionWriteApplyBlockReasonsFromChecklist(checklistWithoutSummary);

  return {
    ...checklistWithoutSummary,
    summary: getSafetySummary(blockReasons, checklistWithoutSummary),
  };
}

export function evaluateSubmissionWriteApplySafetyGate(
  input: SubmissionWriteApplySafetyGateInput,
): SubmissionWriteApplySafetyGateResult {
  const checklist = getSubmissionWriteApplyChecklist(input);
  const blockReasons = getSubmissionWriteApplyBlockReasonsFromChecklist(checklist);
  const canApplySubmissionWriteNow = blockReasons.length === 0;
  const canDisplayDryRun = checklist.dryRunDisplayAllowed;

  return {
    status: canApplySubmissionWriteNow ? 'allowed' : canDisplayDryRun ? 'allowedForDisplay' : 'blocked',
    canDisplayDryRun,
    canApplySubmissionWriteNow,
    futureLiveApplyWouldBeBlocked: !canApplySubmissionWriteNow,
    requestedApplyMode: checklist.requestedApplyMode,
    requiredConfirmationPhrase: REQUIRED_SUBMISSION_WRITE_APPLY_CONFIRMATION_PHRASE,
    blockReasons,
    checklist,
  };
}

export function getSubmissionWriteApplySafetyMessage(result: SubmissionWriteApplySafetyGateResult) {
  if (result.canApplySubmissionWriteNow) {
    return 'Live submission write safety gate allowed apply for this trusted caller only.';
  }

  if (result.canDisplayDryRun) {
    return 'Dry run output may be displayed, but future live submission write apply remains blocked until every safety gate passes.';
  }

  return 'Future live submission write apply remains blocked until every safety gate passes.';
}
