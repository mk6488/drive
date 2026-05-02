# Submission Write Boundary Review And Plan

## Status

Step 58 creates a planning-only submission write boundary review for DRIVE: Winter Quest before any write workflow is built.

This step does not deploy anything, change `.env`, switch the app to Firebase repository mode, change route protection mode, write Firestore, delete Firestore data, mutate Firestore data, upload to Firebase Storage, initialise Storage from product screens, build image picking, build PM5 upload, save submission drafts, submit work for coach review, approve or reject submissions, calculate rewards, or write reward or progress records.

## A. Current Foundation State

The foundation phase already includes the pieces needed to plan submission writes safely:

- The athlete PM5 submission shell exists as a preview-only screen. It shows quest context, PM5 evidence framing, short reflection drafting, readiness messaging, and the submission lifecycle timeline, but upload and submit actions remain disabled.
- The coach verification queue shell exists as a preview-only screen. It reads mock or controlled repository data and shows disabled review controls, but does not approve, reject, or mutate submissions.
- Submission status and lifecycle services centralise the four allowed statuses, status labels, lifecycle stages, and reward gate copy.
- Submission command input types and validators exist for future draft creation, PM5 evidence attachment, submit for coach review, and coach verify or reject inputs. They validate local strings only and do not call repositories or Firebase.
- Verification boundary helpers keep two rules explicit: only `submitted` submissions can be reviewed by a coach, and only `verified` submissions can become eligible for future trusted reward processing.
- Firestore document types and mappers exist for current read foundations. The athlete-side submission draft mapper is limited to `draft` and `submitted` document data and excludes coach review fields and reward result fields.
- Firestore rules define the intended submission write boundary: athlete draft and submit writes are narrow, coach review is limited to submitted records, reward and progress writes are denied to clients, and deletes are denied.
- Storage rules and PM5 evidence path helpers define private PM5 evidence paths under `clubs/{clubId}/submissions/{submissionId}/pm5/{fileName}`. The app has path helpers only; no Storage upload implementation exists.
- The repository provider keeps mock as the safe default. Firebase repository mode is explicit, read-focused, and used only for controlled testing with complete Firebase config.
- The Firebase submission repository is read only. It supports scoped reads by club, squad, athlete, and submission id, but does not save drafts, submit evidence, or perform coach review writes.
- Fake Firebase coach and athlete test users exist with fake role claims, and fake seeded Firestore data exists for the fixed example ids used in controlled read testing.

## B. Allowed Submission Statuses

The only allowed DRIVE submission statuses remain:

- `draft`
- `submitted`
- `verified`
- `rejected`

`pending` is not a domain status. `submitted` already means that athlete evidence has been sent and is awaiting coach review.

`verified` and `rejected` belong to coach review. Athlete-side writes may only create or update `draft` or `submitted` data. Athlete-side code must not create `verified` or `rejected` submissions.

## C. Future Athlete Write Sequence

The future athlete submission sequence should be introduced in this order:

1. Choose or prepare PM5 evidence locally.
2. Validate the reflection draft.
3. Validate the PM5 evidence path.
4. Create or update a draft submission.
5. Submit the draft for coach review.
6. Lock athlete edits once the submission is submitted.
7. Wait for coach review.
8. Make reward eligibility possible only after the submission is verified.

This document plans that sequence only. It does not implement local evidence handling, draft writes, submit actions, edit locking, coach review, reward calculation, or progress writes.

## D. Firestore Write Boundary Review

The intended future Firestore submission rules should remain narrow:

- An athlete may create or edit only their own draft submissions.
- An athlete may move their own draft submission to `submitted`.
- Submitted evidence must be locked from athlete edits so PM5 evidence and reflection remain stable for coach review and audit.
- Coach review must be limited to `submitted` submissions for the coach's authorised club or squad context.
- Coach review fields remain `reviewedByUserId`, `reviewedAt`, and `coachNote`.
- `rewardResultId` must not be written by athlete UI.
- `athleteProgress` must not be written by athlete UI.
- `squadProgress` must not be written by athlete UI.
- Coaches must not write reward or progress records directly from review UI until a trusted workflow exists.

The current `firestore.rules` foundation already expresses these boundaries at planning level, but future write work still needs dry runs, blocked rehearsals, and fake-data live tests before real users.

## E. Storage Boundary Review

Future PM5 evidence handling must preserve the private evidence boundary:

- PM5 evidence paths should remain private and scoped under the current club and submission path pattern.
- PM5 files must not be public.
- Athletes should upload only their own PM5 evidence.
- Coaches may read evidence only for their scoped club or squad review context.
- There must be no public galleries.
- There must be no social sharing.
- There must be no direct messaging.
- No Storage upload implementation exists yet.

The current Storage rules and path helpers are not an upload workflow. Future Storage work needs explicit ownership checks, Firestore linkage, fake bucket testing, user-facing error handling, and coach review alignment.

## F. Required Future Dry-Run And Rehearsal Order

The safe future implementation order should be:

1. Submission write command service foundation.
2. Write mapper for athlete draft and submitted document data only.
3. Firestore submission write dry-run script or local command validation.
4. Blocked Firestore submission write rehearsal.
5. Live fake athlete draft write.
6. Live fake athlete submit write.
7. Read back the submitted fake submission.
8. Coach review detail screen.
9. Coach review command foundation.
10. Blocked coach review write rehearsal.
11. Live fake coach verify or reject write.
12. Reward processing dry run only after verification is proven.

This order deliberately keeps reward and progress writes behind submission and coach verification proof.

## G. Required Guardrails

Future submission write work must keep these guardrails:

- No reward unlocks before coach verification.
- Athlete UI must never write reward or progress records.
- Coach UI must not directly write reward or progress either until a trusted workflow exists.
- PM5 evidence remains private.
- Real junior data remains forbidden.
- The default local app must return to mock repository provider and preview route protection after Firebase tests.
- Every live write test must use fake data first.
- Every write workflow needs a rollback or cleanup plan before real users.
- `apply:seed`, `apply:claims`, custom claim setting, and Firebase deploys remain separate explicit operations and must not be mixed into submission write implementation.

## H. Risks And Open Questions

Open questions before implementation:

- Should draft submission write happen before Storage upload, or after local file path validation has produced a stable planned path?
- Should PM5 upload be implemented before Firestore submission writes, or should Firestore write rehearsal prove draft and submitted status first?
- Should fake Storage bucket testing happen before app image picker work?
- Should the first submission write be functions-side or client-side through Firestore rules?
- How should rejected submissions be corrected or resubmitted later without weakening the audit trail for the rejected record?
- When should audit records for coach review be introduced?
- How should cleanup work for fake live write tests be planned before real users, given Firestore deletes are intentionally denied to client UI?
- What user-facing error states are needed when evidence upload succeeds but submission write fails, or when submission write succeeds but evidence upload fails?

## I. Recommended Step 59

Recommended Step 59:

**Submission Write Command Service Foundation**

Step 59 should still avoid live Firestore writes unless explicitly approved. It should focus on a service-level command boundary for athlete draft and submit intent, validation, mapper shape, status transition rules, and dry-run reporting, while keeping product screens disconnected from write workflows.

## DRIVE Brief Fit

This plan supports DRIVE by protecting the transition from read-only foundations into careful submission write workflows. PM5 evidence is private junior training evidence, athlete reflections are coach-facing, and rewards must remain locked until trusted coach verification proves the effort should count.

The plan keeps DRIVE centred on honest uploads, useful reflection, coach verified effort, and execution quality rather than unverified completion, public comparison, or client-side reward shortcuts.
