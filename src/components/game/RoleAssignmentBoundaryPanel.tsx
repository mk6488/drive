import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';

type BoundaryItem = {
  title: string;
  body: string;
};

const boundaryItems: readonly BoundaryItem[] = [
  {
    title: 'Trusted assignment only',
    body: 'DRIVE role claims decide access to junior athlete training context and coach review surfaces, so they must come from a trusted server-side process later.',
  },
  {
    title: 'Future athlete claims',
    body: 'Athlete access will require a Firebase user id, athlete role, club scope, explicit squad scope, linked athlete id, and display name.',
  },
  {
    title: 'Future coach claims',
    body: 'Coach access will require a Firebase user id, coach role, club scope, explicit squad scope where possible, and display name.',
  },
  {
    title: 'Client app boundary',
    body: 'This app cannot assign claims, promote users, let coaches promote themselves, or decide role access without trusted claims.',
  },
];

export function RoleAssignmentBoundaryPanel() {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Trusted role assignment
          </AppText>
          <AppText variant="subtitle">Why claims must come from a trusted workflow</AppText>
        </View>
        <StatusPill label="Planning only" tone="attention" />
      </View>

      <AppText variant="body" colour={theme.colours.mutedInk}>
        Missing DRIVE role claims keep an account not ready because Firebase sign in alone is not enough to become an
        athlete or coach in a junior training product.
      </AppText>

      <View style={styles.itemList}>
        {boundaryItems.map((item) => (
          <View key={item.title} style={styles.item}>
            <AppText variant="label">{item.title}</AppText>
            <AppText variant="body" colour={theme.colours.mutedInk}>
              {item.body}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.notice}>
        <AppText variant="label">Current safe behaviour</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          A signed-in Firebase test user without complete DRIVE role claims should continue to see that the account is
          not ready for DRIVE access. That protects athlete privacy, coach authority, and future reward integrity.
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  titleGroup: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  itemList: {
    gap: theme.spacing.md,
  },
  item: {
    gap: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colours.parchmentDeep,
    paddingTop: theme.spacing.sm,
  },
  notice: {
    gap: theme.spacing.sm,
  },
});
