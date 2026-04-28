import type { AuthUser } from '@/src/services/auth/authTypes';

export function isAthleteUser(user: AuthUser | null | undefined): user is Extract<AuthUser, { role: 'athlete' }> {
  return user?.role === 'athlete';
}

export function isCoachUser(user: AuthUser | null | undefined): user is Extract<AuthUser, { role: 'coach' }> {
  return user?.role === 'coach';
}

export function isAdminUser(user: AuthUser | null | undefined): user is Extract<AuthUser, { role: 'admin' }> {
  return user?.role === 'admin';
}

export function canAccessAthleteArea(user: AuthUser | null | undefined) {
  return isAthleteUser(user);
}

export function canAccessCoachArea(user: AuthUser | null | undefined) {
  return isCoachUser(user) && (user.clubId.length > 0 || user.squadIds.length > 0);
}

export function canReviewSubmissions(user: AuthUser | null | undefined) {
  return canAccessCoachArea(user);
}

export function canCreateQuestDrafts(user: AuthUser | null | undefined) {
  return canAccessCoachArea(user);
}

export function canViewOwnAthleteData(user: AuthUser | null | undefined, athleteId: string) {
  return isAthleteUser(user) && user.linkedAthleteId === athleteId;
}
