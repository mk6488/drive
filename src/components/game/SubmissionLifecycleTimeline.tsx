import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';
import {
  getCurrentLifecycleStage,
  getLifecycleRewardGateMessage,
  getLifecycleRoleGuidance,
  getNextLifecycleMessage,
  getSubmissionLifecycleStages,
} from '@/src/services/submissions/submissionLifecycle';
import { getSubmissionStatusLabel, getSubmissionStatusTone } from '@/src/services/submissions/submissionStatus';
import type { SubmissionStatus } from '@/src/types/submission';

type SubmissionLifecycleTimelineProps = {
  submissionStatus: SubmissionStatus;
};

export function SubmissionLifecycleTimeline({ submissionStatus }: SubmissionLifecycleTimelineProps) {
  const lifecycleStages = getSubmissionLifecycleStages(submissionStatus);
  const currentStage = getCurrentLifecycleStage(submissionStatus);
  const nextStageMessage = getNextLifecycleMessage(submissionStatus);
  const roleGuidance = getLifecycleRoleGuidance(submissionStatus);
  const rewardGateMessage = getLifecycleRewardGateMessage(submissionStatus);

  return (
    <GamePanel
      title="Submission Lifecycle Timeline"
      eyebrow="Lifecycle foundation"
      status={getSubmissionStatusLabel(submissionStatus)}
      statusTone={getSubmissionStatusTone(submissionStatus)}
    >
      <View style={styles.content}>
        {lifecycleStages.map((stage) => (
          <View key={stage.key} style={styles.stageRow}>
            <AppText variant="caption" colour={stage.isCurrent ? theme.colours.parchment : theme.colours.parchmentMuted}>
              {stage.isComplete ? '✓' : '○'} {stage.label}
            </AppText>
            <AppText variant="caption" colour={theme.colours.parchmentMuted}>
              {stage.description}
            </AppText>
          </View>
        ))}
        <AppText variant="caption" colour={theme.colours.parchment}>
          Current stage: {currentStage.label}
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          {nextStageMessage}
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          {roleGuidance}
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          {rewardGateMessage}
        </AppText>
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.sm,
  },
  stageRow: {
    gap: theme.spacing.xs,
  },
});
