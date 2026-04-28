import type { Role } from '@/src/types/role';

export type AuthRole = Role;

type BaseAuthUser = {
  userId: string;
  role: AuthRole;
  displayName: string;
  clubId: string;
  squadIds: readonly string[];
};

export type AthleteAuthUser = BaseAuthUser & {
  role: 'athlete';
  linkedAthleteId: string;
};

export type CoachAuthUser = BaseAuthUser & {
  role: 'coach';
  linkedAthleteId?: never;
};

export type AdminAuthUser = Omit<BaseAuthUser, 'clubId'> & {
  role: 'admin';
  clubId?: string;
  linkedAthleteId?: never;
};

export type AuthUser = AthleteAuthUser | CoachAuthUser | AdminAuthUser;

export type AuthenticatedSession = {
  status: 'authenticated';
  user: AuthUser;
};

export type UnauthenticatedSession = {
  status: 'unauthenticated';
  user: null;
};

export type AuthSession = AuthenticatedSession | UnauthenticatedSession;

export type AuthBoundaryState = {
  session: AuthSession;
  previewRole: AuthRole | 'none';
  isPreviewOnly: true;
  realAuthImplemented: false;
};
