# Squad Mission And River Map Shell

## What Was Added

Step 14 adds a preview-only squad mission and River Map progress shell for DRIVE: Winter Quest:

- Planning-level progress types for squad missions and River Map progress.
- Static mock preview data for the `Repair the Club Quad` squad mission.
- Static River Map nodes from `The Boathouse` through `Regatta Harbour`.
- Read-only mock repository methods for squad mission and River Map preview data.
- Presentational game components for the squad mission card, River Map panel, and River Map node cards.
- `src/screens/athlete/AthleteProgressShellScreen.tsx`.
- `app/athlete/progress.tsx`.
- A preview navigation card from Today&apos;s Quest.

## How This Supports The DRIVE Game Feel

The shell makes DRIVE feel more like an indie rowing game world by showing a shared mission and a winter river journey. It connects training quality to squad identity: completed verified sessions, pacing discipline, rate control, useful reflections, and squad contribution can all be represented without relying on fastest splits or metres-only progress.

The map language is rowing-specific and progression-based, with landmarks such as `Rate 20 Rapids`, `The Pacing Marshes`, `Sprint Bridge`, and `Regatta Harbour`.

## Why This Is Preview Only

The mission and map values are static mock preview data. They do not come from real verified submissions, do not represent live athlete progress, and do not imply that reward or progress workflows are implemented.

This step does not mutate mock data, write repositories, calculate rewards, create reward results, or write athlete, squad, or River Map progress.

## Why Progress Remains Verification Gated

DRIVE rewards coach verified execution quality. Future squad mission and River Map progress must only update after a coach verifies the relevant training evidence and a trusted workflow decides the progress contribution.

Unverified uploads, raw completion, fastest splits, and metres alone must not unlock mission or map progress.

## Why This Is Not A Leaderboard

This shell does not rank athletes, compare public profiles, expose public athlete data, or reward the fastest athlete. It presents shared squad progress and quality-based contribution types only.

Any future ranking feature would require explicit product approval and safeguarding review.

## Smaller Or Younger Athlete Contribution

Smaller or younger athletes can contribute through discipline, consistency, honest effort, pacing control, rate control, and useful reflection. The shell deliberately avoids copy that suggests only power output, speed, or total metres matter.

The UI also states that DRIVE must not encourage training through pain, illness, injury, or exhaustion.

## What Future Agents Must Not Infer

Future agents must not infer from this shell that:

- Firebase or authentication exists.
- Real PM5 upload exists.
- Real quest creation exists.
- Real submit, approve, or reject actions exist.
- Reward calculation exists.
- Reward results can be written.
- Athlete progress can be written.
- Squad mission or River Map progress can be written from UI.
- Static mock preview values are live verified progress.
- Leaderboards, public rankings, public athlete profiles, direct messaging, or sharing features are approved.

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
- athlete progress writes
- reward result writes
- trusted reward or progress writes
- leaderboards and public rankings
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features
