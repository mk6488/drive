import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';

type StatusTone = 'bronze' | 'pending' | 'success' | 'neutral';

type StatusPillProps = {
  label: string;
  tone?: StatusTone;
};

export function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  return (
    <View style={[styles.pill, styles[tone]]}>
      <AppText variant="caption" colour={tone === 'neutral' ? theme.colours.mist : theme.colours.ink}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.round,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  bronze: {
    backgroundColor: theme.colours.bronze,
  },
  pending: {
    backgroundColor: theme.colours.parchmentDeep,
  },
  success: {
    backgroundColor: theme.colours.success,
  },
  neutral: {
    backgroundColor: theme.colours.riverSurface,
    borderWidth: 1,
    borderColor: '#365241',
  },
});
