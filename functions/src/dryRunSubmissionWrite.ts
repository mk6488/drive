import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createSubmissionWriteDryRunReport, type SubmissionWriteDryRunInput } from './submissionWriteDryRun';
import {
  evaluateSubmissionWriteApplySafetyGate,
  getSubmissionWriteApplySafetyMessage,
  type SubmissionWriteApplyCommandType,
} from './submissionWriteApplySafetyGate';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function toDryRunInput(value: unknown): SubmissionWriteDryRunInput {
  const record = isRecord(value) ? value : {};

  return {
    mode: getString(record.mode) ?? 'unknown',
    requestedApplyMode: getString(record.requestedApplyMode),
    confirmationPhrase: getString(record.confirmationPhrase),
    trustedActorId: getString(record.trustedActorId),
    auditReason: getString(record.auditReason),
    environmentName: getString(record.environmentName),
    clubId: getString(record.clubId),
    squadId: getString(record.squadId),
    athleteId: getString(record.athleteId),
    questId: getString(record.questId),
    submissionId: getString(record.submissionId),
    createdByUserId: getString(record.createdByUserId),
    pm5PhotoPath: getString(record.pm5PhotoPath),
    reflection: getString(record.reflection),
    status: getString(record.status),
    currentStatus: getString(record.currentStatus) ?? null,
    submittedAt: getString(record.submittedAt),
    reviewedByUserId: record.reviewedByUserId,
    reviewedAt: record.reviewedAt,
    coachNote: record.coachNote,
    rewardResultId: record.rewardResultId,
    athleteProgress: record.athleteProgress,
    squadProgress: record.squadProgress,
  };
}

function readJsonFile(filePath: string) {
  const absolutePath = resolve(process.cwd(), filePath);
  const rawJson = readFileSync(absolutePath, 'utf8');

  return {
    absolutePath,
    parsed: JSON.parse(rawJson) as unknown,
  };
}

function formatList(values: readonly string[]): string {
  return values.length === 0 ? 'none' : values.join(', ');
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function commandTypeForMode(mode: SubmissionWriteDryRunInput['mode']): SubmissionWriteApplyCommandType | string {
  if (mode === 'draft') {
    return 'createOrUpdateDraft';
  }

  if (mode === 'submit') {
    return 'submitForCoachReview';
  }

  return 'unknown';
}

function printDryRunReport(filePath: string, input: SubmissionWriteDryRunInput) {
  const report = createSubmissionWriteDryRunReport(input);
  const applySafetyGate = evaluateSubmissionWriteApplySafetyGate({
    requestedApplyMode: input.requestedApplyMode ?? 'dryRun',
    confirmationPhrase: input.confirmationPhrase ?? null,
    submissionWriteApplyEnabled: false,
    trustedActorId: input.trustedActorId ?? null,
    auditReason: input.auditReason ?? null,
    environmentName: input.environmentName ?? null,
    dryRunStatus: report.status,
    commandType: commandTypeForMode(input.mode),
    status: input.status ?? null,
    clubId: input.clubId ?? null,
    squadId: input.squadId ?? null,
    athleteId: input.athleteId ?? null,
    questId: input.questId ?? null,
    submissionId: input.submissionId ?? null,
    pm5PhotoPath: input.pm5PhotoPath ?? null,
    reviewedByUserId: input.reviewedByUserId,
    reviewedAt: input.reviewedAt,
    coachNote: input.coachNote,
    rewardResultId: input.rewardResultId,
    athleteProgress: input.athleteProgress,
    squadProgress: input.squadProgress,
    realJuniorDataPresent: false,
  });

  console.log('DRIVE submission write dry run');
  console.log('==============================');
  console.log(`Input file: ${filePath}`);
  console.log(`Dry run mode: ${report.mode}`);
  console.log(`Validation status: ${report.status}`);
  console.log(`Blocked reasons: ${formatList(report.blockedReasons)}`);
  console.log('');
  console.log('Planned submission document path:');
  console.log(report.plannedSubmissionDocumentPath);
  console.log('');
  console.log('Planned future document shape:');
  console.log(formatJson(report.plannedFutureDocumentShape));
  console.log('');
  console.log('Validation checks:');
  report.checks.forEach((check) => {
    console.log(`- ${check.status}: ${check.message}`);
  });
  console.log('');
  console.log('Future apply safety gate:');
  console.log(`Status: ${applySafetyGate.status}`);
  console.log(`Message: ${getSubmissionWriteApplySafetyMessage(applySafetyGate)}`);
  console.log(`Future live write blocked: ${applySafetyGate.futureLiveApplyWouldBeBlocked ? 'yes' : 'no'}`);
  console.log(`Required confirmation phrase: ${applySafetyGate.requiredConfirmationPhrase}`);
  console.log(`Submission write apply environment flag required: yes`);
  console.log(
    `Submission write apply environment flag enabled in this dry run input: ${
      applySafetyGate.checklist.submissionWriteApplyEnabled ? 'yes' : 'no'
    }`,
  );
  console.log(`Block reasons: ${formatList(applySafetyGate.blockReasons)}`);
  console.log('Checklist:');
  applySafetyGate.checklist.summary.forEach((message) => {
    console.log(`- ${message}`);
  });
  console.log('Safety gate result: no Firestore write happened.');
  console.log('Safety gate result: no Storage upload happened.');
  console.log('Safety gate result: no reward or progress write happened.');
  console.log('');
  console.log('Safety result: no Firestore write happened.');
  console.log('Safety result: no Firestore read happened.');
  console.log('Safety result: no Storage upload happened.');
  console.log('Safety result: no reward result write happened.');
  console.log('Safety result: no athlete progress write happened.');
  console.log('Safety result: no squad progress write happened.');
  console.log('Safety result: no real junior data is included.');
  console.log('Safety result: fake example ids only are accepted.');
  console.log('Safety result: Firebase Admin was not initialised.');
  console.log('Safety result: live submission write is not implemented.');
  console.log(
    `Dry run completed as ${report.status === 'blocked' ? 'a blocked rehearsal; no live workflow was reached.' : 'a valid write-free rehearsal.'}`,
  );
}

function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: node lib/dryRunSubmissionWrite.js <path-to-dry-run-json>');
    process.exitCode = 1;
    return;
  }

  try {
    const { absolutePath, parsed } = readJsonFile(filePath);
    printDryRunReport(absolutePath, toDryRunInput(parsed));
  } catch (error) {
    console.error('Unable to run submission write dry run.');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('Safety result: no Firestore write happened.');
    console.error('Safety result: no Storage upload happened.');
    console.error('Safety result: Firebase Admin was not initialised.');
    process.exitCode = 1;
  }
}

main();
