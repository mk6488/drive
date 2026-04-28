import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';

import { firebaseConfig, getMissingFirebaseConfigKeys, isFirebaseConfigComplete } from './firebaseConfig';

// Firebase app initialisation only. Do not add Auth, Firestore, Storage, repositories, or product workflow wiring here.
export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigComplete()) {
    const missingKeys = getMissingFirebaseConfigKeys().join(', ');

    throw new Error(
      `Firebase app config is incomplete. Add placeholder-free Expo public values for: ${missingKeys}`,
    );
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}
