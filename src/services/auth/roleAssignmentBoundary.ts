export type TrustedRoleAssignmentRole = 'athlete' | 'coach' | 'adminFuture';

export type RoleAssignmentBoundaryField =
  | 'actorId'
  | 'auditReason'
  | 'targetUserId'
  | 'role'
  | 'clubId'
  | 'squadIds'
  | 'linkedAthleteId'
  | 'displayName';

export type TrustedRoleAssignmentActor = {
  actorKind: 'trustedServerWorkflow';
  actorId: string;
  auditReason: string;
};

export type TrustedRoleAssignmentTarget = {
  targetUserId: string;
  displayName: string;
  clubId: string;
  squadIds?: readonly string[];
  linkedAthleteId?: string;
};

export type AthleteRoleAssignmentInput = {
  targetUserId: string;
  role: 'athlete';
  clubId: string;
  squadIds: readonly string[];
  linkedAthleteId: string;
  displayName: string;
};

export type CoachRoleAssignmentInput = {
  targetUserId: string;
  role: 'coach';
  clubId: string;
  squadIds: readonly string[];
  displayName: string;
};

export type AdminFutureRoleAssignmentInput = {
  targetUserId: string;
  role: 'adminFuture';
  clubId: string;
  displayName: string;
};

export type RoleAssignmentInput =
  | AthleteRoleAssignmentInput
  | CoachRoleAssignmentInput
  | AdminFutureRoleAssignmentInput;

export type RoleAssignmentValidationResult = {
  status: 'readyForTrustedWorkflow' | 'blocked';
  role: TrustedRoleAssignmentRole | null;
  isReadyForTrustedWorkflow: boolean;
  isClientAssignmentAllowed: false;
  missingFields: readonly RoleAssignmentBoundaryField[];
  safetyMessages: readonly string[];
};

export type RoleAssignmentPlan = {
  actor: TrustedRoleAssignmentActor;
  assignment: RoleAssignmentInput;
  target: TrustedRoleAssignmentTarget;
  futureServerWorkflowRequired: true;
};

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasExplicitSquadIds(value: readonly string[] | undefined) {
  return Array.isArray(value) && value.length > 0 && value.every(hasText);
}

function buildResult(
  role: TrustedRoleAssignmentRole | null,
  missingFields: readonly RoleAssignmentBoundaryField[],
  safetyMessages: readonly string[],
): RoleAssignmentValidationResult {
  const isReadyForTrustedWorkflow = missingFields.length === 0;

  return {
    status: isReadyForTrustedWorkflow ? 'readyForTrustedWorkflow' : 'blocked',
    role,
    isReadyForTrustedWorkflow,
    isClientAssignmentAllowed: false,
    missingFields,
    safetyMessages: [
      ...safetyMessages,
      'Role assignment must happen in a future trusted server-side workflow, not inside this client app.',
    ],
  };
}

function addMissingTextField(
  missingFields: RoleAssignmentBoundaryField[],
  field: RoleAssignmentBoundaryField,
  value: unknown,
) {
  if (!hasText(value)) {
    missingFields.push(field);
  }
}

// Future role claims must be assigned by a trusted server-side workflow, likely using Cloud Functions
// and the Firebase Admin SDK in a later approved step. This client app must not assign custom claims,
// let coaches promote themselves, or create unaudited role changes for junior athlete data.
export function validateAthleteRoleAssignmentInput(
  input: AthleteRoleAssignmentInput,
): RoleAssignmentValidationResult {
  const missingFields: RoleAssignmentBoundaryField[] = [];

  addMissingTextField(missingFields, 'targetUserId', input.targetUserId);
  addMissingTextField(missingFields, 'clubId', input.clubId);
  addMissingTextField(missingFields, 'linkedAthleteId', input.linkedAthleteId);
  addMissingTextField(missingFields, 'displayName', input.displayName);

  if (input.role !== 'athlete') {
    missingFields.push('role');
  }

  if (!hasExplicitSquadIds(input.squadIds)) {
    missingFields.push('squadIds');
  }

  return buildResult('athlete', missingFields, [
    'Athlete assignment requires a club scope, explicit squad scope, and a linked athlete record.',
    'Do not include unnecessary junior personal data or parent details in role assignment claims.',
  ]);
}

export function validateCoachRoleAssignmentInput(input: CoachRoleAssignmentInput): RoleAssignmentValidationResult {
  const missingFields: RoleAssignmentBoundaryField[] = [];

  addMissingTextField(missingFields, 'targetUserId', input.targetUserId);
  addMissingTextField(missingFields, 'clubId', input.clubId);
  addMissingTextField(missingFields, 'displayName', input.displayName);

  if (input.role !== 'coach') {
    missingFields.push('role');
  }

  if (!hasExplicitSquadIds(input.squadIds)) {
    missingFields.push('squadIds');
  }

  return buildResult('coach', missingFields, [
    'Coach assignment requires a club scope and should include explicit squad scope wherever possible.',
    'Coaches must not be able to promote themselves or broaden their own DRIVE access from the client app.',
  ]);
}

export function validateAdminFutureRoleAssignmentInput(
  input: AdminFutureRoleAssignmentInput,
): RoleAssignmentValidationResult {
  const missingFields: RoleAssignmentBoundaryField[] = [];

  addMissingTextField(missingFields, 'targetUserId', input.targetUserId);
  addMissingTextField(missingFields, 'clubId', input.clubId);
  addMissingTextField(missingFields, 'displayName', input.displayName);

  if (input.role !== 'adminFuture') {
    missingFields.push('role');
  }

  return buildResult('adminFuture', missingFields, [
    'adminFuture is recognised for planning only and must not grant broad athlete, coach, or system access yet.',
    'Future admin role assignment needs explicit product, security, audit, and safeguarding approval.',
  ]);
}

export function validateRoleAssignmentInput(input: RoleAssignmentInput): RoleAssignmentValidationResult {
  switch (input.role) {
    case 'athlete':
      return validateAthleteRoleAssignmentInput(input);
    case 'coach':
      return validateCoachRoleAssignmentInput(input);
    case 'adminFuture':
      return validateAdminFutureRoleAssignmentInput(input);
    default:
      return buildResult(null, ['role'], ['Unknown role assignment input must not grant DRIVE access.']);
  }
}

export function validateRoleAssignmentPlan(plan: RoleAssignmentPlan): RoleAssignmentValidationResult {
  const assignmentResult = validateRoleAssignmentInput(plan.assignment);
  const missingFields = [...assignmentResult.missingFields];

  addMissingTextField(missingFields, 'actorId', plan.actor.actorId);
  addMissingTextField(missingFields, 'auditReason', plan.actor.auditReason);

  if (plan.actor.actorKind !== 'trustedServerWorkflow') {
    missingFields.push('actorId');
  }

  return buildResult(assignmentResult.role, Array.from(new Set(missingFields)), [
    ...assignmentResult.safetyMessages,
    'Role assignment must be auditable when implemented later, including who approved the change and why.',
    'Junior safeguarding requires a narrow role boundary before any protected athlete or coach access is granted.',
  ]);
}

export function getRoleAssignmentSafetyMessage(result: RoleAssignmentValidationResult) {
  if (result.role === 'adminFuture') {
    return 'adminFuture is planning-only and must not grant broad DRIVE access.';
  }

  if (!result.isReadyForTrustedWorkflow) {
    return 'Role assignment input is incomplete. Missing claims must keep the account not ready for DRIVE access.';
  }

  return 'Role assignment input is shaped for a future trusted workflow only. The client app still must not assign roles or claims.';
}
