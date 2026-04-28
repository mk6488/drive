import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';

export function PM5EvidencePanel() {
  return (
    <GamePanel title="PM5 Evidence" eyebrow="Private evidence" status="Preview only">
      <View style={styles.content}>
        <AppText variant="body" colour={theme.colours.mist}>
          PM5 photos are private training evidence for your squad and coach review only.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Upload is intentionally disabled in this shell. No photo is captured or stored here.
        </AppText>
        <AppButton
          title="Upload PM5 photo (coming soon)"
          variant="secondary"
          disabled
          helperText="This preview explains the future flow only."
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
