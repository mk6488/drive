import { applicationDefault, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

let cachedApp: App | null = null;

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
  } catch (error) {
    throw new Error(
      `Firebase Admin could not be initialised for DRIVE trusted claim apply. Use standard local Admin SDK credentials only, keep credentials out of git, and do not create service account files in this repository. ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  return cachedApp;
}

export function getDriveFirebaseAdminAuth(): Auth {
  return getAuth(getDriveFirebaseAdminApp());
}
