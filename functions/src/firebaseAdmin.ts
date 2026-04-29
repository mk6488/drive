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

  // Credentials must be supplied locally through the standard Admin SDK environment,
  // such as application default credentials. Never commit service account files.
  cachedApp = initializeApp({
    credential: applicationDefault(),
  });

  return cachedApp;
}

export function getDriveFirebaseAdminAuth(): Auth {
  return getAuth(getDriveFirebaseAdminApp());
}
