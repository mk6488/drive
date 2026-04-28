import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';

const responsibilities = [
  'Set weekly erg quests for the squad.',
  'Review PM5 submissions and athlete reflections.',
  'Verify or reject evidence with practical coaching notes.',
  'Watch squad progress once verified effort is connected.',
];

export function CoachHomePlaceholderScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Coach preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Coach Launch
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          A static home for the future coach role, focused on trusted training oversight.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Future responsibilities</AppText>
        <View style={styles.list}>
          {responsibilities.map((item) => (
            <View key={item} style={styles.listItem}>
              <View style={styles.bullet} />
              <AppText variant="body" colour={theme.colours.mutedInk} style={styles.listText}>
                {item}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <GamePanel title="Submission Review" eyebrow="Verification gate" status="Future">
        <AppText variant="body" colour={theme.colours.mist}>
          PM5 evidence review, respectful rejection reasons, and verification actions will be added in a
          later approved step. This screen does not verify anything yet.
        </AppText>
      </GamePanel>

      <GamePanel title="Squad Progress" eyebrow="Shared winter block" status="Future">
        <AppText variant="body" colour={theme.colours.mist}>
          Squad missions, River Map movement, and Boathouse progress remain deliberately inactive until
          verified training effort can drive them.
        </AppText>
      </GamePanel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
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
