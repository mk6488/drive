import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';
import type { ExecutionFocus } from '@/src/types/quest';

export type ExecutionFocusOption = {
  value: ExecutionFocus;
  label: string;
  description: string;
};

type ExecutionFocusSelectorProps = {
  options: readonly ExecutionFocusOption[];
  selectedFocus: ExecutionFocus;
  onSelectFocus: (focus: ExecutionFocus) => void;
};

export function ExecutionFocusSelector({
  options,
  selectedFocus,
  onSelectFocus,
}: ExecutionFocusSelectorProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = option.value === selectedFocus;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => {
              onSelectFocus(option.value);
            }}
            style={({ pressed }) => [
              styles.option,
              isSelected ? styles.selectedOption : undefined,
              pressed ? styles.pressedOption : undefined,
            ]}
          >
            <AppText
              variant="label"
              colour={isSelected ? theme.colours.parchment : theme.colours.ink}
            >
              {option.label}
            </AppText>
            <AppText
              variant="caption"
              colour={isSelected ? theme.colours.parchmentMuted : theme.colours.mutedInk}
            >
              {option.description}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  option: {
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.parchmentDeep,
    backgroundColor: theme.colours.white,
    padding: theme.spacing.md,
  },
  selectedOption: {
    borderColor: theme.colours.gold,
    backgroundColor: theme.colours.riverSurface,
  },
  pressedOption: {
    opacity: 0.82,
  },
});
