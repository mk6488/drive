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
- `docs/09-development-setup.md`
- `docs/10-ui-and-navigation-shell.md`
- `docs/11-domain-model-and-repository-boundaries.md`
- `docs/12-athlete-todays-quest-screen.md`
- `docs/13-athlete-pm5-submission-shell.md`
- `docs/14-coach-verification-queue-shell.md`
- `docs/15-submission-status-and-verification-gate.md`
- `docs/16-reward-rules-foundation.md`
- `docs/17-submission-lifecycle-timeline.md`
- `docs/18-controlled-lifecycle-preview-harness.md`
- `docs/19-coach-quest-builder-shell.md`
- `docs/20-quest-template-catalogue.md`
- `docs/21-squad-mission-and-river-map-shell.md`

Use `docs/08-definition-of-done.md` before finishing substantive tasks to check scope, safeguarding, architecture boundaries, verification-gated rewards, and final reporting.

## Cursor Rules

Project rules live in `.cursor/rules/` and are intended to keep future agent work aligned with the DRIVE brief.

## Development Setup

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm run start
```

Run typecheck:

```bash
npm run typecheck
```

Run lint:

```bash
npm run lint
```

Developer lifecycle preview route:

```bash
/dev/submission-lifecycle
```

This route is for reviewing the four submission lifecycle states only. It is not a product workflow and does not upload,
submit, approve, reject, calculate rewards, or write progress.

## Current Status

This repository currently contains DRIVE guardrails, the Step 2 Expo React Native TypeScript app foundation, the Step 3 static UI shell, Step 4 domain model plus mock repository boundaries, Step 5's mock-backed athlete Today's Quest screen, Step 6's athlete PM5 evidence submission shell preview, Step 7's coach verification queue shell preview, Step 8's shared submission status plus reward gate foundation layer, Step 9's reward rules design foundation, Step 10's submission lifecycle timeline foundation, Step 11's developer-only lifecycle preview harness, Step 12's coach quest builder shell preview, Step 13's static quest template catalogue with a local template picker only, and Step 14's preview-only squad mission and River Map progress shell.

Step 11 adds `/dev/submission-lifecycle` as a local-state preview for draft, submitted, verified, and rejected lifecycle states only. Real lifecycle actions, reward calculation, and trusted reward/progress writes remain intentionally out of scope.

Step 12 adds `/coach/quest-builder` as a local-state coach quest builder shell only. It previews training quality target language and attribute focus, but does not save quests, write repositories, mutate mock data, calculate rewards, unlock badges, or write progress.

Step 13 adds static rowing quest templates and a local-only picker for the coach builder. Template selection fills draft preview state only; it does not create real quests, write repositories, mutate mock data, calculate rewards, or unlock badges.

Step 14 adds `/athlete/progress` as a read-only preview for squad mission and River Map progress. Static preview data shows quality-based squad contribution only; it does not write progress, calculate rewards, mutate mock data, or create leaderboards.

Firebase code, authentication, PM5 upload workflows, coach verification actions, reward calculation logic, and future integrations have not been added.
