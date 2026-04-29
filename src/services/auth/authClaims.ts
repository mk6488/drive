export type DriveAuthClaimRole = 'athlete' | 'coach' | 'adminFuture';

export type DriveAuthClaimField = 'role' | 'clubId' | 'squadIds' | 'linkedAthleteId' | 'displayName';

export type DriveAuthClaims = {
  role?: DriveAuthClaimRole;
  clubId?: string;
  squadIds?: readonly string[];
  linkedAthleteId?: string;
  displayName?: string;
};

export type DriveAuthClaimValidationResult = {
  status: 'complete' | 'incomplete' | 'invalid';
  role: DriveAuthClaimRole | null;
  claimsPresent: boolean;
  canGrantAccess: boolean;
  canGrantAthleteAccess: boolean;
  canGrantCoachAccess: boolean;
  missingFields: readonly DriveAuthClaimField[];
  invalidFields: readonly DriveAuthClaimField[];
};

const expectedClaimFields: readonly DriveAuthClaimField[] = [
  'role',
  'clubId',
  'squadIds',
  'linkedAthleteId',
  'displayName',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasTextArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every(hasText);
}

function hasClaimValue(claims: Record<string, unknown>, field: DriveAuthClaimField) {
  const value = claims[field];

  if (field === 'squadIds') {
    return Array.isArray(value);
  }

  return value !== undefined && value !== null;
}

function getRole(value: unknown): DriveAuthClaimRole | null {
  if (value === 'athlete' || value === 'coach' || value === 'adminFuture') {
    return value;
  }

  return null;
}

function getInvalidFields(claims: Record<string, unknown>, role: DriveAuthClaimRole | null) {
  const invalidFields: DriveAuthClaimField[] = [];

  if (claims.role !== undefined && role === null) {
    invalidFields.push('role');
  }

  if (claims.clubId !== undefined && !hasText(claims.clubId)) {
    invalidFields.push('clubId');
  }

  if (claims.squadIds !== undefined && !hasTextArray(claims.squadIds)) {
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

function getMissingFields(claims: Record<string, unknown>, role: DriveAuthClaimRole | null) {
  const missingFields: DriveAuthClaimField[] = [];

  if (!role) {
    missingFields.push('role');
  }

  if ((role === 'athlete' || role === 'coach') && !hasText(claims.clubId)) {
    missingFields.push('clubId');
  }

  if (role === 'athlete' && !hasText(claims.linkedAthleteId)) {
    missingFields.push('linkedAthleteId');
  }

  if ((role === 'athlete' || role === 'coach') && !hasText(claims.displayName)) {
    missingFields.push('displayName');
  }

  return missingFields;
}

export function validateDriveAuthClaims(rawClaims: unknown): DriveAuthClaimValidationResult {
  const claims = isRecord(rawClaims) ? rawClaims : {};
  const claimsPresent = expectedClaimFields.some((field) => hasClaimValue(claims, field));
  const role = getRole(claims.role);
  const invalidFields = getInvalidFields(claims, role);
  const missingFields = getMissingFields(claims, role);
  const canGrantAthleteAccess = role === 'athlete' && missingFields.length === 0 && invalidFields.length === 0;
  const canGrantCoachAccess = role === 'coach' && missingFields.length === 0 && invalidFields.length === 0;
  const canGrantAccess = canGrantAthleteAccess || canGrantCoachAccess;
  const status = invalidFields.length > 0 ? 'invalid' : canGrantAccess ? 'complete' : 'incomplete';

  return {
    status,
    role,
    claimsPresent,
    canGrantAccess,
    canGrantAthleteAccess,
    canGrantCoachAccess,
    missingFields,
    invalidFields,
  };
}

export function getClaimReadinessMessage(validationResult: DriveAuthClaimValidationResult) {
  if (validationResult.canGrantAthleteAccess) {
    return 'DRIVE athlete claims appear complete for future athlete access.';
  }

  if (validationResult.canGrantCoachAccess) {
    return 'DRIVE coach claims appear complete for future coach access.';
  }

  if (validationResult.role === 'adminFuture') {
    return 'Admin future claims are recognised for planning only and do not grant broad DRIVE access yet.';
  }

  if (validationResult.invalidFields.length > 0) {
    return 'Account is not ready for DRIVE access yet because one or more role claims are invalid.';
  }

  return 'Account is not ready for DRIVE access yet because trusted DRIVE role claims are missing or incomplete.';
}

export function getSafeRoleFromClaims(rawClaims: unknown): DriveAuthClaimRole | null {
  return validateDriveAuthClaims(rawClaims).role;
}
