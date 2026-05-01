import { getRepositoryProvider, getRepositoryProviderStatus } from './repositoryProvider';
import type { RepositoryProviderMode } from './repositoryProviderMode';

export type RepositoryReadSmokeTestStatus = 'passed' | 'failed' | 'skipped';

export type RepositoryReadSmokeTestCheck = {
  id: string;
  label: string;
  expectedId: string;
  status: RepositoryReadSmokeTestStatus;
  detail: string;
  providerMode: RepositoryProviderMode;
};

export type RepositoryReadSmokeTestReport = {
  requestedProviderMode: RepositoryProviderMode;
  activeProviderMode: RepositoryProviderMode;
  isUsingMockFallback: boolean;
  firebaseConfigComplete: boolean;
  fixtureLabel: string;
  status: RepositoryReadSmokeTestStatus;
  checks: RepositoryReadSmokeTestCheck[];
  readOnlyNotice: string;
  limitationNotice: string;
};

type RepositoryReadSmokeTestFixture = {
  label: string;
  clubId: string;
  squadId: string;
  athleteId: string;
  questId: string;
  submissionId: string;
};

function getSmokeTestFixture(providerMode: RepositoryProviderMode): RepositoryReadSmokeTestFixture {
  if (providerMode === 'firebase') {
    return {
      label: 'Firebase seed fixture',
      clubId: 'example-club',
      squadId: 'example-j15-squad',
      athleteId: 'example-athlete',
      questId: 'example-quest-rate-20',
      submissionId: 'example-submission-rate-20',
    };
  }

  return {
    label: 'Mock preview fixture',
    clubId: 'club-example-001',
    squadId: 'squad-example-juniors',
    athleteId: 'athlete-example-001',
    questId: 'quest-example-001',
    submissionId: 'submission-example-001',
  };
}

type SmokeTestRead<T> = () => Promise<T | null>;
type SmokeTestMatch<T> = (record: T) => boolean;

async function runReadCheck<T>({
  id,
  label,
  expectedId,
  providerMode,
  read,
  matchesExpectedRecord,
}: {
  id: string;
  label: string;
  expectedId: string;
  providerMode: RepositoryProviderMode;
  read: SmokeTestRead<T>;
  matchesExpectedRecord: SmokeTestMatch<T>;
}): Promise<RepositoryReadSmokeTestCheck> {
  try {
    const record = await read();

    if (!record) {
      return {
        id,
        label,
        expectedId,
        status: 'failed',
        detail: `No record was returned for expected id ${expectedId}.`,
        providerMode,
      };
    }

    if (!matchesExpectedRecord(record)) {
      return {
        id,
        label,
        expectedId,
        status: 'failed',
        detail: `A record was returned, but it did not match expected id ${expectedId}.`,
        providerMode,
      };
    }

    return {
      id,
      label,
      expectedId,
      status: 'passed',
      detail: `Loaded expected fake record ${expectedId} through the active repository provider.`,
      providerMode,
    };
  } catch (error) {
    return {
      id,
      label,
      expectedId,
      status: 'failed',
      detail: error instanceof Error ? error.message : 'Read failed with an unknown error.',
      providerMode,
    };
  }
}

function getReportStatus(checks: readonly RepositoryReadSmokeTestCheck[]): RepositoryReadSmokeTestStatus {
  if (checks.some((check) => check.status === 'failed')) {
    return 'failed';
  }

  if (checks.every((check) => check.status === 'skipped')) {
    return 'skipped';
  }

  return 'passed';
}

export async function runRepositoryReadSmokeTest(): Promise<RepositoryReadSmokeTestReport> {
  const providerStatus = getRepositoryProviderStatus();
  const provider = getRepositoryProvider();
  const providerMode = providerStatus.activeProviderMode;
  const fixture = getSmokeTestFixture(providerMode);

  const checks: RepositoryReadSmokeTestCheck[] = await Promise.all([
    runReadCheck({
      id: 'athlete',
      label: 'Example athlete',
      expectedId: fixture.athleteId,
      providerMode,
      read: () => provider.athleteRepository.getAthleteById(fixture.clubId, fixture.athleteId),
      matchesExpectedRecord: (athlete) => athlete.id === fixture.athleteId,
    }),
    runReadCheck({
      id: 'squad',
      label: 'Example squad',
      expectedId: fixture.squadId,
      providerMode,
      read: () => provider.squadRepository.getSquadById(fixture.clubId, fixture.squadId),
      matchesExpectedRecord: (squad) => squad.id === fixture.squadId,
    }),
    runReadCheck({
      id: 'quest',
      label: 'Example quest',
      expectedId: fixture.questId,
      providerMode,
      read: () => provider.questRepository.getQuestById(fixture.clubId, fixture.questId),
      matchesExpectedRecord: (quest) => quest.id === fixture.questId,
    }),
    runReadCheck({
      id: 'submission',
      label: 'Example submission',
      expectedId: fixture.submissionId,
      providerMode,
      read: () =>
        provider.submissionReadRepository.getSubmissionById(
          fixture.clubId,
          fixture.squadId,
          fixture.athleteId,
          fixture.submissionId,
        ),
      matchesExpectedRecord: (submission) => submission.id === fixture.submissionId,
    }),
    runReadCheck({
      id: 'athlete-progress',
      label: 'Example athlete progress',
      expectedId: fixture.athleteId,
      providerMode,
      read: () => provider.progressReadRepository.getAthleteProgress(fixture.clubId, fixture.athleteId),
      matchesExpectedRecord: (progress) => progress.athleteId === fixture.athleteId,
    }),
    runReadCheck({
      id: 'squad-progress',
      label: 'Example squad progress',
      expectedId: fixture.squadId,
      providerMode,
      read: () => provider.progressReadRepository.getSquadMissionProgress(fixture.clubId, fixture.squadId),
      matchesExpectedRecord: (progress) => progress.squadId === fixture.squadId,
    }),
  ]);

  return {
    requestedProviderMode: providerStatus.requestedProviderMode,
    activeProviderMode: providerStatus.activeProviderMode,
    isUsingMockFallback: providerStatus.isUsingMockFallback,
    firebaseConfigComplete: providerStatus.firebaseConfigComplete,
    fixtureLabel: fixture.label,
    status: getReportStatus(checks),
    checks,
    readOnlyNotice:
      'This smoke test uses read-only repository methods only and does not write, delete, submit, approve, reject, or calculate rewards.',
    limitationNotice:
      'This does not test Firebase Storage, PM5 upload, coach verification, reward calculation, reward writes, athlete progress writes, or squad progress writes.',
  };
}
