import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';

type FirebaseAppInitialisationCheckStatus = {
  hasRun: boolean;
  passed: boolean;
  message: string;
};

type FirebaseConnectionPanelStatus = {
  firebaseConfigComplete: boolean;
  missingFirebaseConfigKeys: string[];
  firebaseAppInitialisationCheck: FirebaseAppInitialisationCheckStatus;
  requestedRepositoryProviderMode: 'mock' | 'firebase';
  activeRepositoryProviderMode: 'mock' | 'firebase';
  repositoryProviderIsMockBacked: boolean;
  firebaseModeEnabledByDefault: boolean;
  firestoreReadsTested: boolean;
  firestoreWritesTested: boolean;
  storageUploadTested: boolean;
  authSignInTested: boolean;
};

type FirebaseConnectionStatusPanelProps = {
  status: FirebaseConnectionPanelStatus;
};

function formatBoolean(value: boolean) {
  return value ? 'Yes' : 'No';
}

function formatProviderMode(mode: 'mock' | 'firebase') {
  return mode === 'firebase' ? 'Firebase' : 'Mock';
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statusRow}>
      <AppText variant="caption" colour={theme.colours.mutedInk} style={styles.statusLabel}>
        {label}
      </AppText>
      <AppText variant="body" colour={theme.colours.ink} style={styles.statusValue}>
        {value}
      </AppText>
    </View>
  );
}

export function FirebaseConnectionStatusPanel({ status }: FirebaseConnectionStatusPanelProps) {
  const hasMissingConfigKeys = status.missingFirebaseConfigKeys.length > 0;
  const appCheckLabel = status.firebaseAppInitialisationCheck.hasRun
    ? formatBoolean(status.firebaseAppInitialisationCheck.passed)
    : 'Not checked';

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Firebase boundary
          </AppText>
          <AppText variant="subtitle">Connection status preview</AppText>
        </View>
        <StatusPill
          label={status.repositoryProviderIsMockBacked ? 'Mock backed' : 'Firebase mode requested'}
          tone={status.repositoryProviderIsMockBacked ? 'success' : 'attention'}
        />
      </View>

      <View style={styles.statusList}>
        <StatusRow label="Firebase config appears complete" value={formatBoolean(status.firebaseConfigComplete)} />
        <StatusRow label="Firebase app initialisation check passed" value={appCheckLabel} />
        <StatusRow
          label="Requested repository provider"
          value={formatProviderMode(status.requestedRepositoryProviderMode)}
        />
        <StatusRow label="Active repository provider" value={formatProviderMode(status.activeRepositoryProviderMode)} />
        <StatusRow label="Repository provider still mock backed" value={formatBoolean(status.repositoryProviderIsMockBacked)} />
        <StatusRow label="Firebase mode enabled by default" value={formatBoolean(status.firebaseModeEnabledByDefault)} />
      </View>

      <View style={styles.notice}>
        <AppText variant="label">App initialisation check</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          {status.firebaseAppInitialisationCheck.message}
        </AppText>
      </View>

      <View style={styles.missingConfig}>
        <AppText variant="label">Missing Firebase config keys</AppText>
        {hasMissingConfigKeys ? (
          <View style={styles.keyList}>
            {status.missingFirebaseConfigKeys.map((key) => (
              <AppText key={key} variant="caption" colour={theme.colours.mutedInk}>
                {key}
              </AppText>
            ))}
          </View>
        ) : (
          <AppText variant="body" colour={theme.colours.mutedInk}>
            None reported.
          </AppText>
        )}
      </View>

      <View style={styles.warningList}>
        <AppText variant="label">Not tested by this preview</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Firestore reads: {formatBoolean(status.firestoreReadsTested)}
        </AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Firestore writes: {formatBoolean(status.firestoreWritesTested)}
        </AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Storage upload: {formatBoolean(status.storageUploadTested)}
        </AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Auth sign-in: {formatBoolean(status.authSignInTested)}
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
  statusList: {
    gap: theme.spacing.sm,
  },
  statusRow: {
    gap: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colours.parchmentDeep,
    paddingTop: theme.spacing.sm,
  },
  statusLabel: {
    textTransform: 'uppercase',
  },
  statusValue: {
    fontWeight: '800',
  },
  notice: {
    gap: theme.spacing.xs,
  },
  missingConfig: {
    gap: theme.spacing.sm,
  },
  keyList: {
    gap: theme.spacing.xs,
  },
  warningList: {
    gap: theme.spacing.xs,
  },
});
