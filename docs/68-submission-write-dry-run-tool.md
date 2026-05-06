# Submission Write Dry Run Tool

## What Was Added

Step 61 adds a local functions-side submission write dry run foundation:

- `functions/src/submissionWriteDryRun.ts`
- `functions/src/dryRunSubmissionWrite.ts`
- fake dry run inputs in `functions/samples/`
- npm scripts for draft, submit, and deliberately blocked invalid rehearsals

The tool previews future athlete draft and submit submission document shapes for the fixed fake ids only. It does not create real submission documents.

## Why This Exists Before Live Writes

Submission writes affect private PM5 evidence, athlete reflections, coach review, and future reward eligibility. DRIVE needs the write shape to be visible and reviewable before any live Firestore write, Storage upload, app submit action, or coach review action is introduced.

A functions-side dry run keeps the rehearsal close to future trusted workflow code while remaining local and write-free.

## Athlete-Side Dry Run Modes

The only supported dry run modes are:

- `draft`
- `submit`

`draft` may only plan status `draft`. `submit` may only plan status `submitted`. These are the only athlete-side states that can be rehearsed because athletes can prepare evidence and send it for coach review, but they must not decide the review outcome.

## Coach-Only Statuses

`verified` and `rejected` remain coach-only review outcomes. The dry run blocks athlete-side attempts to plan either status because athletes must not verify their own training evidence or reject reviewed work.

`pending` remains forbidden because DRIVE already uses `submitted` to mean the submission is waiting for coach review. Adding `pending` would duplicate the domain meaning and create status drift.

## Excluded Fields

Coach review fields are excluded:

- `reviewedByUserId`
- `reviewedAt`
- `coachNote`

`rewardResultId` is also excluded. Athlete-side dry runs must not attach review results, reward outcomes, or any field that implies coach judgement has already happened.

## Reward And Progress Boundaries

Reward result writes, athlete progress writes, squad progress writes, River Map progress, and Boathouse progress remain forbidden. Rewards must wait for coach verified execution quality and a later trusted reward workflow.

The dry run prints that no reward or progress write happened so future agents do not infer that previewing a submitted document shape can unlock DRIVE progress.

## Storage Boundary

The submit dry run requires the fake PM5 evidence path:

```text
clubs/example-club/submissions/example-submission-rate-20/pm5/example-pm5-screen.jpg
```

This is a planned reference only. The tool does not pick an image, initialise Storage, upload a PM5 file, test bucket permissions, or create public evidence.

## Firestore Boundary

No Firestore write happens. No Firestore read happens. Firebase Admin is not imported or initialised by the dry run helper or script.

The report prints the planned future document path and document shape only so the boundary can be reviewed before any live write is approved.

## Fake Data Only

The dry run accepts only these fake example ids:

- `example-club`
- `example-j15-squad`
- `example-athlete`
- `example-quest-rate-20`
- `example-submission-rate-20`

Committed samples must not contain real junior names, real Firebase UIDs, real club data, service account data, parent details, or operational secrets.

## What Future Agents Must Not Infer

Future agents must not infer that this dry run added:

- live submission draft saving
- live submit for coach review
- Firestore writes
- Firestore deletes
- Firebase Storage upload
- PM5 image picking
- coach approve or reject actions
- reward calculation
- reward result writes
- athlete progress writes
- squad progress writes
- repository provider switching
- route protection mode changes

## Deliberately Out Of Scope

This step intentionally excludes deployment, `.env` changes, provider default changes, route protection default changes, Firestore mutation, Storage upload, real junior or real club data, PM5 upload UI, image picking, live draft saving, live submit, coach review actions, reward calculation, reward/progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.

## DRIVE Brief Fit

This dry run supports DRIVE by rehearsing the private athlete evidence and reflection write shape before live persistence exists. It protects the coach verification gate, keeps rewards locked behind verified execution quality, and makes unsafe fields visible as blocked instead of quietly accepting them.
