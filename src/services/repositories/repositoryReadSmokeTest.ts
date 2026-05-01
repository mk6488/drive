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
  expectedDatasetLabel: string;
  expectedClubId: string;
  expectedSquadId: string;
  expectedAthleteId: string;
  status: RepositoryReadSmokeTestStatus;
  checks: RepositoryReadSmokeTestCheck[];
  readOnlyNotice: string;
  limitationNotice: string;
};

type RepositoryReadSmokeTestExpectedDataset = {
  label: string;
  clubId: string;
  squadId: string;
  athleteId: string;
  questId: string;
  submissionId: string;
};

const expectedDatasetsByProviderMode: Record<RepositoryProviderMode, RepositoryReadSmokeTestExpectedDataset> = {
  mock: {
    label: 'Mock preview dataset',
    clubId: 'club-example-001',
    squadId: 'squad-example-juniors',
    athleteId: 'athlete-example-001',
    questId: 'quest-example-001',
    submissionId: 'submission-example-001',
  },
  firebase: {
    label: 'Firebase seeded example dataset',
    clubId: 'example-club',
    squadId: 'example-j15-squad',
    athleteId: 'example-athlete',
    questId: 'example-quest-rate-20',
    submissionId: 'example-submission-rate-20',
  },
};

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
  const expectedDataset = expectedDatasetsByProviderMode[providerMode];

  const checks: RepositoryReadSmokeTestCheck[] = await Promise.all([
    runReadCheck({
      id: 'athlete',
      label: 'Example athlete',
      expectedId: expectedDataset.athleteId,
      providerMode,
      read: () => provider.athleteRepository.getAthleteById(expectedDataset.clubId, expectedDataset.athleteId),
      matchesExpectedRecord: (athlete) => athlete.id === expectedDataset.athleteId,
    }),
    runReadCheck({
      id: 'squad',
      label: 'Example squad',
      expectedId: expectedDataset.squadId,
      providerMode,
      read: () => provider.squadRepository.getSquadById(expectedDataset.clubId, expectedDataset.squadId),
      matchesExpectedRecord: (squad) => squad.id === expectedDataset.squadId,
    }),
    runReadCheck({
      id: 'quest',
      label: 'Example quest',
      expectedId: expectedDataset.questId,
      providerMode,
      read: () => provider.questRepository.getQuestById(expectedDataset.clubId, expectedDataset.questId),
      matchesExpectedRecord: (quest) => quest.id === expectedDataset.questId,
    }),
    runReadCheck({
      id: 'submission',
      label: 'Example submission',
      expectedId: expectedDataset.submissionId,
      providerMode,
      read: () =>
        provider.submissionReadRepository.getSubmissionById(
          expectedDataset.clubId,
          expectedDataset.squadId,
          expectedDataset.athleteId,
          expectedDataset.submissionId,
        ),
      matchesExpectedRecord: (submission) => submission.id === expectedDataset.submissionId,
    }),
    runReadCheck({
      id: 'athlete-progress',
      label: 'Example athlete progress',
      expectedId: expectedDataset.athleteId,
      providerMode,
      read: () => provider.progressReadRepository.getAthleteProgress(expectedDataset.clubId, expectedDataset.athleteId),
      matchesExpectedRecord: (progress) => progress.athleteId === expectedDataset.athleteId,
    }),
    runReadCheck({
      id: 'squad-progress',
      label: 'Example squad progress',
      expectedId: expectedDataset.squadId,
      providerMode,
      read: () => provider.progressReadRepository.getSquadMissionProgress(expectedDataset.clubId, expectedDataset.squadId),
      matchesExpectedRecord: (progress) => progress.squadId === expectedDataset.squadId,
    }),
  ]);

  return {
    requestedProviderMode: providerStatus.requestedProviderMode,
    activeProviderMode: providerStatus.activeProviderMode,
    isUsingMockFallback: providerStatus.isUsingMockFallback,
    firebaseConfigComplete: providerStatus.firebaseConfigComplete,
    expectedDatasetLabel: expectedDataset.label,
    expectedClubId: expectedDataset.clubId,
    expectedSquadId: expectedDataset.squadId,
    expectedAthleteId: expectedDataset.athleteId,
    status: getReportStatus(checks),
    checks,
    readOnlyNotice:
      'This smoke test uses read-only repository methods only and does not write, delete, submit, approve, reject, or calculate rewards.',
    limitationNotice:
      'This does not test Firebase Storage, PM5 upload, coach verification, reward calculation, reward writes, athlete progress writes, or squad progress writes.',
  };
}
