import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';
import type { SubmissionStatusTone } from '@/src/services/submissions/submissionStatus';

type VerificationGatePanelProps = {
  submissionStatusLabel: string;
  submissionStatusTone: SubmissionStatusTone;
  gateMessage: string;
};

export function VerificationGatePanel({
  submissionStatusLabel,
  submissionStatusTone,
  gateMessage,
}: VerificationGatePanelProps) {
  return (
    <GamePanel
      title="Coach Verification Gate"
      eyebrow="Rewards lock"
      status={submissionStatusLabel}
      statusTone={submissionStatusTone}
    >
      <View style={styles.content}>
        <AppText variant="body" colour={theme.colours.mist}>
          {gateMessage}
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Rewards only unlock after coach verification. Unverified submissions stay awaiting coach review.
        </AppText>
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.sm,
  },
});
