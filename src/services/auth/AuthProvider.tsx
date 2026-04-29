import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { getDriveAuthErrorMessage } from '@/src/services/auth/authErrors';
import { signOutOfDrive, subscribeToDriveAuthSession } from '@/src/services/auth/authService';
import type { AuthSession } from '@/src/services/auth/authTypes';

const unauthenticatedSession: AuthSession = {
  status: 'unauthenticated',
  user: null,
};

type DriveAuthContextValue = {
  session: AuthSession;
  isLoading: boolean;
  authErrorMessage: string | null;
  signOut: () => Promise<void>;
};

const DriveAuthContext = createContext<DriveAuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession>(unauthenticatedSession);
  const [isLoading, setIsLoading] = useState(true);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToDriveAuthSession((nextSession) => {
        setSession(nextSession);
        setAuthErrorMessage(null);
        setIsLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      setSession(unauthenticatedSession);
      setAuthErrorMessage(getDriveAuthErrorMessage(error));
      setIsLoading(false);

      return undefined;
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOutOfDrive();
      setSession(unauthenticatedSession);
      setAuthErrorMessage(null);
    } catch (error) {
      setSession(unauthenticatedSession);
      setAuthErrorMessage(getDriveAuthErrorMessage(error));
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      authErrorMessage,
      signOut: handleSignOut,
    }),
    [authErrorMessage, handleSignOut, isLoading, session],
  );

  return <DriveAuthContext.Provider value={value}>{children}</DriveAuthContext.Provider>;
}

export function useDriveAuth() {
  const context = useContext(DriveAuthContext);

  if (!context) {
    throw new Error('useDriveAuth must be used within AuthProvider.');
  }

  return context;
}
