import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CoachSubmissionReviewCard } from '@/src/components/game/CoachSubmissionReviewCard';
import { CoachVerificationBoundaryPanel } from '@/src/components/game/CoachVerificationBoundaryPanel';
import { SubmissionLifecycleTimeline } from '@/src/components/game/SubmissionLifecycleTimeline';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import {
  mockAthleteRepository,
  mockQuestRepository,
  mockSubmissionRepository,
} from '@/src/services/repositories/mockRepositories';
import { isSubmissionAwaitingCoachReview } from '@/src/services/submissions/submissionStatus';
import type { Submission } from '@/src/types';

const previewClubId = 'club-example-001';
const previewSquadId = 'squad-example-juniors';

type QueueItem = {
  submissionId: string;
  questTitle: string;
  athleteDisplayName: string;
  status: Submission['status'];
  reflectionSummary: string;
  pm5EvidencePath: string;
};

function summarizeReflection(reflection: string) {
  if (!reflection.trim()) {
    return 'No reflection provided in this preview record.';
  }

  if (reflection.length <= 120) {
    return reflection;
  }

  return `${reflection.slice(0, 117).trimEnd()}...`;
}

function getSortPriority(status: Submission['status']) {
  if (status === 'submitted') {
    return 0;
  }

  if (status === 'verified') {
    return 1;
  }

  if (status === 'rejected') {
    return 2;
  }

  return 3;
}

export function CoachVerificationQueueShellScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadPreviewQueue = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const [quests, athletes] = await Promise.all([
          mockQuestRepository.listQuestsForSquad(previewClubId, previewSquadId),
          mockAthleteRepository.listAthletesBySquad(previewClubId, previewSquadId),
        ]);

        const submissionGroups = await Promise.all(
          athletes.map(async (athlete) => ({
            athlete,
            submissions: await mockSubmissionRepository.listSubmissionsForAthlete(athlete.id),
          })),
        );

        if (!isMounted) {
          return;
        }

        const questsById = new Map(quests.map((quest) => [quest.id, quest]));
        const loadedQueue = submissionGroups
          .flatMap(({ athlete, submissions }) =>
            submissions
              .filter(
                (submission) =>
                  submission.status === 'submitted' ||
                  submission.status === 'verified' ||
                  submission.status === 'rejected',
              )
              .map((submission) => ({
                submissionId: submission.id,
                questTitle: questsById.get(submission.questId)?.title ?? 'Unknown quest',
                athleteDisplayName: athlete.displayName,
                status: submission.status,
                reflectionSummary: summarizeReflection(submission.reflection),
                pm5EvidencePath: submission.pm5PhotoPath || 'PM5 evidence path placeholder',
              })),
          )
          .sort((a, b) => getSortPriority(a.status) - getSortPriority(b.status));

        setQueueItems(loadedQueue);
      } catch {
        if (!isMounted) {
          return;
        }

        setHasError(true);
        setQueueItems([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPreviewQueue();

    return () => {
      isMounted = false;
    };
  }, []);

  const awaitingReviewCount = useMemo(
    () => queueItems.filter((item) => isSubmissionAwaitingCoachReview(item.status)).length,
    [queueItems],
  );

  if (isLoading) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Coach verification queue preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            Loading queue shell...
          </AppText>
        </Card>
      </Screen>
    );
  }

  if (hasError) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Coach verification queue preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            Preview data could not be loaded. Please retry in a later step.
          </AppText>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Coach preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Verification Queue
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          This queue is a shell preview. Rewards unlock only after trusted coach verification, and actions here are
          intentionally disabled.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Verification is the future trigger for reward processing, but no real reward processing runs from this screen.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Queue overview</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Showing submissions with submitted, verified, or rejected status from mock repositories.
        </AppText>
        <AppText variant="caption" colour={theme.colours.mutedInk}>
          Awaiting coach review: {awaitingReviewCount}
        </AppText>
      </Card>

      <SubmissionLifecycleTimeline submissionStatus={awaitingReviewCount > 0 ? 'submitted' : 'draft'} />

      {queueItems.length === 0 ? (
        <Card>
          <AppText variant="subtitle">No submissions available</AppText>
          <AppText variant="body" colour={theme.colours.mutedInk}>
            No mock submissions are currently waiting for coach review.
          </AppText>
        </Card>
      ) : (
        queueItems.map((item) => (
          <CoachSubmissionReviewCard
            key={item.submissionId}
            questTitle={item.questTitle}
            athleteDisplayName={item.athleteDisplayName}
            submissionStatus={item.status}
            reflectionSummary={item.reflectionSummary}
            pm5EvidencePath={item.pm5EvidencePath}
          />
        ))
      )}

      <CoachVerificationBoundaryPanel />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
});
