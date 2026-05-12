# Submission Write Apply Safety Gate

## What Was Added

Step 63 adds a pure submission write apply safety gate foundation in the functions workspace:

- `functions/src/submissionWriteApplySafetyGate.ts`
- a future apply safety gate section in the submission write dry-run output
- fake apply planning fields in the committed submission dry-run samples

The safety gate is data evaluation only. It does not import Firebase Admin, Firestore, Storage, app repositories, or network clients. It does not write Firestore, delete Firestore data, mutate Firestore data, upload to Storage, initialise Firebase Admin, save live drafts, submit work for coach review, approve or reject submissions, calculate rewards, or write progress.

## Why This Gate Exists Before Live Submission Writes

Submission writes affect private junior training evidence, athlete reflection, coach review state, and future reward eligibility. Before DRIVE ever writes even a fake athlete submission to Firestore, the apply path needs a strict gate that makes unsafe writes visible and blocked.

The gate checks the requested apply mode, exact confirmation phrase, environment flag, audit fields, dry-run or write-plan validity, fake example ids, allowed command type, allowed status, forbidden review fields, forbidden reward fields, forbidden progress writes, and PM5 evidence requirements.

## Athlete-Side Status Limits

Draft and submitted are the only athlete-side write statuses because they represent the athlete preparing evidence and then sending it for coach review. They do not imply coach judgement or reward eligibility.

`pending` remains blocked because DRIVE already uses `submitted` to mean waiting for coach review. Adding `pending` would duplicate domain meaning and increase drift across screens, rules, repositories, and future workflow code.

`verified` and `rejected` remain blocked because they are coach review outcomes. Athletes must not verify their own submissions, reject submissions, or create records that look coach-reviewed.

## Review, Reward, And Progress Boundaries

Coach review fields remain blocked from athlete-side writes:

- `reviewedByUserId`
- `reviewedAt`
- `coachNote`

Those fields belong to a future coach verification workflow only.

`rewardResultId`, athlete progress writes, and squad progress writes remain blocked because rewards and progress must wait for coach verified execution quality and later trusted reward processing. A submitted upload is not enough to award XP, badges, attributes, River Map movement, Boathouse progress, or squad mission progress.

## PM5 Evidence And Fake IDs

PM5 evidence path is required for `submitForCoachReview` because coach review needs private training evidence before an athlete can send the submission. This step only checks for a planned path; it does not pick an image, initialise Storage, upload a file, or create a public evidence object.

Early rehearsals must use the fixed fake ids only:

- `example-club`
- `example-j15-squad`
- `example-athlete`
- `example-quest-rate-20`
- `example-submission-rate-20`

Real junior data, real Firebase UIDs, real club data, service account data, and private operational inputs must not be placed in committed samples or dry-run files.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- live submission writes are implemented
- Firestore writes are approved
- Firebase Storage upload exists
- PM5 image picking exists
- live draft saving exists
- live submit for coach review exists
- coach approve or reject actions exist
- reward calculation exists
- reward results, athlete progress, squad progress, River Map progress, or Boathouse progress may be written
- `pending`, `verified`, or `rejected` are athlete-write statuses
- repository provider defaults should change away from `mock`
- route protection defaults should change away from `preview`

## Deliberately Out Of Scope

This step intentionally excludes deployment, `.env` changes, repository provider changes, route protection changes, Firestore writes, Firestore deletes, Firestore mutation, Firebase Storage upload, Firebase Admin initialisation for submission writes, PM5 upload, image picking, live draft saving, live submit, coach approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.

## DRIVE Brief Fit

This safety gate supports DRIVE by protecting the move from write-free rehearsal toward future submission persistence. It keeps athlete-side writes limited to honest evidence and reflection, preserves coach verification as the reward gate, and blocks any shortcut that would turn an unverified upload into progress.
