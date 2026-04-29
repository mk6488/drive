export type DriveClaimRole = 'athlete' | 'coach' | 'adminFuture';

export type DriveAthleteCustomClaims = {
  role: 'athlete';
  clubId: string;
  squadIds: readonly string[];
  linkedAthleteId: string;
  displayName: string;
};

export type DriveCoachCustomClaims = {
  role: 'coach';
  clubId: string;
  squadIds: readonly string[];
  displayName: string;
};

export type DriveAdminFutureCustomClaims = {
  role: 'adminFuture';
  clubId: string;
  displayName: string;
};

export type DriveCustomClaims =
  | DriveAthleteCustomClaims
  | DriveCoachCustomClaims
  | DriveAdminFutureCustomClaims;

export type ClaimAssignmentField =
  | 'targetUserId'
  | 'trustedActorId'
  | 'auditReason'
  | 'role'
  | 'clubId'
  | 'squadIds'
  | 'linkedAthleteId'
  | 'displayName';

export type AthleteClaimAssignmentRequest = {
  targetUserId: string;
  trustedActorId: string;
  auditReason: string;
  claims: DriveAthleteCustomClaims;
};

export type CoachClaimAssignmentRequest = {
  targetUserId: string;
  trustedActorId: string;
  auditReason: string;
  claims: DriveCoachCustomClaims;
};

export type AdminFutureClaimAssignmentRequest = {
  targetUserId: string;
  trustedActorId: string;
  auditReason: string;
  claims: DriveAdminFutureCustomClaims;
};

export type ClaimAssignmentRequest =
  | AthleteClaimAssignmentRequest
  | CoachClaimAssignmentRequest
  | AdminFutureClaimAssignmentRequest;

export type ClaimAssignmentValidationResult = {
  status: 'readyForFutureTrustedWorkflow' | 'blocked';
  role: DriveClaimRole | null;
  canGrantAccessNow: false;
  canGrantAthleteAccess: false;
  canGrantCoachAccess: false;
  isClientAssignmentAllowed: false;
  missingFields: readonly ClaimAssignmentField[];
  invalidFields: readonly ClaimAssignmentField[];
  safetyMessages: readonly string[];
};
