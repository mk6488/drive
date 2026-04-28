# Athlete Today's Quest Screen

## What Was Added

Step 5 adds the first proper athlete-facing product screen:

- `src/screens/athlete/AthleteTodaysQuestScreen.tsx` as the main athlete preview route.
- Presentational game components for this screen:
  - `src/components/game/QuestFocusPanel.tsx`
  - `src/components/game/VerificationGatePanel.tsx`
  - `src/components/game/AttributeProgressPanel.tsx`
- Route update in `app/athlete/index.tsx` so `/athlete` now renders the new screen.

The previous placeholder screen is kept in the codebase but is no longer the main athlete route.

## How This Supports The DRIVE Brief

The screen is designed to reinforce that DRIVE rewards training quality, not raw completion:

- It displays the coach-set quest and target summary.
- It shows execution-focus cues tied to pacing discipline, rate control, consistency, and honest effort.
- It includes explicit quality-target language from quest target notes.
- It frames PM5 evidence as required but not yet implemented in this step.
- It makes coach verification the gate for reward unlocks.
- It previews Engine, Discipline, Rhythm, and Grit as meaningful training attributes.

## How Mock Repositories Are Used

This step remains preview-only and mock-backed:

- Quest data is read from `mockQuestRepository`.
- Submission status is read from `mockSubmissionRepository`.
- Athlete attribute progress is read from `mockProgressReadRepository`.

The screen performs read-only loading for local preview state and handles loading, error, and empty states.  
No business workflow, trusted write, or reward logic is implemented in the screen.

## Why Rewards Are Still Verification-Gated

Reward integrity remains non-negotiable:

- The screen shows submission status, but does not calculate or award rewards.
- Verification-gate copy explicitly states that unverified submissions do not unlock rewards.
- The UI does not claim completion rewards unless status is `verified`.
- No trusted reward or progress write repository is called from athlete UI.

This keeps the core DRIVE rule intact: rewards unlock only after coach verification.

## Deliberately Out Of Scope

This step intentionally does not add:

- Firebase code
- Authentication
- Real PM5 upload handling
- Coach verification actions
- Reward calculation engine logic
- Leaderboard functionality
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, or social features

## What Future Agents Must Not Infer

From this screen, future agents must not infer that:

- PM5 upload is implemented
- Verification actions are implemented
- Reward calculation is implemented
- Attribute progression logic is implemented
- Firebase integration or auth exists
- Unverified sessions can unlock rewards

This is a product-facing preview screen built on mock reads only, not a complete workflow implementation.
