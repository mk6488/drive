import { StyleSheet, TextInput, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';

type ReflectionDraftPanelProps = {
  reflectionDraft: string;
  onChangeReflectionDraft: (nextValue: string) => void;
};

export function ReflectionDraftPanel({ reflectionDraft, onChangeReflectionDraft }: ReflectionDraftPanelProps) {
  return (
    <GamePanel title="Reflection Draft" eyebrow="Training focus" status="Local only">
      <View style={styles.content}>
        <AppText variant="body" colour={theme.colours.mist}>
          Keep this short and training focused: what went well, what was hard to control, and what to try next time.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Do not train through pain, illness, injury, or exhaustion. Recovery choices are part of good training.
        </AppText>
        <TextInput
          value={reflectionDraft}
          onChangeText={onChangeReflectionDraft}
          multiline
          placeholder="Draft a short reflection for coach review..."
          placeholderTextColor={theme.colours.parchmentDeep}
          style={styles.input}
          textAlignVertical="top"
          maxLength={280}
        />
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Draft stays on this screen only and is not saved or submitted in this step.
        </AppText>
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
  },
  input: {
    minHeight: 112,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.reed,
    backgroundColor: theme.colours.riverSurface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colours.parchment,
    ...theme.text.body,
  },
});
