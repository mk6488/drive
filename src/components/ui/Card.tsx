import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '@/src/constants/theme';

type CardTone = 'parchment' | 'river';

type CardProps = {
  children: ReactNode;
  tone?: CardTone;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, tone = 'parchment', style }: CardProps) {
  return <View style={[styles.card, styles[tone], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  parchment: {
    backgroundColor: theme.colours.parchment,
    borderWidth: 1,
    borderColor: theme.colours.parchmentDeep,
  },
  river: {
    backgroundColor: theme.colours.riverSurface,
    borderWidth: 1,
    borderColor: '#274A39',
  },
});
