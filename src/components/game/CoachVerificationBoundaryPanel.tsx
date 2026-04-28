import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { theme } from '@/src/constants/theme';

const safeguardingPoints = [
  'PM5 photos are private training evidence for coach-led review.',
  'Reflections are for training review only and should stay practical.',
  'Coach notes should be practical, respectful, and training focused.',
  'Do not encourage training through pain, illness, injury, or exhaustion.',
  'No public athlete rankings or public profiles are part of this shell.',
];

export function CoachVerificationBoundaryPanel() {
  return (
    <Card>
      <AppText variant="subtitle">Verification and safeguarding boundaries</AppText>
      <View style={styles.list}>
        {safeguardingPoints.map((item) => (
          <View key={item} style={styles.listItem}>
            <View style={styles.bullet} />
            <AppText variant="body" colour={theme.colours.mutedInk} style={styles.listText}>
              {item}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="caption" colour={theme.colours.mutedInk}>
        This queue is a preview shell only. Real approve or reject actions are intentionally disabled.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  bullet: {
    width: 8,
    height: 8,
    marginTop: 8,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colours.bronze,
  },
  listText: {
    flex: 1,
  },
});
