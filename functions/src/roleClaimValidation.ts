import type {
  AdminFutureClaimAssignmentRequest,
  AthleteClaimAssignmentRequest,
  ClaimAssignmentField,
  ClaimAssignmentRequest,
  ClaimAssignmentValidationResult,
  CoachClaimAssignmentRequest,
  DriveClaimRole,
} from './roleClaims';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasExplicitSquadIds(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.length > 0 && value.every(hasText);
}

function getRole(value: unknown): DriveClaimRole | null {
  if (value === 'athlete' || value === 'coach' || value === 'adminFuture') {
    return value;
  }

  return null;
}

function addMissingTextField(
  missingFields: ClaimAssignmentField[],
  field: ClaimAssignmentField,
  value: unknown,
) {
  if (!hasText(value)) {
    missingFields.push(field);
  }
}

function buildResult(
  role: DriveClaimRole | null,
  missingFields: readonly ClaimAssignmentField[],
  invalidFields: readonly ClaimAssignmentField[],
  safetyMessages: readonly string[],
): ClaimAssignmentValidationResult {
  const isReadyForFutureTrustedWorkflow = missingFields.length === 0 && invalidFields.length === 0;

  return {
    status: isReadyForFutureTrustedWorkflow ? 'readyForFutureTrustedWorkflow' : 'blocked',
    role,
    canGrantAccessNow: false,
    canGrantAthleteAccess: false,
    canGrantCoachAccess: false,
    isClientAssignmentAllowed: false,
    missingFields,
    invalidFields,
    safetyMessages: [
      ...safetyMessages,
      'This helper is pure planning code only and must not set Firebase custom claims.',
      'Missing or incomplete claims must not grant DRIVE athlete, coach, or admin access.',
      'Client apps must not assign roles, promote users, or decide coach access.',
      'Role assignment must become auditable before it is implemented for real users.',
    ],
  };
}

function getBaseRequestFields(input: Record<string, unknown>) {
  const missingFields: ClaimAssignmentField[] = [];

  addMissingTextField(missingFields, 'targetUserId', input.targetUserId);
  addMissingTextField(missingFields, 'trustedActorId', input.trustedActorId);
  addMissingTextField(missingFields, 'auditReason', input.auditReason);

  return missingFields;
}

function getClaims(input: Record<string, unknown>) {
  return isRecord(input.claims) ? input.claims : {};
}

function getInvalidClaimFields(claims: Record<string, unknown>, role: DriveClaimRole | null) {
  const invalidFields: ClaimAssignmentField[] = [];

  if (claims.role !== undefined && role === null) {
    invalidFields.push('role');
  }

  if (claims.clubId !== undefined && !hasText(claims.clubId)) {
    invalidFields.push('clubId');
  }

  if (claims.squadIds !== undefined && !hasExplicitSquadIds(claims.squadIds)) {
    invalidFields.push('squadIds');
  }

  if (claims.linkedAthleteId !== undefined && !hasText(claims.linkedAthleteId)) {
    invalidFields.push('linkedAthleteId');
  }

  if (claims.displayName !== undefined && !hasText(claims.displayName)) {
    invalidFields.push('displayName');
  }

  return invalidFields;
}

export function validateAthleteClaimAssignmentRequest(
  input: AthleteClaimAssignmentRequest | unknown,
): ClaimAssignmentValidationResult {
  const request = isRecord(input) ? input : {};
  const claims = getClaims(request);
  const role = getRole(claims.role);
  const missingFields = getBaseRequestFields(request);
  const invalidFields = getInvalidClaimFields(claims, role);

  if (role !== 'athlete') {
    missingFields.push('role');
  }

  addMissingTextField(missingFields, 'clubId', claims.clubId);
  addMissingTextField(missingFields, 'linkedAthleteId', claims.linkedAthleteId);
  addMissingTextField(missingFields, 'displayName', claims.displayName);

  if (!hasExplicitSquadIds(claims.squadIds)) {
    missingFields.push('squadIds');
  }

  return buildResult('athlete', Array.from(new Set(missingFields)), invalidFields, [
    'Athlete claims require club scope, explicit squad scope, a linked athlete record, and display name.',
    'Athlete claims must not include unnecessary junior personal data or parent details.',
  ]);
}

export function validateCoachClaimAssignmentRequest(
  input: CoachClaimAssignmentRequest | unknown,
): ClaimAssignmentValidationResult {
  const request = isRecord(input) ? input : {};
  const claims = getClaims(request);
  const role = getRole(claims.role);
  const missingFields = getBaseRequestFields(request);
  const invalidFields = getInvalidClaimFields(claims, role);

  if (role !== 'coach') {
    missingFields.push('role');
  }

  addMissingTextField(missingFields, 'clubId', claims.clubId);
  addMissingTextField(missingFields, 'displayName', claims.displayName);

  if (!hasExplicitSquadIds(claims.squadIds)) {
    missingFields.push('squadIds');
  }

  return buildResult('coach', Array.from(new Set(missingFields)), invalidFields, [
    'Coach claims require club scope and explicit squad scope so coach access can stay narrow.',
    'Coaches must not be able to promote themselves or broaden their own DRIVE access from the client app.',
  ]);
}

export function validateAdminFutureClaimAssignmentRequest(
  input: AdminFutureClaimAssignmentRequest | unknown,
): ClaimAssignmentValidationResult {
  const request = isRecord(input) ? input : {};
  const claims = getClaims(request);
  const role = getRole(claims.role);
  const missingFields = getBaseRequestFields(request);
  const invalidFields = getInvalidClaimFields(claims, role);

  if (role !== 'adminFuture') {
    missingFields.push('role');
  }

  addMissingTextField(missingFields, 'clubId', claims.clubId);
  addMissingTextField(missingFields, 'displayName', claims.displayName);

  return buildResult('adminFuture', Array.from(new Set(missingFields)), invalidFields, [
    'adminFuture is planning-only and must not become a broad bypass for athlete, coach, or system access.',
    'Future admin behaviour requires explicit product, security, audit, and safeguarding approval.',
  ]);
}

export function validateClaimAssignmentRequest(
  input: ClaimAssignmentRequest | unknown,
): ClaimAssignmentValidationResult {
  if (!isRecord(input)) {
    return buildResult(null, ['targetUserId', 'trustedActorId', 'auditReason', 'role'], [], [
      'Unknown claim assignment input must not grant DRIVE access.',
    ]);
  }

  const role = getRole(getClaims(input).role);

  switch (role) {
    case 'athlete':
      return validateAthleteClaimAssignmentRequest(input);
    case 'coach':
      return validateCoachClaimAssignmentRequest(input);
    case 'adminFuture':
      return validateAdminFutureClaimAssignmentRequest(input);
    default:
      return buildResult(null, ['role'], getInvalidClaimFields(getClaims(input), role), [
        'Unknown claim role must not grant DRIVE access.',
      ]);
  }
}
