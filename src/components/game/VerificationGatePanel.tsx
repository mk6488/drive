import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';

type VerificationGatePanelProps = {
  submissionStatusLabel: string;
  gateMessage: string;
};

export function VerificationGatePanel({ submissionStatusLabel, gateMessage }: VerificationGatePanelProps) {
  return (
    <GamePanel title="Coach Verification Gate" eyebrow="Rewards lock" status={submissionStatusLabel}>
      <View style={styles.content}>
        <AppText variant="body" colour={theme.colours.mist}>
          {gateMessage}
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Rewards only unlock after coach verification. Unverified submissions stay pending.
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
