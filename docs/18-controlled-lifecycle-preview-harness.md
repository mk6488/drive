# Controlled Lifecycle Preview Harness

## What Was Added

Step 11 adds a developer-only submission lifecycle preview harness:

- `src/services/preview/submissionLifecycleScenarios.ts` defines static scenarios for `draft`, `submitted`, `verified`, and `rejected`.
- `src/screens/dev/SubmissionLifecyclePreviewScreen.tsx` lets reviewers switch between those scenarios using local React state.
- `app/dev/submission-lifecycle.tsx` exposes the build preview route at `/dev/submission-lifecycle`.

The harness displays the shared `SubmissionLifecycleTimeline`, status copy, reward gate messaging, and short athlete and coach summaries for each allowed status.

## Why This Preview Harness Exists

The preview exists so future agents, reviewers, and product stakeholders can visually inspect how each submission state behaves before real Firebase workflows exist.

It keeps the status model explicit and reinforces the core DRIVE rule: rewards only become eligible after coach verification.

## Why It Uses Local State Only

Scenario switching uses local component state only because this route is a visual inspection tool, not a workflow.

The preview scenarios are static definitions. They do not read repositories, call Firebase, mutate mock data, upload PM5 evidence, submit evidence, verify evidence, reject evidence, calculate rewards, or write progress.

## Why It Must Not Be Treated As A Real Workflow

This route does not prove that the product can submit, approve, reject, reward, or persist anything. It only shows expected lifecycle language and UI behaviour for controlled preview states.

Future agents must not wire product actions into this screen or treat its scenario buttons as workflow transitions.

## Why No Repository Writes Are Allowed

Submission, reward, and progress writes affect trust and auditability. DRIVE must not allow UI previews to create or modify records that look like real athlete evidence, coach decisions, reward results, or athlete progress.

Trusted write repositories remain reserved for future verified workflows. This harness must stay read-free and write-free.

## Why Rewards Remain Verification Gated

Only the `verified` status can become eligible for future trusted reward processing. `draft`, `submitted`, and `rejected` remain locked.

This protects the product principle that DRIVE rewards coach-verified execution quality, not raw completion, unreviewed uploads, fastest splits, or metres alone.

## What Future Agents Must Not Infer

Future agents must not infer from this harness that:

- Firebase is implemented.
- Authentication is implemented.
- PM5 upload or Firebase Storage is implemented.
- Athlete submit actions are implemented.
- Coach approve or reject actions are implemented.
- Reward calculation is implemented.
- Reward result writes or athlete progress writes are implemented.
- Scenario buttons are real lifecycle transitions.
- `pending` is a valid domain status.

## Deliberately Out Of Scope

This step intentionally excludes:

- Firebase code
- authentication
- real PM5 upload
- Firebase Storage
- real submit actions
- real approve or reject actions
- reward calculation
- reward result writes
- athlete progress writes
- leaderboards
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features
