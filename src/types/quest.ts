export type QuestSessionType = 'steady-state' | 'intervals' | 'rate-cap' | 'power' | 'recovery';

export type ExecutionFocus =
  | 'pacing-discipline'
  | 'rate-control'
  | 'consistency'
  | 'recovery-discipline'
  | 'reflection-quality'
  | 'honest-effort';

export interface QuestTarget {
  targetPace?: string;
  targetRate?: string;
  durationOrDistance: string;
  notes?: string;
}

export interface Quest {
  id: string;
  clubId: string;
  squadId: string;
  title: string;
  description: string;
  sessionType: QuestSessionType;
  target: QuestTarget;
  executionFocus: ExecutionFocus[];
  availableFrom: string;
  dueAt: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}
