import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  evaluateClaimApplySafetyGate,
  getClaimApplySafetyMessage,
  type ClaimApplyMode,
} from './claimApplySafetyGate';
import { getDriveFirebaseAdminAuth } from './firebaseAdmin';
import { createRoleAssignmentAuditDraft, getRoleAssignmentAuditSummary } from './roleAssignmentAudit';
import type { DriveAthleteCustomClaims, DriveCoachCustomClaims, DriveCustomClaims } from './roleClaims';
import { validateClaimAssignmentRequest } from './roleClaimValidation';

type LiveApplyBlockReason =
  | 'missingJsonFilePath'
  | 'targetUserIdMissing'
  | 'trustedActorIdMissing'
  | 'auditReasonMissing'
  | 'clubIdMissing'
  | 'linkedAthleteIdMissing'
  | 'roleNotLiveApplyAllowed'
  | 'requestedApplyModeNotLive'
  | 'liveApplyEnvironmentNotEnabled'
  | 'safetyGateBlocked';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getText(value: unknown) {
  return hasText(value) ? value.trim() : null;
}

function getRequestedApplyMode(value: unknown): ClaimApplyMode | null {
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

function getClaims(input: unknown) {
  const request = isRecord(input) ? input : {};

  return isRecord(request.claims) ? request.claims : {};
}

function getLiveApplyBlockReasons(
  input: unknown,
  safetyGateCanApply: boolean,
  liveApplyEnvironmentEnabled: boolean,
): readonly LiveApplyBlockReason[] {
  const request = isRecord(input) ? input : {};
  const claims = getClaims(input);
  const blockReasons: LiveApplyBlockReason[] = [];

  if (!hasText(request.targetUserId)) {
    blockReasons.push('targetUserIdMissing');
  }

  if (!hasText(request.trustedActorId)) {
    blockReasons.push('trustedActorIdMissing');
  }

  if (!hasText(request.auditReason)) {
    blockReasons.push('auditReasonMissing');
  }

  if (!hasText(claims.clubId)) {
    blockReasons.push('clubIdMissing');
  }

  if (claims.role === 'athlete' && !hasText(claims.linkedAthleteId)) {
    blockReasons.push('linkedAthleteIdMissing');
  }

  if (claims.role !== 'athlete' && claims.role !== 'coach') {
    blockReasons.push('roleNotLiveApplyAllowed');
  }

  if (request.requestedApplyMode !== 'live') {
    blockReasons.push('requestedApplyModeNotLive');
  }

  if (!liveApplyEnvironmentEnabled) {
    blockReasons.push('liveApplyEnvironmentNotEnabled');
  }

  if (!safetyGateCanApply) {
    blockReasons.push('safetyGateBlocked');
  }

  return Array.from(new Set(blockReasons));
}

function buildClaimsForLiveApply(input: unknown): DriveCustomClaims | null {
  const claims = getClaims(input);

  if (claims.role === 'athlete') {
    return {
      role: 'athlete',
      clubId: String(claims.clubId),
      squadIds: Array.isArray(claims.squadIds) ? claims.squadIds.filter(hasText).map((squadId) => squadId.trim()) : [],
      linkedAthleteId: String(claims.linkedAthleteId),
      displayName: String(claims.displayName),
    } satisfies DriveAthleteCustomClaims;
  }

  if (claims.role === 'coach') {
    return {
      role: 'coach',
      clubId: String(claims.clubId),
      squadIds: Array.isArray(claims.squadIds) ? claims.squadIds.filter(hasText).map((squadId) => squadId.trim()) : [],
      displayName: String(claims.displayName),
    } satisfies DriveCoachCustomClaims;
  }

  return null;
}

async function applyDriveCustomClaims(targetUserId: string, claims: DriveCustomClaims) {
  await getDriveFirebaseAdminAuth().setCustomUserClaims(targetUserId, claims);
}

async function runLiveApply(filePath: string) {
  const { absolutePath, parsed } = readJsonFile(filePath);
  const request = isRecord(parsed) ? parsed : {};
  const claims = getClaims(parsed);
  const validation = validateClaimAssignmentRequest(parsed);
  const auditDraft = createRoleAssignmentAuditDraft(parsed, validation);
  const auditSummary = getRoleAssignmentAuditSummary(auditDraft);
  const liveApplyEnvironmentEnabled = process.env.DRIVE_CLAIMS_LIVE_APPLY === 'true';
  const safetyGate = evaluateClaimApplySafetyGate({
    validationResult: validation,
    auditDraft,
    confirmationPhrase: getText(request.confirmationPhrase),
    requestedApplyMode: getRequestedApplyMode(request.requestedApplyMode),
    trustedActorId: getText(request.trustedActorId),
    auditReason: getText(request.auditReason),
    environmentName: getText(request.environmentName),
    liveApplyEnvironmentEnabled,
    liveApplyExecutionAllowed: true,
  });
  const liveApplyBlockReasons = getLiveApplyBlockReasons(parsed, safetyGate.canApplyClaimsNow, liveApplyEnvironmentEnabled);
  const claimsToApply = buildClaimsForLiveApply(parsed);

  console.log('DRIVE trusted claims live apply foundation');
  console.log('===========================================');
  console.log(`Input file: ${absolutePath}`);
  console.log(`Validation status: ${validation.status}`);
  console.log(`Target user id: ${formatValue(request.targetUserId)}`);
  console.log(`Trusted actor id: ${formatValue(request.trustedActorId)}`);
  console.log(`Audit reason: ${formatValue(request.auditReason)}`);
  console.log(`Requested role: ${formatValue(claims.role)}`);
  console.log(`Requested apply mode: ${formatValue(request.requestedApplyMode)}`);
  console.log(`DRIVE_CLAIMS_LIVE_APPLY enabled: ${liveApplyEnvironmentEnabled ? 'yes' : 'no'}`);
  console.log('Proposed claims:');
  console.log(formatValue(claims));
  console.log(`Validation missing fields: ${formatList(validation.missingFields)}`);
  console.log(`Validation invalid fields: ${formatList(validation.invalidFields)}`);
  console.log('Audit draft summary:');
  console.log(formatValue(auditSummary));
  console.log('Safety gate:');
  console.log(`Status: ${safetyGate.status}`);
  console.log(`Can apply claims now: ${safetyGate.canApplyClaimsNow ? 'yes' : 'no'}`);
  console.log(`Block reasons: ${formatList(safetyGate.blockReasons)}`);
  console.log(`Safety message: ${getClaimApplySafetyMessage(safetyGate)}`);
  console.log(`Live apply block reasons: ${formatList(liveApplyBlockReasons)}`);

  if (liveApplyBlockReasons.length > 0 || !claimsToApply) {
    console.log('Result: blocked. No Firebase custom claims were set.');
    process.exitCode = 1;
    return;
  }

  await applyDriveCustomClaims(String(request.targetUserId).trim(), claimsToApply);
  console.log('Result: Firebase custom claims were set for the target user.');
}

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: node lib/applyRoleClaimAssignment.js <path-to-live-claim-json>');
    console.error('Result: blocked. No Firebase custom claims were set.');
    process.exitCode = 1;
    return;
  }

  try {
    await runLiveApply(filePath);
  } catch (error) {
    console.error('Unable to run trusted claims live apply foundation.');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('Result: blocked or failed. No further Firebase custom claim action was attempted.');
    process.exitCode = 1;
  }
}

void main();
