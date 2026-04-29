import { getStorage, type FirebaseStorage } from 'firebase/storage';

import { getFirebaseApp } from './firebaseApp';
import { getMissingFirebaseConfigKeys, isFirebaseConfigComplete } from './firebaseConfig';

let driveStorage: FirebaseStorage | null = null;

function assertFirebaseConfigForStorage(): void {
  if (!isFirebaseConfigComplete()) {
    const missingKeys = getMissingFirebaseConfigKeys().join(', ');

    throw new Error(
      `Storage service config is incomplete. Add placeholder-free Expo public Firebase values for: ${missingKeys}`,
    );
  }
}

// Storage service access only. Do not add uploads, downloads, deletes, PM5 workflows, or product screen wiring here.
export function getDriveStorage(): FirebaseStorage {
  assertFirebaseConfigForStorage();

  if (!driveStorage) {
    driveStorage = getStorage(getFirebaseApp());
  }

  return driveStorage;
}
