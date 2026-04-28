import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';
import { canProcessRewardPreview, getRewardLockReason } from '@/src/services/rewards/rewardGate';
import { listRewardFocusSummariesForQuest } from '@/src/services/rewards/rewardRules';
import { getSubmissionStatusLabel, getSubmissionStatusTone } from '@/src/services/submissions/submissionStatus';
import type { ExecutionFocus } from '@/src/types/quest';
import type { SubmissionStatus } from '@/src/types/submission';

type RewardFocusPreviewPanelProps = {
  executionFocus: ExecutionFocus[];
  submissionStatus: SubmissionStatus;
};

function formatFocusLabel(value: ExecutionFocus): string {
  return value.replace(/-/g, ' ');
}

export function RewardFocusPreviewPanel({ executionFocus, submissionStatus }: RewardFocusPreviewPanelProps) {
  const focusSummaries = listRewardFocusSummariesForQuest({ executionFocus });
  const isRewardEligible = canProcessRewardPreview(submissionStatus);
  const lockReason = getRewardLockReason(submissionStatus);

  return (
    <GamePanel
      title="Reward Focus Preview"
      eyebrow="Reward philosophy"
      status={getSubmissionStatusLabel(submissionStatus)}
      statusTone={getSubmissionStatusTone(submissionStatus)}
    >
      <View style={styles.content}>
        <AppText variant="body" colour={theme.colours.mist}>
          This quest trains execution quality signals and attribute emphasis. Exact XP and unlock outcomes are not
          calculated in this preview.
        </AppText>
        <View style={styles.list}>
          {focusSummaries.map((summary) => (
            <View key={summary.signal} style={styles.row}>
              <AppText variant="caption" colour={theme.colours.parchment}>
                - {formatFocusLabel(summary.signal)}: {summary.attributes.join(' + ')}
              </AppText>
              <AppText variant="caption" colour={theme.colours.parchmentMuted}>
                {summary.principle}
              </AppText>
            </View>
          ))}
        </View>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          {isRewardEligible
            ? 'Coach verification is complete, so future trusted reward processing can run.'
            : lockReason ?? 'Reward processing remains locked until coach verification.'}
        </AppText>
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.sm,
  },
  list: {
    gap: theme.spacing.sm,
  },
  row: {
    gap: theme.spacing.xs,
  },
});
