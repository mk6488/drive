import type { ClaimAssignmentValidationResult, DriveClaimRole } from './roleClaims';

export type RoleAssignmentAuditStatus =
  | 'drafted'
  | 'validated'
  | 'approvedForFutureApply'
  | 'blocked'
  | 'appliedFutureOnly';

export type RoleAssignmentAuditActor = {
  trustedActorId: string;
  requestedByUserId: string | null;
  approvedByUserId: string | null;
};

export type RoleAssignmentAuditTarget = {
  targetUserId: string;
  role: DriveClaimRole | null;
  clubId: string | null;
  squadIds: readonly string[];
  linkedAthleteId: string | null;
  displayName: string | null;
};

export type RoleAssignmentAuditSafetyChecklist = {
  isPlanningOnly: true;
  auditRecordWasNotWritten: true;
  customClaimsWereNotSet: true;
  firebaseAdminClaimSettingAvoided: true;
  firestoreWriteAvoided: true;
  serviceAccountFileNotRequired: true;
  hasTargetUserId: boolean;
  hasTrustedActor: boolean;
  hasAuditReason: boolean;
  hasRequestedRole: boolean;
  hasNarrowClubScope: boolean;
  hasExplicitSquadScope: boolean;
  hasLinkedAthleteForAthleteRole: boolean;
  avoidsUnnecessaryJuniorData: true;
  statusCanOnlyPlanFutureApply: true;
  summary: readonly string[];
};

export type RoleAssignmentAuditEntry = RoleAssignmentAuditActor &
  RoleAssignmentAuditTarget & {
    auditId: string;
    status: RoleAssignmentAuditStatus;
    auditReason: string;
    proposedClaims: Record<string, unknown>;
    safetyChecklist: RoleAssignmentAuditSafetyChecklist;
    createdAt: string;
    reviewedAt: string | null;
    appliedAt: string | null;
    notes: readonly string[];
  };

export type RoleAssignmentAuditDraft = RoleAssignmentAuditEntry & {
  status: 'drafted' | 'validated' | 'blocked';
  appliedAt: null;
};

export type RoleAssignmentAuditSummary = {
  auditStatus: RoleAssignmentAuditStatus;
  targetUserId: string;
  trustedActorId: string;
  auditReason: string;
  requestedRole: DriveClaimRole | null;
  proposedClaimScope: {
    clubId: string | null;
    squadIds: readonly string[];
    linkedAthleteId: string | null;
  };
  safetyChecklistSummary: readonly string[];
  auditRecordWasWritten: false;
  customClaimsWereSet: false;
};

export type RoleAssignmentAuditReportMode = 'dryRun' | 'liveApplyPlan';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getText(value: unknown) {
  return hasText(value) ? value.trim() : '';
}

function getOptionalText(value: unknown) {
  return hasText(value) ? value.trim() : null;
}

function getStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter(hasText).map((item) => item.trim()) : [];
}

function getInputRecord(input: unknown) {
  return isRecord(input) ? input : {};
}

function getClaimsRecord(input: unknown) {
  const request = getInputRecord(input);

  return isRecord(request.claims) ? request.claims : {};
}

function getNotes(value: unknown) {
  return Array.isArray(value) ? value.filter(hasText).map((note) => note.trim()) : [];
}

function getAuditStatus(validationResult: ClaimAssignmentValidationResult): RoleAssignmentAuditDraft['status'] {
  return validationResult.status === 'readyForFutureTrustedWorkflow' ? 'validated' : 'blocked';
}

function getAuditId(request: Record<string, unknown>, targetUserId: string, role: DriveClaimRole | null) {
  const auditId = getOptionalText(request.auditId);

  if (auditId) {
    return auditId;
  }

  return `dry-run-audit:${targetUserId || 'missing-target'}:${role ?? 'missing-role'}`;
}

export function getRoleAssignmentAuditSafetyChecklist(
  input: unknown,
  validationResult: ClaimAssignmentValidationResult,
  reportMode: RoleAssignmentAuditReportMode = 'liveApplyPlan',
): RoleAssignmentAuditSafetyChecklist {
  const request = getInputRecord(input);
  const claims = getClaimsRecord(input);
  const role = validationResult.role;
  const squadIds = getStringArray(claims.squadIds);
  const hasLinkedAthleteForAthleteRole = role !== 'athlete' || hasText(claims.linkedAthleteId);
  const executionSummary =
    reportMode === 'dryRun'
      ? [
          'Firebase custom claims were not set.',
          'Firebase Admin claim setting was avoided.',
          'No Firestore read or write was performed.',
          'No service account file is needed for this dry run.',
        ]
      : [
          'Proposed claims are documented for operator review; the caller reports whether claim setting was attempted.',
          'The audit helper did not initialise Firebase Admin or mutate Firebase Auth.',
          'The audit helper did not read or write Firestore.',
        ];
  const summary = [
    'Audit model is planning-only; no audit record was written.',
    ...executionSummary,
    hasText(request.trustedActorId)
      ? 'Trusted actor id is present for future review.'
      : 'Trusted actor id is missing; future role assignment must stay blocked.',
    hasText(request.auditReason)
      ? 'Audit reason is present for future review.'
      : 'Audit reason is missing; future role assignment must stay blocked.',
    hasText(claims.clubId)
      ? 'Club scope is explicit and narrow.'
      : 'Club scope is missing; future role assignment must stay blocked.',
    squadIds.length > 0 || role === 'adminFuture'
      ? 'Squad scope is explicit where this role expects it.'
      : 'Squad scope is missing; future role assignment must stay blocked.',
  ];

  return {
    isPlanningOnly: true,
    auditRecordWasNotWritten: true,
    customClaimsWereNotSet: true,
    firebaseAdminClaimSettingAvoided: true,
    firestoreWriteAvoided: true,
    serviceAccountFileNotRequired: true,
    hasTargetUserId: hasText(request.targetUserId),
    hasTrustedActor: hasText(request.trustedActorId),
    hasAuditReason: hasText(request.auditReason),
    hasRequestedRole: role !== null,
    hasNarrowClubScope: hasText(claims.clubId),
    hasExplicitSquadScope: squadIds.length > 0 || role === 'adminFuture',
    hasLinkedAthleteForAthleteRole,
    avoidsUnnecessaryJuniorData: true,
    statusCanOnlyPlanFutureApply: true,
    summary,
  };
}

export function createRoleAssignmentAuditDraft(
  input: unknown,
  validationResult: ClaimAssignmentValidationResult,
  reportMode: RoleAssignmentAuditReportMode = 'liveApplyPlan',
): RoleAssignmentAuditDraft {
  const request = getInputRecord(input);
  const claims = getClaimsRecord(input);
  const targetUserId = getText(request.targetUserId);
  const trustedActorId = getText(request.trustedActorId);
  const role = validationResult.role;

  return {
    auditId: getAuditId(request, targetUserId, role),
    status: getAuditStatus(validationResult),
    targetUserId,
    trustedActorId,
    requestedByUserId: getOptionalText(request.requestedByUserId),
    approvedByUserId: getOptionalText(request.approvedByUserId),
    auditReason: getText(request.auditReason),
    role,
    clubId: getOptionalText(claims.clubId),
    squadIds: getStringArray(claims.squadIds),
    linkedAthleteId: getOptionalText(claims.linkedAthleteId),
    displayName: getOptionalText(claims.displayName),
    proposedClaims: { ...claims },
    safetyChecklist: getRoleAssignmentAuditSafetyChecklist(input, validationResult, reportMode),
    createdAt: getOptionalText(request.createdAt) ?? 'dry-run-only-not-persisted',
    reviewedAt: getOptionalText(request.reviewedAt),
    appliedAt: null,
    notes: getNotes(request.notes),
  };
}

export function getRoleAssignmentAuditSummary(auditEntry: RoleAssignmentAuditEntry): RoleAssignmentAuditSummary {
  return {
    auditStatus: auditEntry.status,
    targetUserId: auditEntry.targetUserId,
    trustedActorId: auditEntry.trustedActorId,
    auditReason: auditEntry.auditReason,
    requestedRole: auditEntry.role,
    proposedClaimScope: {
      clubId: auditEntry.clubId,
      squadIds: auditEntry.squadIds,
      linkedAthleteId: auditEntry.linkedAthleteId,
    },
    safetyChecklistSummary: auditEntry.safetyChecklist.summary,
    auditRecordWasWritten: false,
    customClaimsWereSet: false,
  };
}
