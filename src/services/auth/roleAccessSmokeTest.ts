import type { AuthRole, AuthSession } from '@/src/services/auth/authTypes';
import {
  getRouteAccessCopy,
  getRouteAccessDecision,
  type DriveAppArea,
  type RouteAccessDecision,
  type RouteAccessOptions,
} from '@/src/services/auth/routeAccess';

export type RoleAccessSmokeTestRole = AuthRole | 'adminFuture' | 'none';

export type RoleAccessSmokeTestAreaResult = {
  area: DriveAppArea;
  label: string;
  decision: RouteAccessDecision;
  explanation: string;
  targetContext: string;
};

export type RoleAccessSmokeTestResults = {
  sessionStatus: AuthSession['status'];
  role: RoleAccessSmokeTestRole;
  clubId: string | null;
  squadIds: readonly string[];
  linkedAthleteId: string | null;
  results: readonly RoleAccessSmokeTestAreaResult[];
  diagnosticNote: string;
};

export type ExpectedAccessSummary = {
  role: RoleAccessSmokeTestRole;
  summary: string;
  expectedAccessibleAreas: readonly DriveAppArea[];
  expectedBlockedAreas: readonly DriveAppArea[];
};

const appAreas: readonly DriveAppArea[] = ['public', 'athlete', 'coach', 'dev', 'adminFuture'];

function getAuthenticatedUser(session: AuthSession) {
  return session.status === 'authenticated' ? session.user : null;
}

function getSmokeTestRole(session: AuthSession): RoleAccessSmokeTestRole {
  if (session.status === 'incomplete') {
    return session.claimValidation.role ?? 'none';
  }

  if (session.status !== 'authenticated') {
    return 'none';
  }

  return session.user.role === 'admin' ? 'adminFuture' : session.user.role;
}

function getSessionClubId(session: AuthSession) {
  const user = getAuthenticatedUser(session);

  return user?.clubId ?? null;
}

function getSessionSquadIds(session: AuthSession) {
  const user = getAuthenticatedUser(session);

  return user?.squadIds ?? [];
}

function getLinkedAthleteId(session: AuthSession) {
  const user = getAuthenticatedUser(session);

  return user?.role === 'athlete' ? user.linkedAthleteId : null;
}

function getAreaLabel(area: DriveAppArea) {
  switch (area) {
    case 'public':
      return 'Public preview';
    case 'athlete':
      return 'Future athlete own-data area';
    case 'coach':
      return 'Future coach scoped area';
    case 'dev':
      return 'Developer preview';
    case 'adminFuture':
      return 'Future admin planning';
    default:
      return area;
  }
}

function getSmokeTestOptions(session: AuthSession, area: DriveAppArea): RouteAccessOptions {
  const user = getAuthenticatedUser(session);

  if (!user) {
    return {};
  }

  if (area === 'athlete' && user.role === 'athlete') {
    return {
      targetAthleteId: user.linkedAthleteId,
    };
  }

  if (area === 'coach') {
    return {
      targetClubId: user.clubId,
      targetSquadId: user.squadIds[0],
    };
  }

  return {};
}

function getTargetContext(area: DriveAppArea, options: RouteAccessOptions) {
  if (area === 'athlete') {
    return options.targetAthleteId ? `Linked athlete: ${options.targetAthleteId}` : 'No linked athlete target';
  }

  if (area === 'coach') {
    const clubContext = options.targetClubId ? `Club: ${options.targetClubId}` : 'No club target';
    const squadContext = options.targetSquadId ? `Squad: ${options.targetSquadId}` : 'No squad target';

    return `${clubContext}; ${squadContext}`;
  }

  return 'No scoped target needed';
}

export function getRoleAccessSmokeTestResults(session: AuthSession): RoleAccessSmokeTestResults {
  const results = appAreas.map((area) => {
    const options = getSmokeTestOptions(session, area);
    const decision = getRouteAccessDecision(session, area, options);

    return {
      area,
      label: getAreaLabel(area),
      decision,
      explanation: getRouteAccessCopy(decision),
      targetContext: getTargetContext(area, options),
    };
  });

  return {
    sessionStatus: session.status,
    role: getSmokeTestRole(session),
    clubId: getSessionClubId(session),
    squadIds: getSessionSquadIds(session),
    linkedAthleteId: getLinkedAthleteId(session),
    results,
    diagnosticNote:
      'This smoke test reports expected access decisions only. It does not enforce routes, redirect users, hide screens, read Firestore, or write Firestore.',
  };
}

export function getExpectedAccessSummaryForRole(role: RoleAccessSmokeTestRole): ExpectedAccessSummary {
  switch (role) {
    case 'athlete':
      return {
        role,
        summary:
          'A complete athlete session is expected to access public and developer previews plus the linked athlete area only.',
        expectedAccessibleAreas: ['public', 'athlete', 'dev'],
        expectedBlockedAreas: ['coach', 'adminFuture'],
      };
    case 'coach':
      return {
        role,
        summary:
          'A complete coach session is expected to access public and developer previews plus coach areas scoped to the assigned club or squad.',
        expectedAccessibleAreas: ['public', 'coach', 'dev'],
        expectedBlockedAreas: ['athlete', 'adminFuture'],
      };
    case 'admin':
    case 'adminFuture':
      return {
        role: 'adminFuture',
        summary:
          'Admin future is recognised for planning only and must not grant broad access to athlete, coach, or admin areas.',
        expectedAccessibleAreas: ['public', 'dev'],
        expectedBlockedAreas: ['athlete', 'coach', 'adminFuture'],
      };
    case 'none':
    default:
      return {
        role: 'none',
        summary:
          'Unauthenticated or incomplete sessions are expected to keep future athlete, coach, and admin areas unauthorised.',
        expectedAccessibleAreas: ['public', 'dev'],
        expectedBlockedAreas: ['athlete', 'coach', 'adminFuture'],
      };
  }
}
