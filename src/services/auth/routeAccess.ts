import type { AuthRole, AuthSession, AuthUser } from '@/src/services/auth/authTypes';

export type DriveAppArea = 'public' | 'athlete' | 'coach' | 'dev' | 'adminFuture';

export type RouteAccessReason =
  | 'public-preview-open'
  | 'dev-preview-open'
  | 'complete-athlete-own-area'
  | 'complete-coach-scoped-area'
  | 'unauthenticated-future-protected-area'
  | 'incomplete-claims'
  | 'athlete-scope-mismatch'
  | 'coach-scope-mismatch'
  | 'role-not-permitted'
  | 'admin-future-only';

export type RouteAccessDecision = {
  area: DriveAppArea;
  isAllowed: boolean;
  isPreviewOnly: true;
  isEnforced: false;
  reason: RouteAccessReason;
  sessionRole: AuthRole | 'none';
};

export type RouteAccessOptions = {
  targetAthleteId?: string;
  targetClubId?: string;
  targetSquadId?: string;
};

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasTextArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.length > 0 && value.every(hasText);
}

function getSessionUser(session: AuthSession | null | undefined): AuthUser | null {
  return session?.status === 'authenticated' ? session.user : null;
}

function getSessionRole(session: AuthSession | null | undefined): AuthRole | 'none' {
  return getSessionUser(session)?.role ?? 'none';
}

function isCompleteAthleteUser(user: AuthUser | null): user is Extract<AuthUser, { role: 'athlete' }> {
  return (
    user?.role === 'athlete' &&
    hasText(user.userId) &&
    hasText(user.displayName) &&
    hasText(user.clubId) &&
    hasTextArray(user.squadIds) &&
    hasText(user.linkedAthleteId)
  );
}

function isCompleteCoachUser(user: AuthUser | null): user is Extract<AuthUser, { role: 'coach' }> {
  return (
    user?.role === 'coach' &&
    hasText(user.userId) &&
    hasText(user.displayName) &&
    hasText(user.clubId) &&
    hasTextArray(user.squadIds)
  );
}

function baseDecision(
  session: AuthSession | null | undefined,
  area: DriveAppArea,
  reason: RouteAccessReason,
  isAllowed: boolean,
): RouteAccessDecision {
  return {
    area,
    isAllowed,
    isPreviewOnly: true,
    isEnforced: false,
    reason,
    sessionRole: getSessionRole(session),
  };
}

function getAthleteAreaDecision(
  session: AuthSession | null | undefined,
  options: RouteAccessOptions,
): RouteAccessDecision {
  const user = getSessionUser(session);

  if (session?.status === 'incomplete') {
    return baseDecision(session, 'athlete', 'incomplete-claims', false);
  }

  if (!user) {
    return baseDecision(session, 'athlete', 'unauthenticated-future-protected-area', false);
  }

  if (user.role !== 'athlete') {
    return baseDecision(session, 'athlete', 'role-not-permitted', false);
  }

  if (!isCompleteAthleteUser(user)) {
    return baseDecision(session, 'athlete', 'incomplete-claims', false);
  }

  if (options.targetAthleteId && options.targetAthleteId !== user.linkedAthleteId) {
    return baseDecision(session, 'athlete', 'athlete-scope-mismatch', false);
  }

  return baseDecision(session, 'athlete', 'complete-athlete-own-area', true);
}

function getCoachAreaDecision(
  session: AuthSession | null | undefined,
  options: RouteAccessOptions,
): RouteAccessDecision {
  const user = getSessionUser(session);

  if (session?.status === 'incomplete') {
    return baseDecision(session, 'coach', 'incomplete-claims', false);
  }

  if (!user) {
    return baseDecision(session, 'coach', 'unauthenticated-future-protected-area', false);
  }

  if (user.role !== 'coach') {
    return baseDecision(session, 'coach', 'role-not-permitted', false);
  }

  if (!isCompleteCoachUser(user)) {
    return baseDecision(session, 'coach', 'incomplete-claims', false);
  }

  if (options.targetClubId && options.targetClubId !== user.clubId) {
    return baseDecision(session, 'coach', 'coach-scope-mismatch', false);
  }

  if (options.targetSquadId && !user.squadIds.includes(options.targetSquadId)) {
    return baseDecision(session, 'coach', 'coach-scope-mismatch', false);
  }

  return baseDecision(session, 'coach', 'complete-coach-scoped-area', true);
}

export function getRouteAccessDecision(
  session: AuthSession | null | undefined,
  area: DriveAppArea,
  options: RouteAccessOptions = {},
): RouteAccessDecision {
  if (area === 'public') {
    return baseDecision(session, area, 'public-preview-open', true);
  }

  if (area === 'dev') {
    return baseDecision(session, area, 'dev-preview-open', true);
  }

  if (area === 'athlete') {
    return getAthleteAreaDecision(session, options);
  }

  if (area === 'coach') {
    return getCoachAreaDecision(session, options);
  }

  return baseDecision(session, area, 'admin-future-only', false);
}

export function canAccessPublicArea(session: AuthSession | null | undefined) {
  return getRouteAccessDecision(session, 'public').isAllowed;
}

export function canAccessAthletePreview(session: AuthSession | null | undefined, options?: RouteAccessOptions) {
  return getRouteAccessDecision(session, 'athlete', options).isAllowed;
}

export function canAccessCoachPreview(session: AuthSession | null | undefined, options?: RouteAccessOptions) {
  return getRouteAccessDecision(session, 'coach', options).isAllowed;
}

export function canAccessDevPreview(session: AuthSession | null | undefined) {
  return getRouteAccessDecision(session, 'dev').isAllowed;
}

export function getRouteAccessCopy(decision: RouteAccessDecision) {
  switch (decision.reason) {
    case 'public-preview-open':
      return 'Public preview routes remain available while protected routing is deliberately not enabled.';
    case 'dev-preview-open':
      return 'Developer preview routes remain available for review and do not prove route protection exists.';
    case 'complete-athlete-own-area':
      return 'This complete athlete session describes access to the linked athlete area only. It does not redirect or guard routes yet.';
    case 'complete-coach-scoped-area':
      return 'This complete coach session describes access within the coach club or assigned squad scope only. It does not enforce routing yet.';
    case 'unauthenticated-future-protected-area':
      return 'Unauthenticated users must not be treated as authorised for future protected athlete or coach areas.';
    case 'incomplete-claims':
      return 'Missing or incomplete DRIVE auth claims do not grant future protected access.';
    case 'athlete-scope-mismatch':
      return "Athlete access is limited to the user's linked athlete record, so another athlete area is not allowed.";
    case 'coach-scope-mismatch':
      return "Coach access is limited to the user's club and assigned squads, so this target is outside scope.";
    case 'role-not-permitted':
      return 'This role is not permitted for the selected future app area and is not a broad bypass.';
    case 'admin-future-only':
      return 'Admin is represented as future planning only and must not become a broad bypass yet.';
    default:
      return 'Route access is described for preview only and is not enforced yet.';
  }
}
