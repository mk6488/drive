import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '@/src/constants/theme';
import { AppText } from '@/src/components/ui/AppText';

type AppButtonVariant = 'primary' | 'secondary' | 'quiet';

type AppButtonProps = PressableProps & {
  title: string;
  variant?: AppButtonVariant;
  helperText?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({ title, variant = 'primary', helperText, disabled, style, ...props }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !disabled ? styles.pressed : undefined,
        disabled ? styles.disabled : undefined,
        style,
      ]}
      {...props}
    >
      <AppText
        variant="label"
        colour={variant === 'primary' ? theme.colours.riverNight : theme.colours.parchment}
      >
        {title}
      </AppText>
      {helperText ? (
        <AppText
          variant="caption"
          colour={variant === 'primary' ? theme.colours.ink : theme.colours.mist}
        >
          {helperText}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    gap: theme.spacing.xs,
    minHeight: 52,
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  primary: {
    backgroundColor: theme.colours.gold,
  },
  secondary: {
    backgroundColor: theme.colours.riverSurface,
    borderWidth: 1,
    borderColor: theme.colours.bronze,
  },
  quiet: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#365241',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ translateY: 1 }],
  },
  disabled: {
    opacity: 0.48,
  },
});
