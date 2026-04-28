import type { ReactNode } from 'react';
import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { theme } from '@/src/constants/theme';

type AppTextVariant = 'title' | 'subtitle' | 'body' | 'label' | 'caption' | 'eyebrow';

type AppTextProps = TextProps & {
  children: ReactNode;
  variant?: AppTextVariant;
  colour?: string;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
};

export function AppText({ children, variant = 'body', colour, align, style, ...props }: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        colour ? { color: colour } : undefined,
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: theme.colours.ink,
  },
  title: theme.text.title,
  subtitle: theme.text.subtitle,
  body: theme.text.body,
  label: theme.text.label,
  caption: theme.text.caption,
  eyebrow: theme.text.eyebrow,
});
