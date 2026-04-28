import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';

type AttributeChipProps = {
  name: string;
  description: string;
};

export function AttributeChip({ name, description }: AttributeChipProps) {
  return (
    <View style={styles.chip}>
      <View style={styles.heading}>
        <AppText variant="label" colour={theme.colours.parchment}>
          {name}
        </AppText>
        <StatusPill label="Future" tone="neutral" />
      </View>
      <AppText variant="caption" colour={theme.colours.mist}>
        {description}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    gap: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.riverDeep,
    borderWidth: 1,
    borderColor: '#2B493A',
    padding: theme.spacing.lg,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
});
