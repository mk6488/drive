import { StyleSheet, View } from 'react-native';

import { AttributeChip } from '@/src/components/game/AttributeChip';
import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';

const attributes = [
  {
    name: 'Engine',
    description: 'Aerobic and power development shown through appropriate effort.',
  },
  {
    name: 'Discipline',
    description: 'Pacing discipline, completion, and honest training habits.',
  },
  {
    name: 'Rhythm',
    description: 'Rate control, consistency, and repeatable movement.',
  },
  {
    name: 'Grit',
    description: 'Perseverance, reflection, and commitment across the block.',
  },
];

export function AthleteHomePlaceholderScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Athlete preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          River Watch
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          A static glimpse of the athlete home, ready for coach-set quests later.
        </AppText>
      </View>

      <GamePanel title="Today's Quest" eyebrow="Coach-set session" status="Not active">
        <AppText variant="body" colour={theme.colours.mist}>
          Future quests will show the erg session, target rate, pacing focus, and what good execution
          means before any upload is submitted.
        </AppText>
      </GamePanel>

      <Card>
        <AppText variant="subtitle">Attributes</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          These are display placeholders only. No attribute values or rewards are calculated here.
        </AppText>
        <View style={styles.attributeGrid}>
          {attributes.map((attribute) => (
            <AttributeChip key={attribute.name} name={attribute.name} description={attribute.description} />
          ))}
        </View>
      </Card>

      <GamePanel title="PM5 Evidence Bay" eyebrow="Upload area" status="Future">
        <View style={styles.uploadBox}>
          <AppText variant="label" colour={theme.colours.parchment}>
            PM5 photo upload will live here.
          </AppText>
          <AppText variant="caption" colour={theme.colours.mist}>
            No upload, OCR, automatic analysis, or reward calculation is implemented in this preview.
          </AppText>
        </View>
      </GamePanel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
  attributeGrid: {
    gap: theme.spacing.md,
  },
  uploadBox: {
    gap: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colours.bronze,
    backgroundColor: theme.colours.riverDeep,
    padding: theme.spacing.lg,
  },
});
