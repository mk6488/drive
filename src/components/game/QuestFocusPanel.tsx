import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';

type QuestFocusPanelProps = {
  qualityTarget: string;
  executionFocus: string[];
};

export function QuestFocusPanel({ qualityTarget, executionFocus }: QuestFocusPanelProps) {
  return (
    <GamePanel title="Execution Focus" eyebrow="Quality target" status="Today">
      <View style={styles.content}>
        <AppText variant="body" colour={theme.colours.mist}>
          {qualityTarget}
        </AppText>
        <View style={styles.list}>
          {executionFocus.map((focus) => (
            <AppText key={focus} variant="caption" colour={theme.colours.parchment}>
              - {focus}
            </AppText>
          ))}
        </View>
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
  },
  list: {
    gap: theme.spacing.xs,
  },
});
