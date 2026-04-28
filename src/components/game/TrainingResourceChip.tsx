import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';
import type { TrainingResourceBalance } from '@/src/types';

type TrainingResourceChipProps = {
  balance: TrainingResourceBalance;
};

export function TrainingResourceChip({ balance }: TrainingResourceChipProps) {
  return (
    <View style={styles.chip}>
      <View style={styles.header}>
        <AppText variant="eyebrow" colour={theme.colours.gold}>
          {balance.name}
        </AppText>
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          {balance.amount}
        </AppText>
      </View>
      <AppText variant="caption" colour={theme.colours.parchmentMuted}>
        {balance.description}
      </AppText>
      <AppText variant="caption" colour={theme.colours.mist}>
        Preview-only balance, not a live earned reward.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    minWidth: 150,
    gap: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.riverDeep,
    padding: theme.spacing.md,
  },
  header: {
    gap: theme.spacing.xs,
  },
});
