# Submission Write Command Service Foundation

## What Was Added

Step 59 adds a pure submission write command planning foundation for athlete-side draft and submit intents:

- `src/services/submissions/submissionWriteCommandService.ts`
- `src/services/submissions/submissionWriteDocumentPlan.ts`
- `src/screens/dev/SubmissionWritePlanPreviewScreen.tsx`
- `app/dev/submission-write-plan.tsx`

It also adds a light note to the existing athlete submission shell and updates the README status.

## Why A Pure Write Planning Service Exists

Submission writes affect private PM5 evidence, athlete reflections, coach review, and future reward eligibility. This step creates a validation and planning layer before any real persistence exists so the future workflow can be reviewed without touching Firestore, Storage, repositories, rewards, or progress.

The service contains pure types and helpers only. It does not import React, call repositories, read Firestore, write Firestore, initialise Storage, upload files, mutate mock data, or calculate rewards.

## Athlete Write Status Limits

Athlete write plans are limited to:

- `draft`
- `submitted`

Draft planning may only create or update a `draft` preview. Submit planning may only move a `draft` to `submitted`. Once evidence is submitted, athlete edits are treated as locked so PM5 evidence and reflection remain stable for coach review and audit.

## Coach-Only Statuses

`verified` and `rejected` remain coach review outcomes only. Athlete write plans block attempts to create or transition to either status because athletes must not verify their own submissions or reject coach-reviewed work.

`pending` remains forbidden because DRIVE already uses `submitted` to mean awaiting coach review. Adding `pending` would duplicate meaning and increase drift across status copy, rules, repositories, and future workflows.

## Excluded Fields

Athlete write plans exclude coach review fields:

- `reviewedByUserId`
- `reviewedAt`
- `coachNote`

They also exclude `rewardResultId`, athlete progress, and squad progress fields. Rewards and progress must remain behind future trusted workflows after coach verification, not athlete-side UI or document planning.

## PM5 Evidence And Reflection Rules

PM5 evidence path is required before a submit-for-review plan can be valid. The path is treated as an existing future evidence reference only; this step does not pick images, upload files, initialise Storage, or create PM5 evidence.

Reflection text must stay short and training focused. It should support coach review of execution quality without becoming an overlong diary or asking juniors to disclose sensitive personal information.

## Developer Preview

`/dev/submission-write-plan` is a developer-only local-state preview. It shows fake athlete draft and submit inputs, displays whether the plan is valid or blocked, lists block reasons, and previews the plain future document shape.

Step 60 recorded the first manual preview check in `docs/67-submission-write-plan-manual-test-results.md`.

The preview clearly states:

- no Firestore write happens
- no Storage upload happens
- no reward or progress write happens
- fake ids only are used

It is not added to main product navigation.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- live submission writes are implemented
- draft saving is implemented
- submit for coach review is implemented
- Firestore writes are approved
- Firebase Storage upload exists
- PM5 image picking exists
- coach approve or reject actions exist
- reward calculation exists
- reward result writes are approved
- athlete or squad progress writes are approved
- `verified`, `rejected`, or `pending` are athlete-write statuses
- repository provider mode should switch away from `mock`
- route protection should switch away from `preview`

## Deliberately Out Of Scope

This step intentionally excludes deployment, changing `.env`, changing repository provider defaults, changing route protection defaults, Firestore writes, Firestore deletes, Firestore mutation, running `apply:seed`, running `apply:claims`, setting Firebase custom claims, Firebase Storage upload, PM5 upload, image picking, live draft saving, live submit actions, coach approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
