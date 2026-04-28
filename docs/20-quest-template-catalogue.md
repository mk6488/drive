# Quest Template Catalogue

## What Was Added

Step 13 adds a static quest template catalogue foundation for DRIVE: Winter Quest:

- `src/services/quests/questTemplates.ts` defines rowing-specific quest templates and pure helper functions.
- `src/components/game/QuestTemplatePicker.tsx` presents templates as local drafting shortcuts.
- `src/components/game/QuestTemplateCard.tsx` presents each template title, category, execution focus, and coaching purpose.
- `src/screens/coach/CoachQuestBuilderShellScreen.tsx` lets a coach select a template to fill local draft state only.

The catalogue includes templates for rate control, pacing discipline, recovery discipline, consistency, reflection quality, and honest effort. The language is rowing-specific and junior-safe.

## Why Quest Templates Exist

Quest templates help coaches start from good training intent instead of a blank form or a speed target. They keep the builder focused on quality-based erg quests that support the DRIVE brief:

- pacing discipline
- rate control
- consistency
- recovery discipline
- reflection quality
- honest effort
- Engine, Discipline, Rhythm, and Grit

Templates are not generic workouts. They are coach-facing prompts for shaping a clear session purpose, execution focus, short reflection, and safeguarding note.

## Why Templates Use Execution Focus

DRIVE rewards execution quality, not raw completion, fastest split, or metres alone. The template catalogue therefore describes:

- how the session should be executed
- what the coach should look for
- how the athlete should reflect briefly on training quality
- how the session supports rowing habits

Target pace or effort copy is deliberately framed as guidance, not ranking. Templates avoid exact XP, badge unlocks, speed-based placement, and "go all out no matter what" language.

## Why Templates Do Not Create Real Quests

This step is a foundation for product language and local preview behaviour only. Selecting a template copies static fields into the current screen's local draft state. It does not:

- create a quest record
- save a draft
- assign a quest to athletes
- call repositories
- call Firebase
- mutate mock data

Real quest creation remains out of scope until repository writes, permissions, and persistence rules are explicitly approved.

## Why Selection Is Local Only

Local selection lets reviewers see how template language fits the builder without implying that a workflow exists. This protects the current architecture boundary: screens may display and collect draft state, but they must not perform repository writes or trusted workflow actions.

The picker copy makes clear that templates are starting points, not pressure targets. Coaches must adapt sessions to athlete readiness, and quests must not encourage training through pain, illness, injury, or exhaustion.

## Reward Boundaries

XP, badge unlocks, reward calculation, reward result writes, and athlete progress writes remain deliberately out of scope. Rewards remain future trusted processing only after coach verification.

This catalogue may inform future reward policy language, but it does not calculate rewards and does not make any submission eligible for progress.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Firebase or authentication exists.
- Quest persistence exists.
- Template selection is a save action.
- Coaches can create real quests from this screen.
- Mock data can be mutated.
- XP values or badge unlock rules have been defined.
- Reward calculation is implemented.
- Athlete progress or reward results can be written.
- A template is a fixed target athletes must hit regardless of readiness.

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
- exact XP values
- badge unlocks
- athlete progress writes
- reward result writes
- leaderboards
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features
