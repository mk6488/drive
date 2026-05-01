import { readFileSync } from 'node:fs';
import path from 'node:path';

type PreflightStatus = 'passed' | 'failed';

type PreflightCheck = {
  label: string;
  status: PreflightStatus;
  messages: readonly string[];
};

const expectedRulePaths = [
  'clubs/{clubId}',
  'squads/{squadId}',
  'athletes/{athleteId}',
  'quests/{questId}',
  'submissions/{submissionId}',
  'rewardResults/{rewardResultId}',
  'athleteProgress/{athleteId}',
  'squadProgress/{squadId}',
] as const;

function getRepoRoot() {
  return path.resolve(__dirname, '..', '..');
}

function readRepoFile(relativePath: string) {
  return readFileSync(path.join(getRepoRoot(), relativePath), 'utf8');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function createCheck(label: string, passed: boolean, messages: readonly string[]): PreflightCheck {
  return {
    label,
    status: passed ? 'passed' : 'failed',
    messages,
  };
}

function getFirebaseRulesPath(firebaseJsonContent: string) {
  const parsedConfig = JSON.parse(firebaseJsonContent) as unknown;

  if (!isRecord(parsedConfig) || !isRecord(parsedConfig.firestore)) {
    return null;
  }

  const rulesPath = parsedConfig.firestore.rules;

  return hasText(rulesPath) ? rulesPath.trim() : null;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasRuleMatchPath(rulesContent: string, expectedPath: string) {
  const pathSegment = expectedPath.includes('/') ? expectedPath : `/${expectedPath}`;
  const matchPattern = new RegExp(`match\\s+/${escapeRegExp(pathSegment.replace(/^\//, ''))}\\s*\\{`);

  return matchPattern.test(rulesContent);
}

function removeLineComments(content: string) {
  return content.replace(/\/\/.*$/gm, '');
}

function hasObviousPublicBlanketRule(rulesContent: string) {
  const uncommentedRules = removeLineComments(rulesContent);
  const publicAllowPatterns = [
    /allow\s+(read|write|read\s*,\s*write|write\s*,\s*read)\s*:\s*if\s+true\s*;/,
    /allow\s+(read|write|read\s*,\s*write|write\s*,\s*read)\s*:\s*if\s+request\.auth\s*==\s*null\s*;/,
    /allow\s+(read|write|read\s*,\s*write|write\s*,\s*read)\s*:\s*if\s+request\.auth\s*=\s*=\s*null\s*;/,
  ];

  return publicAllowPatterns.some((pattern) => pattern.test(uncommentedRules));
}

function buildPreflightChecks(firestoreRulesContent: string, firebaseJsonContent: string): readonly PreflightCheck[] {
  const firebaseRulesPath = getFirebaseRulesPath(firebaseJsonContent);
  const missingExpectedPaths = expectedRulePaths.filter((expectedPath) => !hasRuleMatchPath(firestoreRulesContent, expectedPath));
  const hasPublicBlanketRule = hasObviousPublicBlanketRule(firestoreRulesContent);

  return [
    createCheck('firebase.json references firestore.rules', firebaseRulesPath === 'firestore.rules', [
      `Configured Firestore rules path: ${firebaseRulesPath ?? 'missing'}`,
    ]),
    createCheck('firestore.rules includes expected collection match paths', missingExpectedPaths.length === 0, [
      `Expected paths checked: ${expectedRulePaths.join(', ')}`,
      `Missing paths: ${missingExpectedPaths.length === 0 ? 'none' : missingExpectedPaths.join(', ')}`,
    ]),
    createCheck('firestore.rules has no obvious public blanket read/write rule', !hasPublicBlanketRule, [
      hasPublicBlanketRule
        ? 'Found an obvious public allow rule such as `if true` or unauthenticated blanket access.'
        : 'No obvious public blanket read/write rule was found.',
    ]),
  ];
}

function printPreflightReport(checks: readonly PreflightCheck[]) {
  const failedChecks = checks.filter((check) => check.status === 'failed');

  console.log('DRIVE Firestore rules deployment preflight');
  console.log('==========================================');
  console.log('Scope: local file checks only.');
  console.log('Files checked: firestore.rules, firebase.json.');
  console.log('');
  checks.forEach((check) => {
    console.log(`Check: ${check.label}`);
    console.log(`Status: ${check.status}`);
    check.messages.forEach((message) => {
      console.log(`- ${message}`);
    });
    console.log('');
  });
  console.log(`Overall status: ${failedChecks.length === 0 ? 'passed' : 'failed'}.`);
  console.log('Safety result: no deploy happened.');
  console.log('Safety result: firebase deploy was not run.');
  console.log('Safety result: no Firebase Admin initialisation happened.');
  console.log('Safety result: no Firestore reads were performed.');
  console.log('Safety result: no Firestore writes were performed.');
  console.log('Safety result: app repository provider mode was not changed.');

  if (failedChecks.length > 0) {
    process.exitCode = 1;
  }
}

function main() {
  try {
    const firestoreRulesContent = readRepoFile('firestore.rules');
    const firebaseJsonContent = readRepoFile('firebase.json');
    const checks = buildPreflightChecks(firestoreRulesContent, firebaseJsonContent);

    printPreflightReport(checks);
  } catch (error) {
    console.error('Unable to run Firestore rules deployment preflight.');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('Safety result: no deploy happened.');
    console.error('Safety result: firebase deploy was not run.');
    console.error('Safety result: no Firestore reads were performed.');
    console.error('Safety result: no Firestore writes were performed.');
    process.exitCode = 1;
  }
}

main();
