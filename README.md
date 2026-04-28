# DRIVE: Winter Quest

DRIVE is a gamified junior rowing erg training app for athletes aged 14 to 18.

The first product is **DRIVE: Winter Quest**, a coach verified winter training loop where athletes complete erg quests, upload PM5 screen evidence, reflect on the session, and earn rewards only after coach verification.

## Core Philosophy

DRIVE must reward execution quality, not just completion.

The product should reward pacing discipline, rate control, consistency, honest uploads, useful reflection, improvement, good training habits, and coach verified effort.

## MVP Loop

1. Coach creates weekly erg quests.
2. Athlete completes the erg session.
3. Athlete uploads a PM5 screen photo.
4. Athlete adds a short reflection.
5. Coach verifies or rejects the upload.
6. Rewards unlock after coach verification.
7. Squad mission progress updates.
8. River Map or Boathouse progress updates.

## MVP Boundaries

The MVP deliberately excludes:

- OCR
- Concept2 Logbook API integration
- Live PM5 Bluetooth
- Unity or Godot
- Pure speed leaderboards
- Metres-only rewards
- Generic workout tracking

## Documentation

Future work must read these documents before implementation:

- `docs/00-product-brief.md`
- `docs/01-mvp-scope.md`
- `docs/02-game-design-rules.md`
- `docs/03-reward-system.md`
- `docs/04-user-roles-and-safeguarding.md`
- `docs/05-technical-architecture.md`
- `docs/06-firestore-schema.md`
- `docs/07-build-roadmap.md`
- `docs/08-definition-of-done.md`

Use `docs/08-definition-of-done.md` before finishing substantive tasks to check scope, safeguarding, architecture boundaries, verification-gated rewards, and final reporting.

## Cursor Rules

Project rules live in `.cursor/rules/` and are intended to keep future agent work aligned with the DRIVE brief.

## Current Status

This repository currently contains guardrails only.

No Expo app, package installation, screens, or Firebase code has been created in step 1.
