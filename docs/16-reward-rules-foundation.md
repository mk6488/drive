# Reward Rules Foundation

## What Was Added

Step 9 introduces a reward rules design foundation that captures DRIVE reward philosophy in code without creating a live reward workflow.

Added:

- `src/services/rewards/rewardRules.ts`
- `src/services/rewards/rewardGate.ts`
- `src/services/rewards/badgeCatalogue.ts`
- `src/components/game/RewardFocusPreviewPanel.tsx`
- Integration into the athlete Today&apos;s Quest screen
- Minor coach queue copy update to reinforce verification as the future reward trigger

## Why Reward Policy Now Exists In Code

Reward policy is now codified so screens can reference one shared interpretation of execution quality and attribute emphasis instead of ad hoc wording in UI components.

This keeps the product aligned with DRIVE&apos;s core principle: reward coach-verified execution quality, not raw completion, fastest split, or metres alone.

## Execution Focus To Attribute Emphasis

| Execution focus | Attribute emphasis | Reason |
| --- | --- | --- |
| pacing-discipline | Rhythm + Discipline | Encourages controlled pacing and adherence to the prescribed effort band. |
| rate-control | Discipline + Rhythm | Prioritises stroke-rate restraint and repeatable rhythm over chasing speed. |
| consistency | Rhythm + Engine | Rewards repeatable output quality and sustained session execution. |
| recovery-discipline | Discipline + Engine | Values correct recovery execution that protects intended training stimulus. |
| reflection-quality | Discipline + Grit | Reinforces thoughtful coach-facing reflection and learning accountability. |
| honest-effort | Grit + Discipline | Supports truthful evidence, follow-through, and reliable training habits. |

## Why Exact XP Calculation Is Still Out Of Scope

This step does not assign exact XP values and does not compute final rewards.  
It only defines policy language and mappings so future reward calculation can be implemented in a dedicated trusted workflow.

## Why Badge Definitions Are Catalogue Only

The badge list is static catalogue content only.  
No unlock logic, no unlock state, and no badge attachment to athlete progress is implemented in this step.

## Why Rewards Remain Verification-Gated

Only verified submissions are eligible for future reward processing.  
Draft, submitted, and rejected statuses remain locked to preserve reward integrity and coach oversight.

## Why Fastest Split And Metres-Only Rewards Are Avoided

This foundation encodes quality signals (pacing discipline, rate control, consistency, recovery discipline, reflection quality, honest effort) and explicitly avoids logic that rewards raw speed or total metres alone.

## What Future Agents Must Not Infer

Future agents must not infer that this step added:

- exact XP awards
- reward result calculation
- reward writes
- athlete progress writes
- badge unlock logic
- trusted backend reward workflow
- real submit, approve, or reject actions

## Deliberately Out Of Scope

This step intentionally excludes:

- Firebase implementation
- authentication
- real PM5 upload
- Firebase Storage
- real submit actions
- real approve or reject actions
- reward result writes
- athlete progress writes
- leaderboards
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features
