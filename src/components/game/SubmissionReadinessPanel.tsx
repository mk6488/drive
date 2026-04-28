import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';

type SubmissionReadinessPanelProps = {
  submissionStatusLabel: string;
};

export function SubmissionReadinessPanel({ submissionStatusLabel }: SubmissionReadinessPanelProps) {
  return (
    <GamePanel title="Coach Verification Reminder" eyebrow="Reward gate" status={submissionStatusLabel}>
      <View style={styles.content}>
        <AppText variant="body" colour={theme.colours.mist}>
          Rewards only unlock after coach verification. Unverified submissions stay awaiting coach review.
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
