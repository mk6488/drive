import type { AuthRole, AuthSession } from '@/src/services/auth/authTypes';

export const exampleAthleteSession = {
  status: 'authenticated',
  user: {
    userId: 'user-preview-athlete-001',
    role: 'athlete',
    displayName: 'Athlete preview',
    clubId: 'club-example-001',
    squadIds: ['squad-example-juniors'],
    linkedAthleteId: 'athlete-example-001',
  },
} as const satisfies AuthSession;

export const exampleCoachSession = {
  status: 'authenticated',
  user: {
    userId: 'user-preview-coach-001',
    role: 'coach',
    displayName: 'Coach preview',
    clubId: 'club-example-001',
    squadIds: ['squad-example-juniors'],
  },
} as const satisfies AuthSession;

export const unauthenticatedPreviewSession = {
  status: 'unauthenticated',
  user: null,
} as const satisfies AuthSession;

export function getPreviewAuthSession(role: AuthRole | 'none'): AuthSession {
  if (role === 'athlete') {
    return exampleAthleteSession;
  }

  if (role === 'coach') {
    return exampleCoachSession;
  }

  return unauthenticatedPreviewSession;
}
