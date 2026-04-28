import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
} from 'firebase/auth';

import type { AuthSession, AuthUser } from '@/src/services/auth/authTypes';
import { getFirebaseAuth } from '@/src/services/firebase/firebaseAuth';

const unauthenticatedSession: AuthSession = {
  status: 'unauthenticated',
  user: null,
};

type DriveCustomClaims = {
  role?: unknown;
  clubId?: unknown;
  squadIds?: unknown;
  linkedAthleteId?: unknown;
  displayName?: unknown;
};

export async function signInWithEmailAndPasswordForDrive(email: string, password: string): Promise<AuthSession> {
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);

  return getDriveAuthSessionFromFirebaseUser(credential.user);
}

export async function signOutOfDrive(): Promise<void> {
  await signOut(getFirebaseAuth());
}

export function getCurrentFirebaseAuthUser(): User | null {
  return getFirebaseAuth().currentUser;
}

export async function getDriveAuthSessionFromFirebaseUser(user: User | null): Promise<AuthSession> {
  if (!user) {
    return unauthenticatedSession;
  }

  const tokenResult = await user.getIdTokenResult();
  const claims = tokenResult.claims as DriveCustomClaims;
  const authUser = getAuthUserFromClaims(user.uid, claims);

  if (!authUser) {
    return unauthenticatedSession;
  }

  return {
    status: 'authenticated',
    user: authUser,
  };
}

export function subscribeToDriveAuthSession(callback: (session: AuthSession) => void): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), (user) => {
    void getDriveAuthSessionFromFirebaseUser(user)
      .then(callback)
      .catch(() => callback(unauthenticatedSession));
  });
}

function getAuthUserFromClaims(userId: string, claims: DriveCustomClaims): AuthUser | null {
  const displayName = getStringClaim(claims.displayName);
  const clubId = getStringClaim(claims.clubId);
  const squadIds = getStringArrayClaim(claims.squadIds);

  if (!displayName || !squadIds) {
    return null;
  }

  if (claims.role === 'athlete') {
    const linkedAthleteId = getStringClaim(claims.linkedAthleteId);

    if (!clubId || !linkedAthleteId) {
      return null;
    }

    return {
      userId,
      role: 'athlete',
      displayName,
      clubId,
      squadIds,
      linkedAthleteId,
    };
  }

  if (claims.role === 'coach') {
    if (!clubId) {
      return null;
    }

    return {
      userId,
      role: 'coach',
      displayName,
      clubId,
      squadIds,
    };
  }

  if (claims.role === 'admin') {
    return {
      userId,
      role: 'admin',
      displayName,
      clubId: clubId || undefined,
      squadIds,
    };
  }

  return null;
}

function getStringClaim(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function getStringArrayClaim(value: unknown): readonly string[] | null {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim().length === 0)) {
    return null;
  }

  return value;
}
