import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';

type GamePanelProps = {
  title: string;
  eyebrow?: string;
  status?: string;
  children: ReactNode;
};

export function GamePanel({ title, eyebrow, status, children }: GamePanelProps) {
  return (
    <Card tone="river">
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          {eyebrow ? (
            <AppText variant="eyebrow" colour={theme.colours.gold}>
              {eyebrow}
            </AppText>
          ) : null}
          <AppText variant="subtitle" colour={theme.colours.parchment}>
            {title}
          </AppText>
        </View>
        {status ? <StatusPill label={status} tone="pending" /> : null}
      </View>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
  },
  titleGroup: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
