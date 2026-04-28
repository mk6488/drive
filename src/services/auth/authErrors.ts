const firebaseAuthErrorMessages: Record<string, string> = {
  'auth/invalid-email': 'We could not sign you in with those details.',
  'auth/invalid-credential': 'We could not sign you in with those details.',
  'auth/user-disabled': 'This account is not ready for DRIVE access yet.',
  'auth/user-not-found': 'We could not sign you in with those details.',
  'auth/wrong-password': 'We could not sign you in with those details.',
  'auth/too-many-requests': 'Sign in is temporarily unavailable. Please wait before trying again.',
};

export const firebaseNotConfiguredMessage = 'Firebase is not configured for this build.';
export const incompleteDriveAccessMessage = 'This account is not ready for DRIVE access yet.';
export const genericSignInMessage = 'We could not sign you in with those details.';

export function getDriveAuthErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.includes('Firebase app config is incomplete')) {
    return firebaseNotConfiguredMessage;
  }

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = String((error as { code?: unknown }).code);

    return firebaseAuthErrorMessages[code] ?? genericSignInMessage;
  }

  return genericSignInMessage;
}
