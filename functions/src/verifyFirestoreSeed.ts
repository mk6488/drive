import { getFirestore } from 'firebase-admin/firestore';

import { getDriveFirebaseAdminApp } from './firebaseAdmin';
import { firestoreSeedData } from './firestoreSeedData';
import { createFirestoreSeedPlan, validateFirestoreSeedPlan } from './firestoreSeedPlan';
import {
  createExpectedSeedVerificationChecks,
  createSeedVerificationReport,
  evaluateSeedVerificationCheck,
  summariseSeedVerificationReport,
} from './firestoreSeedVerification';

function formatList(values: readonly string[]) {
  return values.length === 0 ? 'none' : values.join(', ');
}

async function runFirestoreSeedVerification() {
  const seedPlan = createFirestoreSeedPlan(firestoreSeedData);
  const validation = validateFirestoreSeedPlan(seedPlan);
  const checks = createExpectedSeedVerificationChecks(seedPlan);

  console.log('DRIVE Firestore seed verification');
  console.log('=================================');
  console.log(`Seed plan validation status: ${validation.status}`);
  console.log(`Seed plan validation errors: ${formatList(validation.errors)}`);
  console.log('Safety result: this script performs Firestore reads only.');
  console.log('Safety result: no Firestore writes were performed.');
  console.log('Safety result: no Firestore deletes were performed.');
  console.log('Safety result: no real junior data is expected or used.');
  console.log('Safety result: app repository provider remains unchanged and mock backed.');
  console.log('');

  if (validation.status !== 'valid') {
    console.log('Result: blocked. Seed verification did not read Firestore because the seed plan is invalid.');
    process.exitCode = 1;
    return;
  }

  const firestore = getFirestore(getDriveFirebaseAdminApp());
  const results = await Promise.all(
    checks.map(async (check) => {
      const snapshot = await firestore.doc(check.path).get();

      return evaluateSeedVerificationCheck(check, {
        exists: snapshot.exists,
        data: snapshot.exists ? snapshot.data() ?? null : null,
      });
    }),
  );
  const report = createSeedVerificationReport(results);

  console.log('Expected fake seed document checks:');
  report.checks.forEach((check) => {
    console.log(`- ${check.label}`);
    console.log(`  Path: ${check.path}`);
    console.log(`  Expected document type: ${check.expectedDocumentType}`);
    console.log(`  Expected operation type: ${check.expectedOperationType}`);
    console.log(`  Expected document id: ${check.expectedDocumentId}`);
    console.log(`  Exists: ${check.exists ? 'yes' : 'no'}`);
    console.log(`  Status: ${check.status}`);
    check.messages.forEach((message) => {
      console.log(`  Message: ${message}`);
    });
  });
  console.log('');
  console.log('Summary:');
  summariseSeedVerificationReport(report).forEach((message) => {
    console.log(`- ${message}`);
  });

  if (report.status !== 'passed') {
    process.exitCode = 1;
  }
}

async function main() {
  try {
    await runFirestoreSeedVerification();
  } catch (error) {
    console.error('Unable to verify Firestore seed documents.');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('Safety result: no Firestore writes were performed.');
    console.error('Safety result: no Firestore deletes were performed.');
    console.error('Safety result: no real junior data is expected or used.');
    console.error('Safety result: app repository provider remains unchanged and mock backed.');
    process.exitCode = 1;
  }
}

void main();
