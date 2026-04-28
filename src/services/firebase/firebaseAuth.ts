import { getAuth, type Auth } from 'firebase/auth';

import { getFirebaseApp } from './firebaseApp';

let firebaseAuth: Auth | null = null;

// Firebase Auth initialisation only. Do not add Firestore, Storage, repositories, routes, or product workflow wiring here.
export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());
  }

  return firebaseAuth;
}
