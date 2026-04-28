import { StyleSheet, View } from 'react-native';

import { QuestTemplateCard } from '@/src/components/game/QuestTemplateCard';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type { QuestTemplate } from '@/src/services/quests/questTemplates';

type QuestTemplatePickerProps = {
  templates: readonly QuestTemplate[];
  selectedTemplateId?: string;
  onSelectTemplate: (template: QuestTemplate) => void;
};

export function QuestTemplatePicker({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: QuestTemplatePickerProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <StatusPill label="Local drafting shortcuts" tone="attention" />
          <AppText variant="subtitle">Quest template catalogue</AppText>
        </View>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Templates are starting points for coach judgement. Selecting one only fills this local draft and does not
          create, save, or assign a quest.
        </AppText>
      </View>

      <View style={styles.templateList}>
        {templates.map((template) => (
          <QuestTemplateCard
            key={template.id}
            template={template}
            isSelected={template.id === selectedTemplateId}
            onSelectTemplate={onSelectTemplate}
          />
        ))}
      </View>

      <AppText variant="caption" colour={theme.colours.mutedInk}>
        Coaches must adapt every template to athlete readiness. Quests should not encourage training through pain,
        illness, injury, or exhaustion. Rewards remain future trusted processing only after coach verification.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.sm,
  },
  titleGroup: {
    gap: theme.spacing.sm,
  },
  templateList: {
    gap: theme.spacing.md,
  },
});
