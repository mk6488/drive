import type { ClaimAssignmentValidationResult, DriveClaimRole } from './roleClaims';
import type { RoleAssignmentAuditDraft } from './roleAssignmentAudit';

export const REQUIRED_CLAIM_APPLY_CONFIRMATION_PHRASE = 'APPLY_DRIVE_ROLE_CLAIMS';

export type ClaimApplyMode = 'dryRun' | 'apply';

export type ClaimApplyBlockReason =
  | 'invalidClaimValidation'
  | 'missingAuditDraft'
  | 'missingTrustedActorId'
  | 'missingAuditReason'
  | 'adminFutureApplyBlocked'
  | 'missingClubScope'
  | 'missingLinkedAthleteId'
  | 'missingConfirmationPhrase'
  | 'confirmationPhraseMismatch'
  | 'missingRequestedApplyMode'
  | 'realApplyNotImplemented';

export type ClaimApplySafetyGateInput = {
  validationResult: ClaimAssignmentValidationResult | null;
  auditDraft: RoleAssignmentAuditDraft | null;
  confirmationPhrase: string | null;
  requestedApplyMode: ClaimApplyMode | null;
  trustedActorId: string | null;
  auditReason: string | null;
  environmentName: string | null;
};

export type ClaimApplySafetyChecklist = {
  dryRunValidationDisplayAllowed: true;
  validationPassed: boolean;
  hasAuditDraft: boolean;
  hasTrustedActorId: boolean;
  hasAuditReason: boolean;
  hasRequestedApplyMode: boolean;
  requestedApplyMode: ClaimApplyMode | null;
  hasNarrowClubScope: boolean;
  hasLinkedAthleteIdForAthleteRole: boolean;
  adminFutureApplyBlocked: boolean;
  hasConfirmationPhrase: boolean;
  confirmationPhraseMatched: boolean;
  requiredConfirmationPhrase: typeof REQUIRED_CLAIM_APPLY_CONFIRMATION_PHRASE;
  environmentName: string;
  realApplyExecutionAllowed: false;
  firebaseAdminInitialisationAvoided: true;
  customClaimWritingAvoided: true;
  auditRecordWritingAvoided: true;
  summary: readonly string[];
};

export type ClaimApplySafetyGateResult = {
  status: 'blocked';
  canDisplayDryRunValidation: true;
  canApplyClaimsNow: false;
  futureApplyWouldBeBlocked: boolean;
  requestedApplyMode: ClaimApplyMode | null;
  requiredConfirmationPhrase: typeof REQUIRED_CLAIM_APPLY_CONFIRMATION_PHRASE;
  blockReasons: readonly ClaimApplyBlockReason[];
  checklist: ClaimApplySafetyChecklist;
};

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getRole(input: ClaimApplySafetyGateInput): DriveClaimRole | null {
  return input.validationResult?.role ?? input.auditDraft?.role ?? null;
}

function hasClubScope(input: ClaimApplySafetyGateInput) {
  return hasText(input.auditDraft?.clubId);
}

function hasLinkedAthleteIdForAthleteRole(input: ClaimApplySafetyGateInput) {
  const role = getRole(input);

  return role !== 'athlete' || hasText(input.auditDraft?.linkedAthleteId);
}

function hasTrustedActorId(input: ClaimApplySafetyGateInput) {
  return hasText(input.trustedActorId) || hasText(input.auditDraft?.trustedActorId);
}

function hasAuditReason(input: ClaimApplySafetyGateInput) {
  return hasText(input.auditReason) || hasText(input.auditDraft?.auditReason);
}

function getEnvironmentName(input: ClaimApplySafetyGateInput) {
  return hasText(input.environmentName) ? input.environmentName.trim() : 'local-dry-run';
}

function getSafetySummary(
  blockReasons: readonly ClaimApplyBlockReason[],
  checklist: Omit<ClaimApplySafetyChecklist, 'summary'>,
) {
  return [
    checklist.dryRunValidationDisplayAllowed
      ? 'Dry run validation may be displayed for local review.'
      : 'Dry run validation display is unavailable.',
    checklist.validationPassed
      ? 'Claim validation passed for the proposed role shape.'
      : 'Claim validation did not pass, so future apply must stay blocked.',
    checklist.hasAuditDraft
      ? 'Audit draft is present for future review.'
      : 'Audit draft is missing, so future apply must stay blocked.',
    checklist.hasTrustedActorId
      ? 'Trusted actor id is present.'
      : 'Trusted actor id is missing, so future apply must stay blocked.',
    checklist.hasAuditReason
      ? 'Audit reason is present.'
      : 'Audit reason is missing, so future apply must stay blocked.',
    checklist.hasNarrowClubScope
      ? 'Club scope is explicit and narrow.'
      : 'Club scope is missing, so future apply must stay blocked.',
    checklist.hasLinkedAthleteIdForAthleteRole
      ? 'Athlete role linkage is present when required.'
      : 'Athlete role is missing a linked athlete id, so future apply must stay blocked.',
    checklist.confirmationPhraseMatched
      ? 'Required confirmation phrase matched exactly.'
      : 'Required confirmation phrase did not match exactly.',
    checklist.adminFutureApplyBlocked
      ? 'adminFuture remains blocked for apply in this foundation.'
      : 'Requested role is not adminFuture.',
    blockReasons.includes('realApplyNotImplemented')
      ? 'Real custom claim apply is intentionally not implemented in this step.'
      : 'No real apply implementation is available from this helper.',
  ];
}

export function getClaimApplyChecklist(input: ClaimApplySafetyGateInput): ClaimApplySafetyChecklist {
  const validationPassed = input.validationResult?.status === 'readyForFutureTrustedWorkflow';
  const hasAuditDraft = input.auditDraft !== null;
  const hasRequestedApplyMode = input.requestedApplyMode === 'dryRun' || input.requestedApplyMode === 'apply';
  const role = getRole(input);
  const confirmationPhrase = input.confirmationPhrase;
  const hasConfirmationPhrase = hasText(confirmationPhrase);
  const confirmationPhraseMatched = confirmationPhrase === REQUIRED_CLAIM_APPLY_CONFIRMATION_PHRASE;
  const checklistWithoutSummary = {
    dryRunValidationDisplayAllowed: true,
    validationPassed,
    hasAuditDraft,
    hasTrustedActorId: hasTrustedActorId(input),
    hasAuditReason: hasAuditReason(input),
    hasRequestedApplyMode,
    requestedApplyMode: hasRequestedApplyMode ? input.requestedApplyMode : null,
    hasNarrowClubScope: hasClubScope(input),
    hasLinkedAthleteIdForAthleteRole: hasLinkedAthleteIdForAthleteRole(input),
    adminFutureApplyBlocked: role === 'adminFuture',
    hasConfirmationPhrase,
    confirmationPhraseMatched,
    requiredConfirmationPhrase: REQUIRED_CLAIM_APPLY_CONFIRMATION_PHRASE,
    environmentName: getEnvironmentName(input),
    realApplyExecutionAllowed: false,
    firebaseAdminInitialisationAvoided: true,
    customClaimWritingAvoided: true,
    auditRecordWritingAvoided: true,
  } satisfies Omit<ClaimApplySafetyChecklist, 'summary'>;
  const blockReasons = getClaimApplyBlockReasonsFromChecklist(checklistWithoutSummary);

  return {
    ...checklistWithoutSummary,
    summary: getSafetySummary(blockReasons, checklistWithoutSummary),
  };
}

function getClaimApplyBlockReasonsFromChecklist(
  checklist: Omit<ClaimApplySafetyChecklist, 'summary'>,
): readonly ClaimApplyBlockReason[] {
  const blockReasons: ClaimApplyBlockReason[] = [];

  if (!checklist.validationPassed) {
    blockReasons.push('invalidClaimValidation');
  }

  if (!checklist.hasAuditDraft) {
    blockReasons.push('missingAuditDraft');
  }

  if (!checklist.hasTrustedActorId) {
    blockReasons.push('missingTrustedActorId');
  }

  if (!checklist.hasAuditReason) {
    blockReasons.push('missingAuditReason');
  }

  if (checklist.adminFutureApplyBlocked) {
    blockReasons.push('adminFutureApplyBlocked');
  }

  if (!checklist.hasNarrowClubScope) {
    blockReasons.push('missingClubScope');
  }

  if (!checklist.hasLinkedAthleteIdForAthleteRole) {
    blockReasons.push('missingLinkedAthleteId');
  }

  if (!checklist.hasConfirmationPhrase) {
    blockReasons.push('missingConfirmationPhrase');
  } else if (!checklist.confirmationPhraseMatched) {
    blockReasons.push('confirmationPhraseMismatch');
  }

  if (!checklist.hasRequestedApplyMode) {
    blockReasons.push('missingRequestedApplyMode');
  }

  blockReasons.push('realApplyNotImplemented');

  return Array.from(new Set(blockReasons));
}

export function evaluateClaimApplySafetyGate(input: ClaimApplySafetyGateInput): ClaimApplySafetyGateResult {
  const checklist = getClaimApplyChecklist(input);
  const blockReasons = getClaimApplyBlockReasonsFromChecklist(checklist);

  return {
    status: 'blocked',
    canDisplayDryRunValidation: true,
    canApplyClaimsNow: false,
    futureApplyWouldBeBlocked: blockReasons.length > 0,
    requestedApplyMode: checklist.requestedApplyMode,
    requiredConfirmationPhrase: REQUIRED_CLAIM_APPLY_CONFIRMATION_PHRASE,
    blockReasons,
    checklist,
  };
}

export function getClaimApplySafetyMessage(result: ClaimApplySafetyGateResult) {
  if (result.blockReasons.includes('realApplyNotImplemented')) {
    return 'Future apply is blocked: this foundation only evaluates safety and never sets Firebase custom claims.';
  }

  return 'Dry run validation can be displayed, but this helper never applies Firebase custom claims.';
}
