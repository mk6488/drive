import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AttributeProgressPanel } from '@/src/components/game/AttributeProgressPanel';
import { QuestFocusPanel } from '@/src/components/game/QuestFocusPanel';
import { RewardFocusPreviewPanel } from '@/src/components/game/RewardFocusPreviewPanel';
import { VerificationGatePanel } from '@/src/components/game/VerificationGatePanel';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import {
  mockProgressReadRepository,
  mockQuestRepository,
  mockSubmissionRepository,
} from '@/src/services/repositories/mockRepositories';
import {
  getRewardGateMessage,
  getSubmissionStatusLabel,
  getSubmissionStatusTone,
} from '@/src/services/submissions/submissionStatus';
import type { AthleteProgress, Quest, Submission } from '@/src/types';

const previewClubId = 'club-example-001';
const previewSquadId = 'squad-example-juniors';
const previewAthleteId = 'athlete-example-001';

type ScreenState = {
  quest: Quest;
  submission: Submission | null;
  progress: AthleteProgress;
};

function formatExecutionFocus(focus: Quest['executionFocus'][number]) {
  return focus.replace('-', ' ');
}

export function AthleteTodaysQuestScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<ScreenState | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPreviewData = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const [quests, submissions, progress] = await Promise.all([
          mockQuestRepository.listQuestsForSquad(previewClubId, previewSquadId),
          mockSubmissionRepository.listSubmissionsForAthlete(previewAthleteId),
          mockProgressReadRepository.getAthleteProgress(previewAthleteId),
        ]);

        if (!isMounted) {
          return;
        }

        const quest = quests[0] ?? null;
        const questSubmission = submissions.find((submission) => submission.questId === quest?.id) ?? null;

        if (!quest || !progress) {
          setState(null);
          return;
        }

        setState({
          quest,
          submission: questSubmission,
          progress,
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

  const executionFocus = useMemo(
    () => state?.quest.executionFocus.map((focus) => formatExecutionFocus(focus)) ?? [],
    [state?.quest.executionFocus],
  );

  if (isLoading) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Today&apos;s Quest</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            Loading preview quest data...
          </AppText>
        </Card>
      </Screen>
    );
  }

  if (hasError) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Today&apos;s Quest</AppText>
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
          <AppText variant="subtitle">Today&apos;s Quest</AppText>
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
  const verificationGateMessage = getRewardGateMessage(submissionStatus);

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Athlete preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Today&apos;s Quest
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Train for quality first. Rewards unlock only after coach verification.
        </AppText>
      </View>

      <Card tone="river">
        <View style={styles.questHeader}>
          <AppText variant="subtitle" colour={theme.colours.parchment}>
            {state.quest.title}
          </AppText>
          <StatusPill label={submissionStatusLabel} tone={submissionStatusTone} />
        </View>
        <AppText variant="body" colour={theme.colours.mist}>
          {state.quest.description}
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Target: {state.quest.target.durationOrDistance} at {state.quest.target.targetRate ?? 'set rate'} and{' '}
          {state.quest.target.targetPace ?? 'set pace'}.
        </AppText>
      </Card>

      <QuestFocusPanel qualityTarget={state.quest.target.notes ?? 'Execute clean pacing and controlled rating.'} executionFocus={executionFocus} />

      <RewardFocusPreviewPanel executionFocus={state.quest.executionFocus} submissionStatus={submissionStatus} />

      <Card>
        <AppText variant="subtitle">PM5 Evidence</AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          PM5 upload is a future action in this preview. No upload is processed here.
        </AppText>
        <AppButton
          title="Open PM5 evidence preview"
          variant="secondary"
          onPress={() => {
            router.push('/athlete/submission');
          }}
          helperText="Opens a preview shell only. Real upload and submit are still disabled."
        />
      </Card>

      <VerificationGatePanel
        submissionStatusLabel={submissionStatusLabel}
        submissionStatusTone={submissionStatusTone}
        gateMessage={verificationGateMessage}
      />

      <AttributeProgressPanel attributes={state.progress.attributes} />
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
