import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FirebaseConnectionStatusPanel } from '@/src/components/game/FirebaseConnectionStatusPanel';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import {
  checkFirebaseAppInitialisation,
  getFirebaseConnectionStatus,
  type FirebaseAppInitialisationCheck,
} from '@/src/services/firebase/firebaseConnectionStatus';

export function FirebaseConnectionStatusPreviewScreen() {
  const [appInitialisationCheck, setAppInitialisationCheck] = useState<FirebaseAppInitialisationCheck>();
  const status = getFirebaseConnectionStatus(appInitialisationCheck);

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Developer preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Firebase Connection Status Preview
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Check whether local Firebase configuration appears present while keeping DRIVE mock backed and disconnected
          from live product data.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          This route does not test Firestore data, Storage upload, auth sign-in, protected routes, or repository provider
          switching.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Local Firebase app check</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Pressing this button safely attempts Firebase app initialisation through the service boundary. It does not sign
          in, read Firestore, write Firestore, initialise Storage upload, submit PM5 evidence, or change provider mode.
        </AppText>
        <AppButton
          title="Check Firebase app initialisation"
          variant="primary"
          helperText="Runs only this local app initialisation check"
          onPress={() => {
            setAppInitialisationCheck(checkFirebaseAppInitialisation());
          }}
        />
      </Card>

      <FirebaseConnectionStatusPanel status={status} />

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Preview boundary
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          The app remains mock backed by default. This screen reports configuration and the Firebase app boundary only;
          it is not proof that product screens are connected to live Firebase data.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Future agents must not infer public signup, account creation, route protection, Firestore access, Storage
          upload, real PM5 submission, coach approve or reject actions, reward calculation, or progress writes from this
          preview.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
});
