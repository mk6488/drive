import { getFirestore, type Firestore } from 'firebase/firestore';

import { getFirebaseApp } from './firebaseApp';
import { getMissingFirebaseConfigKeys, isFirebaseConfigComplete } from './firebaseConfig';

let driveFirestore: Firestore | null = null;

function assertFirebaseConfigForFirestore(): void {
  if (!isFirebaseConfigComplete()) {
    const missingKeys = getMissingFirebaseConfigKeys().join(', ');

    throw new Error(
      `Firestore service config is incomplete. Add placeholder-free Expo public Firebase values for: ${missingKeys}`,
    );
  }
}

// Firestore service access only. Do not add collection reads, writes, listeners, repositories, or product workflow wiring here.
export function getDriveFirestore(): Firestore {
  assertFirebaseConfigForFirestore();

  if (!driveFirestore) {
    driveFirestore = getFirestore(getFirebaseApp());
  }

  return driveFirestore;
}
