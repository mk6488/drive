# Boathouse Builder Shell

## What Was Added

Step 15 adds a preview-only Boathouse Builder shell for DRIVE: Winter Quest:

- Planning-level boathouse progress types for training resources, resource balances, upgrades, and boathouse progress.
- Static mock preview data for boathouse resource balances and upgrade cards.
- A read-only mock repository method for boathouse progress.
- Presentational game components for boathouse progress, upgrade cards, and training resource chips.
- `src/screens/athlete/AthleteBoathouseShellScreen.tsx`.
- `app/athlete/boathouse.tsx`.
- Safe preview navigation from Today&apos;s Quest and the existing squad progress shell.

## How This Supports The DRIVE Game Feel

The boathouse makes DRIVE feel more like an indie rowing game world instead of a generic fitness dashboard. It gives the squad a shared place to build: an Erg Corner, Blade Rack, Repair Bench, Crew Noticeboard, Trophy Shelf, and Regatta Prep Area.

The shell uses rowing-world resources such as Energy, Grit, Rhythm, Power, Crew Points, and Repair Tokens to show how future verified training quality could become visible in a shared space.

## Why The Boathouse Exists

The boathouse represents squad identity built through good winter training habits. It exists to reinforce that quality matters:

- coach verified sessions
- pacing discipline
- rate control
- consistency
- honest effort
- useful reflections

It is not a generic currency screen, workout tracker, or speed competition.

## Why Resources And Upgrades Are Preview Only

Resource balances and upgrade states are static mock preview data. They do not come from real submissions, do not represent live athlete rewards, and do not imply that reward processing exists.

This step does not calculate XP, resource earnings, upgrade costs, or unlock rules. The values are there only to preview product language and visual direction.

## Why Progress Remains Verification Gated

Future boathouse progress must only happen after coach verification and trusted progress processing. Unverified uploads, raw completion, fastest splits, and metres alone must not unlock boathouse resources or upgrades.

Athlete-facing UI must not write boathouse progress, athlete progress, squad progress, reward results, or resource balances.

## Why This Is Not A Leaderboard

The shell does not rank athletes, compare public profiles, expose public athlete data, or reward fastest splits. It presents shared progress language only.

Any future ranking feature would require explicit product approval and safeguarding review.

## Smaller Or Younger Athlete Contribution

The boathouse copy deliberately states that smaller or younger athletes can contribute through discipline, consistency, honest effort, rate control, pacing discipline, and useful reflections.

The shell avoids language that suggests only power output, speed, or total metres matter. It also states that DRIVE must not encourage training through pain, illness, injury, or exhaustion.

## What Future Agents Must Not Infer

Future agents must not infer from this shell that:

- Firebase or authentication exists.
- Real PM5 upload exists.
- Real quest creation exists.
- Real submit, approve, or reject actions exist.
- Reward calculation exists.
- Resource earning calculation exists.
- Reward results can be written.
- Athlete progress can be written.
- Squad progress can be written.
- Boathouse progress can be written from UI.
- Static resource balances are live earned rewards.
- Static upgrade states are real verified unlocks.
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
- XP calculation
- resource earning calculation
- upgrade cost calculation
- athlete progress writes
- squad progress writes
- reward result writes
- trusted reward or progress writes
- leaderboards and public rankings
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features
