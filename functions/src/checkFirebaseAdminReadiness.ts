import type { App } from 'firebase-admin/app';

import { getDriveFirebaseAdminApp } from './firebaseAdmin';

type CredentialProbeResult =
  | {
      status: 'succeeded';
      message: string;
    }
  | {
      status: 'failed';
      message: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getFirebaseConfigProjectId() {
  const firebaseConfig = process.env.FIREBASE_CONFIG;

  if (!hasText(firebaseConfig) || !firebaseConfig.trim().startsWith('{')) {
    return null;
  }

  try {
    const parsedConfig = JSON.parse(firebaseConfig) as unknown;

    if (isRecord(parsedConfig) && hasText(parsedConfig.projectId)) {
      return parsedConfig.projectId.trim();
    }
  } catch {
    return null;
  }

  return null;
}

function getSafeProjectId(app: App) {
  if (hasText(app.options.projectId)) {
    return app.options.projectId.trim();
  }

  const environmentProjectId = process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT;

  if (hasText(environmentProjectId)) {
    return environmentProjectId.trim();
  }

  return getFirebaseConfigProjectId();
}

function getSafeCredentialErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('application default credentials') ||
    lowerMessage.includes('could not load the default credentials') ||
    lowerMessage.includes('google_application_credentials') ||
    lowerMessage.includes('enoent') ||
    lowerMessage.includes('credential')
  ) {
    return [
      'Firebase Admin credentials were not available to this local process.',
      'Configure credentials through standard local Admin SDK mechanisms outside this repository.',
      'Do not create, reference, or commit service account files for this diagnostic step.',
    ].join(' ');
  }

  return 'Firebase Admin readiness could not be confirmed. Check local Admin SDK credential setup outside this repository.';
}

async function probeCredential(app: App): Promise<CredentialProbeResult> {
  const credential = app.options.credential;

  if (!credential || typeof credential.getAccessToken !== 'function') {
    return {
      status: 'failed',
      message:
        'Firebase Admin initialised, but no credential probe was available. Configure standard local Admin SDK credentials outside this repository.',
    };
  }

  try {
    await credential.getAccessToken();

    return {
      status: 'succeeded',
      message: 'Firebase Admin credentials are available to this local process.',
    };
  } catch (error) {
    return {
      status: 'failed',
      message: getSafeCredentialErrorMessage(error),
    };
  }
}

function printSafetyReminders() {
  console.log('Safety reminders:');
  console.log('- No Firebase custom claims were set.');
  console.log('- setCustomUserClaims was not called.');
  console.log('- No Firestore reads or writes happened.');
  console.log('- No users were created.');
  console.log('- No deployment happened.');
}

async function main() {
  console.log('DRIVE Firebase Admin credential readiness check');
  console.log('================================================');
  console.log('Purpose: local diagnostic only.');

  try {
    const app = getDriveFirebaseAdminApp();
    const projectId = getSafeProjectId(app);
    const credentialProbe = await probeCredential(app);

    console.log('Admin initialisation: succeeded.');
    console.log(`Resolved project id: ${projectId ?? 'not safely available'}.`);
    console.log(`Credential check: ${credentialProbe.status}.`);
    console.log(`Credential message: ${credentialProbe.message}`);
    printSafetyReminders();

    if (credentialProbe.status === 'failed') {
      console.log('Result: local Firebase Admin credential readiness was not confirmed.');
      process.exitCode = 1;
      return;
    }

    console.log('Result: local Firebase Admin credential readiness was confirmed.');
  } catch (error) {
    console.log('Admin initialisation: failed.');
    console.log(`Resolved project id: not safely available.`);
    console.log(`Credential message: ${getSafeCredentialErrorMessage(error)}`);
    printSafetyReminders();
    console.log('Result: local Firebase Admin credential readiness was not confirmed.');
    process.exitCode = 1;
  }
}

void main();
