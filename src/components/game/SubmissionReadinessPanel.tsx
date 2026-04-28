import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';
import { getSubmissionStatusDescription, getSubmissionStatusLabel, type SubmissionStatusTone } from '@/src/services/submissions/submissionStatus';
import type { SubmissionStatus } from '@/src/types/submission';

type SubmissionReadinessPanelProps = {
  submissionStatus: SubmissionStatus;
  submissionStatusTone: SubmissionStatusTone;
};

export function SubmissionReadinessPanel({ submissionStatus, submissionStatusTone }: SubmissionReadinessPanelProps) {
  const submissionStatusLabel = getSubmissionStatusLabel(submissionStatus);
  const submissionStatusDescription = getSubmissionStatusDescription(submissionStatus);

  return (
    <GamePanel title="Coach Verification Reminder" eyebrow="Reward gate" status={submissionStatusLabel} statusTone={submissionStatusTone}>
      <View style={styles.content}>
        <AppText variant="body" colour={theme.colours.mist}>
          {submissionStatusDescription}
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Final submit is disabled in this shell, so no workflow is triggered yet.
        </AppText>
        <AppButton
          title="Submit for coach verification (coming soon)"
          variant="secondary"
          disabled
          helperText="This action is intentionally disabled in preview mode."
        />
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
  },
});
