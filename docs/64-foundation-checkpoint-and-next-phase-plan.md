# Foundation Checkpoint And Next Phase Plan

## Status

Step 57 creates a foundation checkpoint for DRIVE: Winter Quest after the Firebase, role, route, seed, and read-testing foundations.

This is a planning and documentation checkpoint only. It does not deploy anything, change `.env`, switch provider mode, change route protection mode, write Firestore, delete Firestore data, mutate Firestore data, set Firebase custom claims, build PM5 upload, build write workflows, or create reward/progress processing.

## Foundation Phase Summary

The foundation phase now has these major systems in place:

- Preview app and mock data for reviewing athlete, coach, auth, product, and developer surfaces without requiring live Firebase data.
- A central repository provider that keeps mock as the safe default and allows Firebase read mode only when intentionally configured with complete Firebase config.
- Firebase config and Auth foundations, including local config diagnostics, sign-in support for existing Firebase users, and incomplete-claim handling.
- Role claims and role access diagnostics that recognise complete fake coach and athlete test claims and keep missing or incomplete claims blocked from DRIVE access.
- Protected route boundary and route protection mode foundations, with preview as the default and enforced mode available only for intentional local testing.
- Firestore rules, Storage rules, Firestore path helpers, fake Firestore seed data, guarded seed apply tooling, and read-only seed verification tooling.
- Firebase read repository implementations and repository read smoke testing through the active provider boundary.
- A functions workspace with safe dry-run tooling, guarded claim apply foundations, guarded seed apply foundations, credential readiness checks, and rules preflight tooling.

## Proven Manual Tests

The following manual results have been verified and documented:

- Firebase config status passed.
- Test coach claims were applied and the coach role was recognised.
- Test athlete claims were applied and the athlete role was recognised.
- Route access smoke test passed.
- Protected route preview and enforced modes were tested.
- Firestore seed verification passed.
- Firebase read smoke test passed.
- Firebase product screen test passed.
- Role-based Firebase screen test passed.
- Firebase enforced route test passed.

## Current Safe Defaults

The current safe defaults must remain clear:

- `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER` should be `mock` by default.
- `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE` should be `preview` by default.
- Firebase repository mode is intentional testing only for now.
- Enforced route mode is intentional testing only for now.
- Real junior data remains forbidden.

After any local Firebase or enforced-route test, return the local app to mock repository provider and preview route protection.

## What Does Not Exist Yet

The foundation work must not be mistaken for complete product workflows. The project still has:

- No real PM5 upload.
- No image picker.
- No Firebase Storage upload workflow.
- No submission write workflow.
- No coach approve or reject workflow.
- No reward calculation.
- No reward result writes.
- No athlete or squad progress writes from app screens.
- No live leaderboard.
- No public profiles.
- No direct messaging.
- No OCR.
- No Concept2 API.
- No live PM5 Bluetooth.
- No Unity or Godot layer.

## Recommended Next Phase

The recommended next phase order is:

1. Submission write command implementation foundation.
2. PM5 evidence local file selection shell.
3. Firebase Storage upload dry run and rules test.
4. Draft submission write workflow for athlete test user only.
5. Submit for coach review workflow.
6. Coach verification read/detail screen.
7. Coach approve/reject command foundation.
8. Trusted verification write workflow.
9. Reward processing dry run.
10. Reward/progress trusted write foundation.

This order can be adjusted if a later step explicitly approves a different plan, but write workflows must not jump straight to rewards. Submission drafts, PM5 evidence handling, submit state, coach review, and trusted verification must be planned and tested before reward or progress writes.

## Guardrails For The Next Phase

The next phase must keep these guardrails:

- No reward unlocks before coach verification.
- Athlete UI must not write reward results or progress.
- PM5 evidence stays private.
- No public rankings.
- No real junior data until explicitly approved.
- Every write workflow needs a dry run, a blocked rehearsal, and then a live test with fake data only.
- The default local app should return to mock repository provider and preview route protection after Firebase tests.

Write workflows should stay narrow, auditable, and aligned with the existing repository, service, route, and trusted functions boundaries.

## Suggested Step 58

Recommended Step 58:

**Submission Write Boundary Review and Implementation Plan**

This should be a planning step, not the implementation itself. It should review the existing submission command boundaries, Firestore submission rules, PM5 evidence path expectations, role claims, fake test users, dry-run needs, and rollback expectations before any submission write workflow is built.

Step 58 is now captured in `docs/65-submission-write-boundary-review-and-plan.md`. That plan expands this checkpoint's recommended submission write boundary review and keeps Step 59 focused on command service foundations before any live write workflow.

## DRIVE Brief Fit

This checkpoint supports DRIVE by protecting the transition from read-only foundations into careful write workflows. The product remains centred on junior-safe, coach-verified erg training that rewards execution quality, not raw speed, metres, public comparison, or unverified uploads.
