import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import {
  ExecutionFocusSelector,
  type ExecutionFocusOption,
} from '@/src/components/game/ExecutionFocusSelector';
import { QuestBuilderPreviewCard } from '@/src/components/game/QuestBuilderPreviewCard';
import { QuestQualityTargetPanel } from '@/src/components/game/QuestQualityTargetPanel';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import { getRewardFocusSummaryForSignal, toRewardSignal } from '@/src/services/rewards/rewardRules';
import type { ExecutionFocus, QuestSessionType } from '@/src/types/quest';

const sessionTypeOptions: readonly { value: QuestSessionType; label: string }[] = [
  { value: 'steady-state', label: 'Steady state' },
  { value: 'intervals', label: 'Intervals' },
  { value: 'rate-cap', label: 'Rate cap' },
  { value: 'power', label: 'Power' },
  { value: 'recovery', label: 'Recovery' },
];

const executionFocusOptions: readonly ExecutionFocusOption[] = [
  {
    value: 'pacing-discipline',
    label: 'Pacing discipline',
    description: 'Hold the prescribed effort band instead of chasing one split.',
  },
  {
    value: 'rate-control',
    label: 'Rate control',
    description: 'Respect stroke-rate limits and keep technical rhythm under control.',
  },
  {
    value: 'consistency',
    label: 'Consistency',
    description: 'Repeat controlled output across the whole session.',
  },
  {
    value: 'recovery-discipline',
    label: 'Recovery discipline',
    description: 'Use recovery exactly as set so the training stimulus stays honest.',
  },
  {
    value: 'reflection-quality',
    label: 'Reflection quality',
    description: 'Ask for a short reflection that helps the coach understand execution.',
  },
  {
    value: 'honest-effort',
    label: 'Honest effort',
    description: 'Value truthful evidence, realistic targets, and owning the session.',
  },
];

export function CoachQuestBuilderShellScreen() {
  const [questTitle, setQuestTitle] = useState('Week 3 Rate Control Builder');
  const [sessionType, setSessionType] = useState<QuestSessionType>('rate-cap');
  const [durationOrDistance, setDurationOrDistance] = useState('3 x 12 minutes');
  const [targetRate, setTargetRate] = useState('Rate 20-22');
  const [targetPaceOrEffort, setTargetPaceOrEffort] = useState(
    'Controlled aerobic pressure. Keep every rep within the same effort band.',
  );
  const [executionFocus, setExecutionFocus] = useState<ExecutionFocus>('rate-control');
  const [reflectionPrompt, setReflectionPrompt] = useState(
    'What was hardest to control: rate, pace, or consistency?',
  );

  const selectedSessionLabel = useMemo(
    () => sessionTypeOptions.find((option) => option.value === sessionType)?.label ?? 'Session',
    [sessionType],
  );
  const selectedFocusOption = useMemo(
    () => executionFocusOptions.find((option) => option.value === executionFocus) ?? executionFocusOptions[0],
    [executionFocus],
  );
  const selectedFocusSummary = useMemo(
    () => getRewardFocusSummaryForSignal(toRewardSignal(executionFocus)),
    [executionFocus],
  );

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Coach preview shell" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Quest Builder
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Shape a weekly erg quest around training quality before real quest creation exists. This screen uses local
          draft state only and cannot save.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Draft quest inputs</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Set targets that coach execution quality: pacing discipline, rate control, consistency, recovery discipline,
          reflection quality, and honest effort.
        </AppText>

        <DraftInput label="Quest title" value={questTitle} onChangeText={setQuestTitle} />

        <View style={styles.fieldGroup}>
          <AppText variant="label">Session type</AppText>
          <View style={styles.optionRow}>
            {sessionTypeOptions.map((option) => {
              const isSelected = option.value === sessionType;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    setSessionType(option.value);
                  }}
                  style={({ pressed }) => [
                    styles.sessionOption,
                    isSelected ? styles.selectedSessionOption : undefined,
                    pressed ? styles.pressedOption : undefined,
                  ]}
                >
                  <AppText
                    variant="caption"
                    colour={isSelected ? theme.colours.parchment : theme.colours.ink}
                  >
                    {option.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <DraftInput label="Duration or distance" value={durationOrDistance} onChangeText={setDurationOrDistance} />
        <DraftInput label="Target rate" value={targetRate} onChangeText={setTargetRate} />
        <DraftInput
          label="Target pace or effort guidance"
          value={targetPaceOrEffort}
          onChangeText={setTargetPaceOrEffort}
          multiline
        />

        <View style={styles.fieldGroup}>
          <AppText variant="label">Execution focus</AppText>
          <ExecutionFocusSelector
            options={executionFocusOptions}
            selectedFocus={executionFocus}
            onSelectFocus={setExecutionFocus}
          />
        </View>

        <DraftInput
          label="Reflection prompt"
          value={reflectionPrompt}
          onChangeText={setReflectionPrompt}
          multiline
        />
      </Card>

      <QuestQualityTargetPanel
        focusLabel={selectedFocusOption.label}
        focusSummary={selectedFocusSummary}
      />

      <QuestBuilderPreviewCard
        title={questTitle}
        sessionTypeLabel={selectedSessionLabel}
        durationOrDistance={durationOrDistance}
        targetRate={targetRate}
        targetPaceOrEffort={targetPaceOrEffort}
        executionFocusLabel={selectedFocusOption.label}
        reflectionPrompt={reflectionPrompt}
      />

      <Card>
        <AppText variant="subtitle">Safeguarding boundaries</AppText>
        <View style={styles.copyList}>
          {safeguardingCopy.map((item) => (
            <View key={item} style={styles.copyRow}>
              <View style={styles.bullet} />
              <AppText variant="body" colour={theme.colours.mutedInk} style={styles.copyText}>
                {item}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Saving is not implemented
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          This shell does not create quests, write repositories, mutate mock data, calculate rewards, unlock badges, or
          update athlete progress.
        </AppText>
        <AppButton
          title="Save quest unavailable"
          variant="secondary"
          disabled
          helperText="Preview only. Future real saves need approved repository and trusted workflow work."
        />
      </Card>
    </Screen>
  );
}

type DraftInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
};

function DraftInput({ label, value, onChangeText, multiline = false }: DraftInputProps) {
  return (
    <View style={styles.fieldGroup}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder="Draft preview text"
        placeholderTextColor={theme.colours.mutedInk}
        style={[styles.input, multiline ? styles.multilineInput : undefined]}
      />
    </View>
  );
}

const safeguardingCopy = [
  'Coaches should set quality targets, not pressure athletes into reckless scores.',
  'Quests should not encourage training through pain, illness, injury, or exhaustion.',
  'Reflections should stay short, practical, and training focused.',
  'Rewards remain coach verified and future trusted processing only.',
  'Quest creation does not include public rankings, direct messaging, or public sharing.',
];

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
  fieldGroup: {
    gap: theme.spacing.sm,
  },
  input: {
    minHeight: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.parchmentDeep,
    backgroundColor: theme.colours.white,
    color: theme.colours.ink,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.text.body,
  },
  multilineInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  sessionOption: {
    borderRadius: theme.radius.round,
    borderWidth: 1,
    borderColor: theme.colours.parchmentDeep,
    backgroundColor: theme.colours.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  selectedSessionOption: {
    borderColor: theme.colours.gold,
    backgroundColor: theme.colours.riverSurface,
  },
  pressedOption: {
    opacity: 0.82,
  },
  copyList: {
    gap: theme.spacing.md,
  },
  copyRow: {
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
  copyText: {
    flex: 1,
  },
});
