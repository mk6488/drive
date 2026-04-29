import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import {
  getClaimReadinessMessage,
  validateDriveAuthClaims,
  type DriveAuthClaimField,
  type DriveAuthClaimValidationResult,
} from '@/src/services/auth/authClaims';
import type { AuthSession } from '@/src/services/auth/authTypes';

type AuthClaimsDiagnosticPanelProps = {
  session: AuthSession;
};

function getSessionValidation(session: AuthSession): DriveAuthClaimValidationResult {
  if (session.status === 'incomplete') {
    return session.claimValidation;
  }

  if (session.status === 'authenticated') {
    return validateDriveAuthClaims({
      role: session.user.role === 'admin' ? 'adminFuture' : session.user.role,
      clubId: session.user.clubId,
      squadIds: session.user.squadIds,
      linkedAthleteId: session.user.role === 'athlete' ? session.user.linkedAthleteId : undefined,
      displayName: session.user.displayName,
    });
  }

  return validateDriveAuthClaims({});
}

function formatBoolean(value: boolean) {
  return value ? 'Yes' : 'No';
}

function formatFieldName(field: DriveAuthClaimField) {
  switch (field) {
    case 'role':
      return 'Role claim';
    case 'clubId':
      return 'Club scope claim';
    case 'squadIds':
      return 'Squad scope claim';
    case 'linkedAthleteId':
      return 'Linked athlete claim';
    case 'displayName':
      return 'Display name claim';
    default:
      return field;
  }
}

function DiagnosticRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText variant="caption" colour={theme.colours.mutedInk} style={styles.rowLabel}>
        {label}
      </AppText>
      <AppText variant="body" colour={theme.colours.ink} style={styles.rowValue}>
        {value}
      </AppText>
    </View>
  );
}

export function AuthClaimsDiagnosticPanel({ session }: AuthClaimsDiagnosticPanelProps) {
  const validation = getSessionValidation(session);
  const isSignedIn = session.status !== 'unauthenticated';
  const missingOrInvalidFields = Array.from(new Set([...validation.missingFields, ...validation.invalidFields]));
  const hasMissingOrInvalidFields = missingOrInvalidFields.length > 0;

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Auth claims diagnostic
          </AppText>
          <AppText variant="subtitle">DRIVE role claim readiness</AppText>
        </View>
        <StatusPill
          label={validation.canGrantAccess ? 'Claims appear complete' : 'Account not ready'}
          tone={validation.canGrantAccess ? 'success' : 'attention'}
        />
      </View>

      <AppText variant="body" colour={theme.colours.mutedInk}>
        {getClaimReadinessMessage(validation)}
      </AppText>

      <View style={styles.statusList}>
        <DiagnosticRow label="Firebase Auth signed in" value={formatBoolean(isSignedIn)} />
        <DiagnosticRow label="DRIVE role claims appear present" value={formatBoolean(validation.claimsPresent)} />
        <DiagnosticRow label="Claim role" value={validation.role ?? 'None recognised'} />
        <DiagnosticRow
          label="Complete enough for future athlete access"
          value={formatBoolean(validation.canGrantAthleteAccess)}
        />
        <DiagnosticRow label="Complete enough for future coach access" value={formatBoolean(validation.canGrantCoachAccess)} />
      </View>

      <View style={styles.notice}>
        <AppText variant="label">What is missing or invalid</AppText>
        {hasMissingOrInvalidFields ? (
          <View style={styles.fieldList}>
            {missingOrInvalidFields.map((field) => (
              <AppText key={field} variant="caption" colour={theme.colours.mutedInk}>
                {formatFieldName(field)}
              </AppText>
            ))}
          </View>
        ) : (
          <AppText variant="body" colour={theme.colours.mutedInk}>
            No missing required athlete or coach claim fields were reported by this diagnostic.
          </AppText>
        )}
      </View>

      <View style={styles.notice}>
        <AppText variant="label">Trusted assignment boundary</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          DRIVE role claims must be assigned later by a trusted admin process outside this client app. This app does not
          assign claims, create accounts, set custom claims, or grant access when claims are missing.
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
  row: {
    gap: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colours.parchmentDeep,
    paddingTop: theme.spacing.sm,
  },
  rowLabel: {
    textTransform: 'uppercase',
  },
  rowValue: {
    fontWeight: '800',
  },
  notice: {
    gap: theme.spacing.sm,
  },
  fieldList: {
    gap: theme.spacing.xs,
  },
});
