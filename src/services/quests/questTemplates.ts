import type { ExecutionFocus, QuestSessionType } from '@/src/types/quest';

export type QuestTemplateCategory =
  | 'pacing-discipline'
  | 'rate-control'
  | 'consistency'
  | 'recovery-discipline'
  | 'reflection-quality'
  | 'honest-effort';

export type QuestTemplateIntensity = 'recovery' | 'steady' | 'controlled' | 'challenging';

export type QuestTemplate = {
  id: string;
  title: string;
  shortDescription: string;
  category: QuestTemplateCategory;
  intensity: QuestTemplateIntensity;
  sessionType: QuestSessionType;
  durationOrDistance: string;
  targetRate: string;
  targetPaceOrEffort: string;
  executionFocus: ExecutionFocus;
  reflectionPrompt: string;
  coachingPurpose: string;
  safeguardingNote: string;
};

export type QuestTemplateDraft = {
  sourceTemplateId: string;
  title: string;
  sessionType: QuestSessionType;
  durationOrDistance: string;
  targetRate: string;
  targetPaceOrEffort: string;
  executionFocus: ExecutionFocus;
  reflectionPrompt: string;
  coachingPurpose: string;
  safeguardingNote: string;
};

const QUEST_TEMPLATES: readonly QuestTemplate[] = [
  {
    id: 'rate-20-control-builder',
    title: 'Rate 20 Control Builder',
    shortDescription: 'A rate-capped aerobic row for learning patient pressure and clean rhythm.',
    category: 'rate-control',
    intensity: 'controlled',
    sessionType: 'rate-cap',
    durationOrDistance: '3 x 10 minutes with easy paddle between reps',
    targetRate: 'Rate 20 throughout each working block',
    targetPaceOrEffort: 'Controlled aerobic pressure. Prioritise rhythm and repeatable splits over forcing speed.',
    executionFocus: 'rate-control',
    reflectionPrompt: 'Where did rate control feel easiest or hardest?',
    coachingPurpose: 'Builds discipline around stroke-rate restraint, relaxed pressure, and repeatable movement.',
    safeguardingNote: 'Adapt the volume and pressure to athlete readiness. Stop the session if pain, illness, or exhaustion appears.',
  },
  {
    id: 'hold-the-line-intervals',
    title: 'Hold The Line Intervals',
    shortDescription: 'Controlled intervals that reward staying close to the planned effort band.',
    category: 'pacing-discipline',
    intensity: 'challenging',
    sessionType: 'intervals',
    durationOrDistance: '6 x 3 minutes with equal recovery',
    targetRate: 'Rate 24-26 unless the coach adapts it',
    targetPaceOrEffort: 'Aim for a sustainable line from rep one to rep six, not one standout rep.',
    executionFocus: 'pacing-discipline',
    reflectionPrompt: 'Which rep best matched the plan, and why?',
    coachingPurpose: 'Teaches athletes to respect the session plan and avoid early overreaching.',
    safeguardingNote: 'This is a control session, not a test. Coaches should adjust targets for fatigue, illness, or return-to-training athletes.',
  },
  {
    id: 'recovery-discipline-row',
    title: 'Recovery Discipline Row',
    shortDescription: 'A low-pressure row where the win is keeping recovery genuinely easy.',
    category: 'recovery-discipline',
    intensity: 'recovery',
    sessionType: 'recovery',
    durationOrDistance: '20-30 minutes continuous',
    targetRate: 'Rate 18-20',
    targetPaceOrEffort: 'Light conversational effort. Keep the stroke loose, technical, and calm.',
    executionFocus: 'recovery-discipline',
    reflectionPrompt: 'How did you keep the row easy enough to recover?',
    coachingPurpose: 'Reinforces honest recovery work so harder sessions can be executed well later.',
    safeguardingNote: 'Do not turn recovery into a hidden test. Athletes should not train through pain, illness, or unusual exhaustion.',
  },
  {
    id: 'negative-split-builder',
    title: 'Negative Split Builder',
    shortDescription: 'A steady row that asks athletes to finish slightly stronger than they start.',
    category: 'pacing-discipline',
    intensity: 'controlled',
    sessionType: 'steady-state',
    durationOrDistance: '4 x 6 minutes or 24 minutes continuous',
    targetRate: 'Rate 20-22',
    targetPaceOrEffort: 'Start controlled, then nudge the effort forward only if technique and rhythm stay tidy.',
    executionFocus: 'pacing-discipline',
    reflectionPrompt: 'What helped you stay patient before lifting the effort?',
    coachingPurpose: 'Develops pacing discipline by making patience and controlled progression visible.',
    safeguardingNote: 'The lift should be modest and coach-led. It is not an all-out finish or a reason to ignore warning signs.',
  },
  {
    id: 'consistency-ladder',
    title: 'Consistency Ladder',
    shortDescription: 'A ladder session focused on matching rhythm as the block lengths change.',
    category: 'consistency',
    intensity: 'controlled',
    sessionType: 'intervals',
    durationOrDistance: '2-4-6-4-2 minutes with easy paddle recovery',
    targetRate: 'Rate 22-24',
    targetPaceOrEffort: 'Keep the effort smooth and repeatable as duration changes. Avoid spikes at the start of each step.',
    executionFocus: 'consistency',
    reflectionPrompt: 'Which step was most consistent, and what made it work?',
    coachingPurpose: 'Builds Rhythm and Engine by asking athletes to repeat quality under changing demands.',
    safeguardingNote: 'Coaches should scale steps, rates, or recoveries so the ladder supports learning rather than pressure.',
  },
  {
    id: 'honest-effort-check-in',
    title: 'Honest Effort Check In',
    shortDescription: 'A simple row for checking effort quality, evidence, and short reflection.',
    category: 'honest-effort',
    intensity: 'steady',
    sessionType: 'steady-state',
    durationOrDistance: '15-20 minutes continuous',
    targetRate: 'Coach-set comfortable rate, often 20-22',
    targetPaceOrEffort: 'Steady, honest effort that can be described clearly afterwards.',
    executionFocus: 'honest-effort',
    reflectionPrompt: 'Did your PM5 evidence and reflection match the session you actually rowed?',
    coachingPurpose: 'Supports truthful training habits and coachable reflection without chasing rankings.',
    safeguardingNote: 'Keep the check-in practical and private. Do not ask athletes to disclose sensitive personal information.',
  },
  {
    id: 'short-reflection-reset',
    title: 'Short Reflection Reset',
    shortDescription: 'A manageable technical row that keeps the reflection specific and useful.',
    category: 'reflection-quality',
    intensity: 'steady',
    sessionType: 'steady-state',
    durationOrDistance: '3 x 8 minutes technical steady row',
    targetRate: 'Rate 18-22',
    targetPaceOrEffort: 'Comfortable technical pressure with attention on one clear coaching cue.',
    executionFocus: 'reflection-quality',
    reflectionPrompt: 'Name one cue you used and whether it helped.',
    coachingPurpose: 'Improves coach-facing reflection by linking the row to one practical technical observation.',
    safeguardingNote: 'Reflection should stay short and training focused. It is not a wellbeing diary or a place for sensitive disclosure.',
  },
];

const categoryLabels: Record<QuestTemplateCategory, string> = {
  'pacing-discipline': 'Pacing discipline',
  'rate-control': 'Rate control',
  consistency: 'Consistency',
  'recovery-discipline': 'Recovery discipline',
  'reflection-quality': 'Reflection quality',
  'honest-effort': 'Honest effort',
};

const intensityLabels: Record<QuestTemplateIntensity, string> = {
  recovery: 'Recovery',
  steady: 'Steady',
  controlled: 'Controlled',
  challenging: 'Challenging',
};

function copyTemplate(template: QuestTemplate): QuestTemplate {
  return { ...template };
}

export function listQuestTemplates(): QuestTemplate[] {
  return QUEST_TEMPLATES.map(copyTemplate);
}

export function getQuestTemplateById(id: string): QuestTemplate | undefined {
  const template = QUEST_TEMPLATES.find((item) => item.id === id);

  return template ? copyTemplate(template) : undefined;
}

export function listQuestTemplatesByCategory(category: QuestTemplateCategory): QuestTemplate[] {
  return QUEST_TEMPLATES.filter((template) => template.category === category).map(copyTemplate);
}

export function createDraftFromTemplate(template: QuestTemplate): QuestTemplateDraft {
  return {
    sourceTemplateId: template.id,
    title: template.title,
    sessionType: template.sessionType,
    durationOrDistance: template.durationOrDistance,
    targetRate: template.targetRate,
    targetPaceOrEffort: template.targetPaceOrEffort,
    executionFocus: template.executionFocus,
    reflectionPrompt: template.reflectionPrompt,
    coachingPurpose: template.coachingPurpose,
    safeguardingNote: template.safeguardingNote,
  };
}

export function getQuestTemplateCategoryLabel(category: QuestTemplateCategory): string {
  return categoryLabels[category];
}

export function getQuestTemplateIntensityLabel(intensity: QuestTemplateIntensity): string {
  return intensityLabels[intensity];
}
