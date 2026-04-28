import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';
import type { AttributeProgress } from '@/src/types/progress';

type AttributeProgressPanelProps = {
  attributes: AttributeProgress[];
};

const order = ['Engine', 'Discipline', 'Rhythm', 'Grit'];

export function AttributeProgressPanel({ attributes }: AttributeProgressPanelProps) {
  const ordered = order
    .map((name) => attributes.find((attribute) => attribute.name === name))
    .filter((attribute): attribute is AttributeProgress => Boolean(attribute));

  return (
    <GamePanel title="Attribute Progress" eyebrow="Preview" status="Locked by verification">
      <View style={styles.list}>
        {ordered.map((attribute) => (
          <View key={attribute.name} style={styles.row}>
            <AppText variant="label" colour={theme.colours.parchment}>
              {attribute.name}
            </AppText>
            <AppText variant="body" colour={theme.colours.mist}>
              {attribute.value}
            </AppText>
          </View>
        ))}
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: '#2E4A3C',
    backgroundColor: theme.colours.riverDeep,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
});
