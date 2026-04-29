import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RoleGatePreviewPanel } from '@/src/components/game/RoleGatePreviewPanel';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import {
  exampleAdminFutureSession,
  exampleAthleteSession,
  exampleCoachSession,
  unauthenticatedPreviewSession,
} from '@/src/services/auth/mockAuthSession';
import {
  getRouteAccessDecision,
  type DriveAppArea,
} from '@/src/services/auth/routeAccess';

type PreviewSessionKey = 'unauthenticated' | 'athlete' | 'coach' | 'adminFuture';

const sessionOptions: readonly {
  key: PreviewSessionKey;
  title: string;
  helperText: string;
}[] = [
  {
    key: 'unauthenticated',
    title: 'Unauthenticated',
    helperText: 'No DRIVE role claims',
  },
  {
    key: 'athlete',
    title: 'Athlete',
    helperText: 'Linked athlete and squad claims',
  },
  {
    key: 'coach',
    title: 'Coach',
    helperText: 'Club and squad-scoped claims',
  },
  {
    key: 'adminFuture',
    title: 'Admin future',
    helperText: 'Planning role, not a bypass',
  },
];

const areaOptions: readonly {
  key: DriveAppArea;
  title: string;
  helperText: string;
}[] = [
  {
    key: 'public',
    title: 'Public',
    helperText: 'Preview stays open',
  },
  {
    key: 'athlete',
    title: 'Athlete',
    helperText: 'Future protected athlete area',
  },
  {
    key: 'coach',
    title: 'Coach',
    helperText: 'Future protected coach area',
  },
  {
    key: 'dev',
    title: 'Dev',
    helperText: 'Preview stays open',
  },
  {
    key: 'adminFuture',
    title: 'Admin future',
    helperText: 'Not enabled as broad access',
  },
];

function getPreviewSession(key: PreviewSessionKey) {
  switch (key) {
    case 'athlete':
      return exampleAthleteSession;
    case 'coach':
      return exampleCoachSession;
    case 'adminFuture':
      return exampleAdminFutureSession;
    case 'unauthenticated':
    default:
      return unauthenticatedPreviewSession;
  }
}

export function RoleAccessPreviewScreen() {
  const [selectedSessionKey, setSelectedSessionKey] = useState<PreviewSessionKey>('unauthenticated');
  const [selectedArea, setSelectedArea] = useState<DriveAppArea>('public');
  const selectedSession = getPreviewSession(selectedSessionKey);
  const decision = useMemo(
    () =>
      getRouteAccessDecision(selectedSession, selectedArea, {
        targetAthleteId: 'athlete-example-001',
        targetClubId: 'club-example-001',
        targetSquadId: 'squad-example-juniors',
      }),
    [selectedArea, selectedSession],
  );

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Developer preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Role Access Preview
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Inspect the future role gate decisions for DRIVE without enabling protected routes, redirects, Firestore
          reads, or route hiding.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Local React state selects static example sessions and app areas only. This preview does not create accounts,
          sign users up, switch repository providers, upload PM5 evidence, or perform real actions.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Choose example session</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          These sessions are static previews of future DRIVE role claims. Missing or incomplete claims must not grant
          protected access.
        </AppText>
        <View style={styles.optionGrid}>
          {sessionOptions.map((option) => (
            <AppButton
              key={option.key}
              title={option.title}
              variant={option.key === selectedSessionKey ? 'primary' : 'secondary'}
              helperText={option.helperText}
              onPress={() => {
                setSelectedSessionKey(option.key);
              }}
              style={styles.optionButton}
            />
          ))}
        </View>
      </Card>

      <Card>
        <AppText variant="subtitle">Choose target area</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Public and developer preview routes remain available. Athlete, coach, and future admin choices describe
          intended route access only.
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

      <RoleGatePreviewPanel session={selectedSession} area={selectedArea} decision={decision} />

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Preview boundary
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          This route exists so access rules can be reviewed before real route protection exists. Future agents must not
          infer that protected navigation, account creation, Firestore profile reads, repository provider switching, or
          admin functionality has been approved.
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
