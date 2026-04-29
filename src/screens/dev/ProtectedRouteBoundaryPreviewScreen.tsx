import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ProtectedRouteBoundary } from '@/src/components/auth/ProtectedRouteBoundary';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type { DriveAppArea } from '@/src/services/auth/routeAccess';

type ProtectedAreaOption = Extract<DriveAppArea, 'athlete' | 'coach' | 'adminFuture'>;

const areaOptions: readonly {
  key: ProtectedAreaOption;
  title: string;
  helperText: string;
}[] = [
  {
    key: 'athlete',
    title: 'Athlete',
    helperText: 'Future own-athlete route boundary',
  },
  {
    key: 'coach',
    title: 'Coach',
    helperText: 'Future club and squad-scoped route boundary',
  },
  {
    key: 'adminFuture',
    title: 'Admin future',
    helperText: 'Planning only, not a bypass',
  },
];

export function ProtectedRouteBoundaryPreviewScreen() {
  const [selectedArea, setSelectedArea] = useState<ProtectedAreaOption>('athlete');

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Developer preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Protected Route Boundary Preview
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Review the reusable protected route component foundation without enabling protected routes, redirects, route
          hiding, Firestore profile lookup, or repository provider switching.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          This screen uses local React state to switch target areas only. It does not create accounts, upload PM5
          evidence, submit work, approve or reject submissions, calculate rewards, or write progress.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Choose target area</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          The boundary receives one target area at a time and keeps sample child content visible because route protection
          is still deliberately disabled.
        </AppText>
        <View style={styles.optionGrid}>
          {areaOptions.map((option) => (
            <AppButton
              key={option.key}
              title={option.title}
              variant={option.key === selectedArea ? 'primary' : 'secondary'}
              helperText={option.helperText}
              onPress={() => {
                setSelectedArea(option.key);
              }}
              style={styles.optionButton}
            />
          ))}
        </View>
      </Card>

      <ProtectedRouteBoundary
        area={selectedArea}
        targetAthleteId="athlete-example-001"
        targetClubId="club-example-001"
        targetSquadId="squad-example-juniors"
      >
        <Card tone="river">
          <AppText variant="subtitle" colour={theme.colours.parchment}>
            Sample child content stays visible
          </AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            In a later approved step this boundary can become the UI wrapper for real protected areas. For Step 25, it
            only shows the route access status so the team can review safeguarding copy and role-aware decisions before
            enforcement.
          </AppText>
          <AppText variant="caption" colour={theme.colours.parchmentMuted}>
            Existing athlete and coach routes are not wrapped yet, and preview routes remain available.
          </AppText>
        </Card>
      </ProtectedRouteBoundary>

      <Card>
        <AppText variant="subtitle">Foundation only</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Future agents must not infer that this preview enables route protection. There are still no protected routes,
          auth redirects, Firestore reads or writes, real PM5 upload actions, reward writes, or admin features.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
  optionGrid: {
    gap: theme.spacing.md,
  },
  optionButton: {
    width: '100%',
  },
});
