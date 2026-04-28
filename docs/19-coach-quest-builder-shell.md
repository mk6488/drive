# Coach Quest Builder Shell

## What Was Added

Step 12 adds a coach-facing quest builder preview shell:

- `src/screens/coach/CoachQuestBuilderShellScreen.tsx`
- `src/components/game/QuestBuilderPreviewCard.tsx`
- `src/components/game/ExecutionFocusSelector.tsx`
- `src/components/game/QuestQualityTargetPanel.tsx`
- `app/coach/quest-builder.tsx`

It also updates `src/screens/coach/CoachHomePlaceholderScreen.tsx` so coaches can open the preview from the coach home.

## Why The Builder Exists Before Real Saves

The shell lets the product shape coach quest creation language before any persistent workflow exists.

DRIVE quests should help coaches set training quality targets, not just distance, speed, or completion goals. This preview makes the intended coaching shape visible early: quest title, session type, duration or distance, target rate, target pace or effort guidance, execution focus, and a short reflection prompt.

## How It Supports The DRIVE Brief

The builder reinforces that DRIVE rewards coach verified execution quality. It prompts coaches to think about:

- pacing discipline
- rate control
- consistency
- recovery discipline
- reflection quality
- honest effort
- Engine, Discipline, Rhythm, and Grit

The screen also includes safeguarding copy that warns against reckless score pressure, training through pain, illness, injury, or exhaustion, overlong reflections, public rankings, direct messaging, and public sharing.

## Execution Focus To Attributes

The screen uses pure reward-rule helpers to preview which attributes the selected execution focus supports:

- `pacing-discipline`: Rhythm + Discipline
- `rate-control`: Discipline + Rhythm
- `consistency`: Rhythm + Engine
- `recovery-discipline`: Discipline + Engine
- `reflection-quality`: Discipline + Grit
- `honest-effort`: Grit + Discipline

This is attribute focus preview only. It does not calculate XP, create a `RewardResult`, unlock badges, write progress, or run trusted reward processing.

## Why Local State Only Is Used

The builder uses local React state so reviewers can see draft copy update in a live preview without creating or changing data.

It does not fetch quest data, call repositories, call Firebase, mutate mock data, or persist anything.

## Why Saving Is Disabled

Saving is disabled because real quest creation needs approved repository boundaries, permission handling, and later trusted workflow decisions.

The disabled save button is there to communicate future product shape only. It is not a partially implemented submit action.

## Not A Real Quest Creation Workflow

This shell does not prove that DRIVE can create weekly quests. It does not:

- create quest records
- write to repositories
- mutate mock data
- initialise Firebase
- authenticate coaches
- upload PM5 evidence
- submit athlete work
- approve or reject submissions
- calculate rewards
- write athlete progress

## What Future Agents Must Not Infer

Future agents must not infer from this shell that:

- quest persistence exists
- coach permissions exist
- Firebase or authentication is wired
- save actions are ready to connect directly from UI
- reward calculation can run before coach verification
- exact XP, badge unlocks, or progress writes are part of this step
- public rankings, messaging, or social sharing are part of quest creation

## Deliberately Out Of Scope

This step intentionally excludes:

- Firebase
- authentication
- real quest creation
- repository writes
- mock data mutation
- real PM5 upload
- Firebase Storage
- real submit actions
- real approve or reject actions
- reward calculation
- exact XP calculation
- badge unlocks
- athlete progress writes
- reward result writes
- leaderboards
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features
