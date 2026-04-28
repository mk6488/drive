import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import {
  getQuestTemplateCategoryLabel,
  getQuestTemplateIntensityLabel,
  type QuestTemplate,
} from '@/src/services/quests/questTemplates';

type QuestTemplateCardProps = {
  template: QuestTemplate;
  isSelected?: boolean;
  onSelectTemplate?: (template: QuestTemplate) => void;
};

export function QuestTemplateCard({
  template,
  isSelected = false,
  onSelectTemplate,
}: QuestTemplateCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={() => {
        onSelectTemplate?.(template);
      }}
      style={({ pressed }) => [
        styles.card,
        isSelected ? styles.selectedCard : undefined,
        pressed ? styles.pressedCard : undefined,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="subtitle">{template.title}</AppText>
          <AppText variant="body" colour={theme.colours.mutedInk}>
            {template.shortDescription}
          </AppText>
        </View>
        <StatusPill
          label={getQuestTemplateIntensityLabel(template.intensity)}
          tone={template.intensity === 'recovery' ? 'success' : 'bronze'}
        />
      </View>

      <View style={styles.metaRow}>
        <TemplateMeta label="Category" value={getQuestTemplateCategoryLabel(template.category)} />
        <TemplateMeta label="Execution focus" value={getQuestTemplateCategoryLabel(template.executionFocus)} />
      </View>

      <View style={styles.focusBox}>
        <AppText variant="label">Coaching purpose</AppText>
        <AppText variant="caption" colour={theme.colours.mutedInk}>
          {template.coachingPurpose}
        </AppText>
      </View>
    </Pressable>
  );
}

function TemplateMeta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <AppText variant="caption" colour={theme.colours.mutedInk}>
        {label}
      </AppText>
      <AppText variant="label">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colours.parchmentDeep,
    backgroundColor: theme.colours.white,
    padding: theme.spacing.lg,
  },
  selectedCard: {
    borderColor: theme.colours.gold,
    backgroundColor: '#FFF3D8',
  },
  pressedCard: {
    opacity: 0.84,
  },
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
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  metaItem: {
    minWidth: 140,
    flex: 1,
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.parchment,
    padding: theme.spacing.md,
  },
  focusBox: {
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.parchmentDeep,
    padding: theme.spacing.md,
  },
});
