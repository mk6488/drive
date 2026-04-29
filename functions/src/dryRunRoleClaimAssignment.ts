import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  evaluateClaimApplySafetyGate,
  getClaimApplySafetyMessage,
  type ClaimApplyMode,
} from './claimApplySafetyGate';
import { createRoleAssignmentAuditDraft, getRoleAssignmentAuditSummary } from './roleAssignmentAudit';
import { validateClaimAssignmentRequest } from './roleClaimValidation';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatValue(value: unknown) {
  if (value === undefined) {
    return 'not provided';
  }

  return JSON.stringify(value, null, 2);
}

function formatList(values: readonly string[]) {
  if (values.length === 0) {
    return 'none';
  }

  return values.join(', ');
}

function getText(value: unknown) {
  return typeof value === 'string' ? value : null;
}

function getApplyMode(value: unknown): ClaimApplyMode | null {
  if (value === 'dryRun' || value === 'apply') {
    return value;
  }

  return null;
}

function readJsonFile(filePath: string) {
  const absolutePath = resolve(process.cwd(), filePath);
  const rawJson = readFileSync(absolutePath, 'utf8');

  return {
    absolutePath,
    parsed: JSON.parse(rawJson) as unknown,
  };
}

function printDryRunReport(filePath: string, input: unknown) {
  const request = isRecord(input) ? input : {};
  const claims = isRecord(request.claims) ? request.claims : {};
  const validation = validateClaimAssignmentRequest(input);
  const auditDraft = createRoleAssignmentAuditDraft(input, validation);
  const auditSummary = getRoleAssignmentAuditSummary(auditDraft);
  const safetyGate = evaluateClaimApplySafetyGate({
    validationResult: validation,
    auditDraft,
    confirmationPhrase: getText(request.confirmationPhrase),
    requestedApplyMode: getApplyMode(request.requestedApplyMode),
    trustedActorId: getText(request.trustedActorId),
    auditReason: getText(request.auditReason),
    environmentName: getText(request.environmentName),
  });

  console.log('DRIVE trusted claims dry run');
  console.log('==============================');
  console.log(`Input file: ${filePath}`);
  console.log(`Valid for future trusted workflow: ${validation.status === 'readyForFutureTrustedWorkflow' ? 'yes' : 'no'}`);
  console.log(`Validation status: ${validation.status}`);
  console.log(`Target user id: ${formatValue(request.targetUserId)}`);
  console.log(`Requested role: ${formatValue(claims.role)}`);
  console.log('Proposed claims:');
  console.log(formatValue(claims));
  console.log(`Missing fields: ${formatList(validation.missingFields)}`);
  console.log(`Invalid fields: ${formatList(validation.invalidFields)}`);
  console.log('Safety messages:');
  validation.safetyMessages.forEach((message) => {
    console.log(`- ${message}`);
  });
  console.log('Audit trail planning:');
  console.log(`Audit status: ${auditSummary.auditStatus}`);
  console.log(`Target user id: ${formatValue(auditSummary.targetUserId)}`);
  console.log(`Trusted actor id: ${formatValue(auditSummary.trustedActorId)}`);
  console.log(`Audit reason: ${formatValue(auditSummary.auditReason)}`);
  console.log(`Requested role: ${formatValue(auditSummary.requestedRole)}`);
  console.log('Proposed claim scope:');
  console.log(formatValue(auditSummary.proposedClaimScope));
  console.log('Safety checklist summary:');
  auditSummary.safetyChecklistSummary.forEach((message) => {
    console.log(`- ${message}`);
  });
  console.log(`Audit record written: ${auditSummary.auditRecordWasWritten ? 'yes' : 'no'}`);
  console.log(`Custom claims set: ${auditSummary.customClaimsWereSet ? 'yes' : 'no'}`);
  console.log('Future apply safety gate:');
  console.log(`Dry run validation passed: ${safetyGate.checklist.validationPassed ? 'yes' : 'no'}`);
  console.log(`Dry run validation display allowed: ${safetyGate.canDisplayDryRunValidation ? 'yes' : 'no'}`);
  console.log(`Future apply currently blocked: ${safetyGate.futureApplyWouldBeBlocked ? 'yes' : 'no'}`);
  console.log(`Requested apply mode: ${formatValue(safetyGate.requestedApplyMode)}`);
  console.log(`Environment: ${formatValue(safetyGate.checklist.environmentName)}`);
  console.log(`Required confirmation phrase: ${safetyGate.requiredConfirmationPhrase}`);
  console.log(`Confirmation phrase matched: ${safetyGate.checklist.confirmationPhraseMatched ? 'yes' : 'no'}`);
  console.log(`Block reasons: ${formatList(safetyGate.blockReasons)}`);
  console.log(`Safety gate message: ${getClaimApplySafetyMessage(safetyGate)}`);
  console.log('Safety gate checklist:');
  safetyGate.checklist.summary.forEach((message) => {
    console.log(`- ${message}`);
  });
  console.log('Reminder: no Firebase custom claims were set.');
  console.log('Reminder: no role assignment audit record was written.');
  console.log('Reminder: Firebase Admin was not initialised.');
  console.log('Result: no Firebase custom claims were set.');
  console.log('Result: no role assignment audit record was written.');
  console.log('Firebase Admin was not initialised, and no Firestore data was read or written.');
}

function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: node lib/dryRunRoleClaimAssignment.js <path-to-dry-run-json>');
    process.exitCode = 1;
    return;
  }

  try {
    const { absolutePath, parsed } = readJsonFile(filePath);
    printDryRunReport(absolutePath, parsed);
  } catch (error) {
    console.error('Unable to run trusted claims dry run.');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('Result: no Firebase custom claims were set.');
    process.exitCode = 1;
  }
}

main();
