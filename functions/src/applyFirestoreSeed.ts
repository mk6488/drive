import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getFirestore } from 'firebase-admin/firestore';

import {
  evaluateFirestoreSeedApplySafetyGate,
  getFirestoreSeedApplySafetyMessage,
  type FirestoreSeedApplyMode,
} from './firestoreSeedApplySafetyGate';
import { firestoreSeedData } from './firestoreSeedData';
import {
  createFirestoreSeedPlan,
  getFirestoreSeedPlanSummary,
  type FirestoreSeedOperation,
  type FirestoreSeedPlan,
  validateFirestoreSeedPlan,
} from './firestoreSeedPlan';
import { getDriveFirebaseAdminApp } from './firebaseAdmin';

type LiveSeedApplyBlockReason =
  | 'missingJsonFilePath'
  | 'invalidSeedPlan'
  | 'safetyGateBlocked'
  | 'missingTrustedActorId'
  | 'missingAuditReason'
  | 'missingEnvironmentName'
  | 'requestedApplyModeNotLive'
  | 'liveApplyEnvironmentNotEnabled';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getText(value: unknown) {
  return hasText(value) ? value.trim() : null;
}

function getRequestedApplyMode(value: unknown): FirestoreSeedApplyMode | null {
  if (value === 'dryRun' || value === 'apply' || value === 'live') {
    return value;
  }

  return null;
}

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return 'not provided';
  }

  return JSON.stringify(value, null, 2);
}

function formatList(values: readonly string[]) {
  return values.length === 0 ? 'none' : values.join(', ');
}

function readJsonFile(filePath: string) {
  const absolutePath = resolve(process.cwd(), filePath);
  const rawJson = readFileSync(absolutePath, 'utf8');

  return {
    absolutePath,
    parsed: JSON.parse(rawJson) as unknown,
  };
}

function getLiveSeedApplyBlockReasons(input: {
  readonly request: Record<string, unknown>;
  readonly plan: FirestoreSeedPlan;
  readonly validationStatus: 'valid' | 'blocked';
  readonly safetyGateCanApply: boolean;
  readonly liveApplyEnvironmentEnabled: boolean;
}): readonly LiveSeedApplyBlockReason[] {
  const blockReasons: LiveSeedApplyBlockReason[] = [];

  if (input.validationStatus !== 'valid') {
    blockReasons.push('invalidSeedPlan');
  }

  if (!input.safetyGateCanApply) {
    blockReasons.push('safetyGateBlocked');
  }

  if (!hasText(input.request.trustedActorId)) {
    blockReasons.push('missingTrustedActorId');
  }

  if (!hasText(input.request.auditReason)) {
    blockReasons.push('missingAuditReason');
  }

  if (!hasText(input.request.environmentName)) {
    blockReasons.push('missingEnvironmentName');
  }

  if (input.request.requestedApplyMode !== 'live') {
    blockReasons.push('requestedApplyModeNotLive');
  }

  if (!input.liveApplyEnvironmentEnabled) {
    blockReasons.push('liveApplyEnvironmentNotEnabled');
  }

  if (input.plan.operations.length === 0) {
    blockReasons.push('invalidSeedPlan');
  }

  return Array.from(new Set(blockReasons));
}

function getExecutionBlockedReason(liveApplyBlockReasons: readonly LiveSeedApplyBlockReason[]) {
  return liveApplyBlockReasons.length > 0 ? 'the live seed apply run was blocked' : 'the live seed apply run failed';
}

async function applyExampleFirestoreSeed(plan: FirestoreSeedPlan) {
  const firestore = getFirestore(getDriveFirebaseAdminApp());
  const batch = firestore.batch();

  plan.operations.forEach((operation: FirestoreSeedOperation) => {
    batch.set(firestore.doc(operation.path), operation.data);
  });

  await batch.commit();
}

async function runLiveSeedApply(filePath: string) {
  const { absolutePath, parsed } = readJsonFile(filePath);
  const request = isRecord(parsed) ? parsed : {};
  const plan = createFirestoreSeedPlan(firestoreSeedData);
  const validation = validateFirestoreSeedPlan(plan);
  const summary = getFirestoreSeedPlanSummary(plan);
  const liveApplyEnvironmentEnabled = process.env.DRIVE_FIRESTORE_SEED_APPLY === 'true';
  const safetyGate = evaluateFirestoreSeedApplySafetyGate({
    seedPlan: plan,
    validationResult: validation,
    confirmationPhrase: getText(request.confirmationPhrase),
    requestedApplyMode: getRequestedApplyMode(request.requestedApplyMode),
    environmentName: getText(request.environmentName),
    trustedActorId: getText(request.trustedActorId),
    auditReason: getText(request.auditReason),
    liveApplyEnvironmentEnabled,
    realJuniorDataPresent: false,
    serviceAccountFileRequiredInRepo: false,
  });
  const liveSeedApplyBlockReasons = getLiveSeedApplyBlockReasons({
    request,
    plan,
    validationStatus: validation.status,
    safetyGateCanApply: safetyGate.canApplySeedNow,
    liveApplyEnvironmentEnabled,
  });

  console.log('DRIVE Firestore seed apply foundation');
  console.log('=====================================');
  console.log(`Input file: ${absolutePath}`);
  console.log(`Validation status: ${validation.status}`);
  console.log(`Planned document count: ${summary.totalOperations}`);
  console.log(`Planned document types: ${formatList(summary.documentTypes)}`);
  console.log(`Trusted actor id: ${formatValue(request.trustedActorId)}`);
  console.log(`Audit reason: ${formatValue(request.auditReason)}`);
  console.log(`Environment name: ${formatValue(request.environmentName)}`);
  console.log(`Requested apply mode: ${formatValue(request.requestedApplyMode)}`);
  console.log(`DRIVE_FIRESTORE_SEED_APPLY enabled: ${liveApplyEnvironmentEnabled ? 'yes' : 'no'}`);
  console.log('');
  console.log('Planned document paths:');
  plan.operations.forEach((operation) => {
    console.log(`- ${operation.path}`);
    console.log(`  Document type: ${operation.documentType}`);
    console.log(`  Document id: ${operation.documentId}`);
  });
  console.log('');
  console.log('Validation messages:');
  console.log(`Errors: ${formatList(validation.errors)}`);
  validation.warnings.forEach((warning) => {
    console.log(`- ${warning}`);
  });
  console.log('');
  console.log('Safety gate result:');
  console.log(`Status: ${safetyGate.status}`);
  console.log(`Can apply seed now: ${safetyGate.canApplySeedNow ? 'yes' : 'no'}`);
  console.log(`Block reasons: ${formatList(safetyGate.blockReasons)}`);
  console.log(`Safety message: ${getFirestoreSeedApplySafetyMessage(safetyGate)}`);
  console.log(`Live seed apply block reasons: ${formatList(liveSeedApplyBlockReasons)}`);
  console.log('Safety checklist:');
  safetyGate.checklist.summary.forEach((message) => {
    console.log(`- ${message}`);
  });

  if (liveSeedApplyBlockReasons.length > 0) {
    console.log('Execution result:');
    console.log(`Seed data was not written because ${getExecutionBlockedReason(liveSeedApplyBlockReasons)}.`);
    console.log('Result: blocked. No Firestore seed writes were performed.');
    process.exitCode = 1;
    return;
  }

  await applyExampleFirestoreSeed(plan);
  console.log('Execution result:');
  console.log('Fake example seed data was written to Firestore.');
  console.log('Result: Firestore seed apply completed for fake example data only.');
}

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: node lib/applyFirestoreSeed.js <path-to-local-seed-apply-json>');
    console.error('Result: blocked. No Firestore seed writes were performed.');
    process.exitCode = 1;
    return;
  }

  try {
    await runLiveSeedApply(filePath);
  } catch (error) {
    console.error('Unable to run Firestore seed apply foundation.');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('Execution result: seed data was not written because the run failed before a successful apply result was reported.');
    console.error('Result: blocked or failed. No Firestore seed writes were confirmed as performed.');
    process.exitCode = 1;
  }
}

void main();
