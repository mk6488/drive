import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PM5EvidencePanel } from '@/src/components/game/PM5EvidencePanel';
import { ReflectionDraftPanel } from '@/src/components/game/ReflectionDraftPanel';
import { SubmissionLifecycleTimeline } from '@/src/components/game/SubmissionLifecycleTimeline';
import { SubmissionReadinessPanel } from '@/src/components/game/SubmissionReadinessPanel';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import { getRepositoryProvider } from '@/src/services/repositories/repositoryProvider';
import { getSubmissionStatusLabel, getSubmissionStatusTone } from '@/src/services/submissions/submissionStatus';
import type { Quest, Submission } from '@/src/types';

const previewClubId = 'club-example-001';
const previewSquadId = 'squad-example-juniors';
const previewAthleteId = 'athlete-example-001';
const { questRepository, submissionRepository } = getRepositoryProvider();

type ScreenState = {
  quest: Quest;
  submission: Submission | null;
};

function formatTargetSummary(quest: Quest) {
  const rate = quest.target.targetRate ?? 'coach-set rate';
  const pace = quest.target.targetPace ?? 'coach-set pace';
  return `${quest.target.durationOrDistance} at ${rate} and ${pace}.`;
}

export function AthleteSubmissionShellScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [state, setState] = useState<ScreenState | null>(null);
  const [reflectionDraft, setReflectionDraft] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPreviewData = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const [quests, submissions] = await Promise.all([
          questRepository.listQuestsForSquad(previewClubId, previewSquadId),
          submissionRepository.listSubmissionsForAthlete(previewAthleteId),
        ]);

        if (!isMounted) {
          return;
        }

        const quest = quests[0] ?? null;
        const questSubmission = submissions.find((submission) => submission.questId === quest?.id) ?? null;

        if (!quest) {
          setState(null);
          return;
        }

        setState({
          quest,
          submission: questSubmission,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setHasError(true);
        setState(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPreviewData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">PM5 Evidence Preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            Loading submission shell preview...
          </AppText>
        </Card>
      </Screen>
    );
  }

  if (hasError) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">PM5 Evidence Preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            Preview data could not be loaded. Please retry in a later step.
          </AppText>
        </Card>
      </Screen>
    );
  }

  if (!state) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">PM5 Evidence Preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            No preview quest is available yet.
          </AppText>
        </Card>
      </Screen>
    );
  }

  const submissionStatus = state.submission?.status ?? 'draft';
  const submissionStatusLabel = getSubmissionStatusLabel(submissionStatus);
  const submissionStatusTone = getSubmissionStatusTone(submissionStatus);

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Athlete preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          PM5 Evidence Submission
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          This is a shell preview of the next step after Today&apos;s Quest. Upload and submit actions are disabled on
          purpose.
        </AppText>
      </View>

      <Card tone="river">
        <View style={styles.questHeader}>
          <AppText variant="subtitle" colour={theme.colours.parchment}>
            {state.quest.title}
          </AppText>
          <StatusPill label={submissionStatusLabel} tone={submissionStatusTone} />
        </View>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Target summary: {formatTargetSummary(state.quest)}
        </AppText>
      </Card>

      <PM5EvidencePanel />
      <ReflectionDraftPanel reflectionDraft={reflectionDraft} onChangeReflectionDraft={setReflectionDraft} />
      <SubmissionLifecycleTimeline submissionStatus={submissionStatus} />
      <SubmissionReadinessPanel submissionStatus={submissionStatus} submissionStatusTone={submissionStatusTone} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
});
