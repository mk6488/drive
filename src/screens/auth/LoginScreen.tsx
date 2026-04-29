import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { AuthSessionStatusPanel } from '@/src/components/game/AuthSessionStatusPanel';
import { theme } from '@/src/constants/theme';
import { getDriveAuthErrorMessage, incompleteDriveAccessMessage } from '@/src/services/auth/authErrors';
import { signInWithEmailAndPasswordForDrive } from '@/src/services/auth/authService';
import { useDriveAuth } from '@/src/services/auth/AuthProvider';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session, isLoading, authErrorMessage, signOut } = useDriveAuth();

  async function handleSignIn() {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const nextSession = await signInWithEmailAndPasswordForDrive(email, password);

      if (nextSession.status !== 'authenticated') {
        setErrorMessage(incompleteDriveAccessMessage);
      }
    } catch (error) {
      setErrorMessage(getDriveAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signOut();
    } catch (error) {
      setErrorMessage(getDriveAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen centred>
      <View style={styles.hero}>
        <StatusPill label="Auth foundation" tone="bronze" />
        <AppText variant="eyebrow" colour={theme.colours.gold}>
          DRIVE sign in foundation
        </AppText>
        <AppText variant="title" colour={theme.colours.parchment}>
          Controlled Firebase Auth shell
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          This screen checks the service boundary for future DRIVE access. Role-based routing is not enabled yet, and
          preview routes still remain available.
        </AppText>
      </View>

      <AuthSessionStatusPanel session={session} isLoading={isLoading} authErrorMessage={authErrorMessage} />

      <Card>
        {session.status === 'authenticated' ? (
          <View style={styles.stack}>
            <AppText variant="subtitle">Signed-in preview</AppText>
            <AppText variant="body" colour={theme.colours.mutedInk}>
              {session.user.displayName} is signed in as {session.user.role}. DRIVE has not enabled protected athlete
              or coach routing yet.
            </AppText>
            <AppText variant="caption" colour={theme.colours.mutedInk}>
              Club and squad claims are recognised only as a foundation for future role boundaries.
            </AppText>
            <AppButton
              title="Sign out"
              variant="secondary"
              helperText="Clears this Firebase Auth session only"
              disabled={isSubmitting || isLoading}
              onPress={handleSignOut}
            />
          </View>
        ) : (
          <View style={styles.stack}>
            <AppText variant="subtitle">Sign in foundation</AppText>
            <AppText variant="body" colour={theme.colours.mutedInk}>
              Use an existing Firebase Auth user only. Public signup, account creation, password reset, protected
              navigation, and Firestore profile lookup are not part of this step.
            </AppText>

            <View style={styles.fieldGroup}>
              <AppText variant="label">Email</AppText>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="coach@example.com"
                placeholderTextColor={theme.colours.mutedInk}
                style={styles.input}
                textContentType="emailAddress"
                value={email}
              />
            </View>

            <View style={styles.fieldGroup}>
              <AppText variant="label">Password</AppText>
              <TextInput
                autoCapitalize="none"
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={theme.colours.mutedInk}
                secureTextEntry
                style={styles.input}
                textContentType="password"
                value={password}
              />
            </View>

            {errorMessage ? (
              <AppText variant="caption" colour={theme.colours.danger}>
                {errorMessage}
              </AppText>
            ) : null}

            <AppButton
              title={isSubmitting ? 'Checking sign in...' : 'Sign in'}
              helperText="Calls the DRIVE auth service only"
              disabled={isSubmitting || isLoading || email.trim().length === 0 || password.length === 0}
              onPress={handleSignIn}
            />
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: theme.spacing.md,
  },
  stack: {
    gap: theme.spacing.md,
  },
  fieldGroup: {
    gap: theme.spacing.sm,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.colours.parchmentDeep,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.white,
    color: theme.colours.ink,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.text.body,
  },
});
