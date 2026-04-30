import { applicationDefault, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

let cachedApp: App | null = null;

const FIREBASE_ADMIN_CREDENTIAL_GUIDANCE =
  'Firebase Admin could not be initialised for DRIVE trusted functions. Configure standard local Admin SDK credentials outside this repository, keep credentials out of git, and do not create or commit service account files for this workspace.';

export function getDriveFirebaseAdminApp(): App {
  if (cachedApp) {
    return cachedApp;
  }

  const existingApp = getApps()[0];

  if (existingApp) {
    cachedApp = existingApp;
    return cachedApp;
  }

  try {
    // Credentials must be supplied locally through the standard Admin SDK environment,
    // such as application default credentials. Never commit service account files.
    cachedApp = initializeApp({
      credential: applicationDefault(),
    });
  } catch {
    throw new Error(FIREBASE_ADMIN_CREDENTIAL_GUIDANCE);
  }

  return cachedApp;
}

export function getDriveFirebaseAdminAuth(): Auth {
  return getAuth(getDriveFirebaseAdminApp());
}
