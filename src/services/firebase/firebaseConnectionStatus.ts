import { getFirebaseApp } from './firebaseApp';
import { getMissingFirebaseConfigKeys, isFirebaseConfigComplete } from './firebaseConfig';
import { getRepositoryProviderModeStatus } from '@/src/services/repositories/repositoryProviderMode';

export type FirebaseAppInitialisationCheck = {
  hasRun: boolean;
  passed: boolean;
  message: string;
};

export type FirebaseConnectionStatus = {
  firebaseConfigComplete: boolean;
  missingFirebaseConfigKeys: string[];
  firebaseAppInitialisationCheck: FirebaseAppInitialisationCheck;
  requestedRepositoryProviderMode: 'mock' | 'firebase';
  activeRepositoryProviderMode: 'mock' | 'firebase';
  repositoryProviderIsMockBacked: boolean;
  firebaseModeEnabledByDefault: boolean;
  firestoreReadsTested: boolean;
  firestoreWritesTested: boolean;
  storageUploadTested: boolean;
  authSignInTested: boolean;
};

const uncheckedFirebaseAppInitialisationCheck: FirebaseAppInitialisationCheck = {
  hasRun: false,
  passed: false,
  message: 'Not checked yet. Press the local preview button to test Firebase app initialisation only.',
};

export function checkFirebaseAppInitialisation(): FirebaseAppInitialisationCheck {
  try {
    getFirebaseApp();

    return {
      hasRun: true,
      passed: true,
      message: 'Firebase app initialisation completed through the safe app boundary.',
    };
  } catch (error) {
    return {
      hasRun: true,
      passed: false,
      message: error instanceof Error ? error.message : 'Firebase app initialisation failed with an unknown error.',
    };
  }
}

export function getFirebaseConnectionStatus(
  firebaseAppInitialisationCheck: FirebaseAppInitialisationCheck = uncheckedFirebaseAppInitialisationCheck,
): FirebaseConnectionStatus {
  const firebaseConfigComplete = isFirebaseConfigComplete();
  const repositoryModeStatus = getRepositoryProviderModeStatus();
  const activeRepositoryProviderMode =
    repositoryModeStatus.isFirebaseExplicitlyRequested && firebaseConfigComplete ? 'firebase' : 'mock';

  return {
    firebaseConfigComplete,
    missingFirebaseConfigKeys: getMissingFirebaseConfigKeys(),
    firebaseAppInitialisationCheck,
    requestedRepositoryProviderMode: repositoryModeStatus.requestedProviderMode,
    activeRepositoryProviderMode,
    repositoryProviderIsMockBacked: activeRepositoryProviderMode === 'mock',
    firebaseModeEnabledByDefault: false,
    firestoreReadsTested: false,
    firestoreWritesTested: false,
    storageUploadTested: false,
    authSignInTested: false,
  };
}
