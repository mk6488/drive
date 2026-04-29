import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
  console.log('Result: no Firebase custom claims were set.');
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
