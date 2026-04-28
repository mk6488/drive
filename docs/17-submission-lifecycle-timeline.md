# Submission Lifecycle Timeline

## What Was Added

Step 10 adds a submission lifecycle timeline foundation so athlete and coach previews can show one shared, status-based lifecycle view.

Added:

- `src/services/submissions/submissionLifecycle.ts`
- `src/components/game/SubmissionLifecycleTimeline.tsx`
- Timeline integration in athlete and coach preview screens

## Why The Lifecycle Timeline Exists

The timeline creates one consistent explanation of where a submission currently sits and what the next expected lifecycle step is, without adding real workflow actions.

This helps prevent status wording drift across screens and keeps the product aligned with coach-verified reward integrity.

## Four Allowed Submission Statuses

The lifecycle foundation uses only these domain statuses:

- `draft`
- `submitted`
- `verified`
- `rejected`

## Why `pending` Is Not A Domain Status

`pending` is not added as a domain status because `submitted` already represents "awaiting coach review" or "waiting for coach review".  
Adding `pending` would duplicate meaning and increase inconsistency risk.

## Status And Reward Eligibility

| Status | Lifecycle meaning | Reward eligibility |
| --- | --- | --- |
| `draft` | Athlete has not submitted evidence for coach review yet. | Not eligible. |
| `submitted` | Athlete submitted PM5 evidence and reflection; waiting for coach review. | Not eligible. |
| `verified` | Coach verified evidence; future trusted reward processing can become eligible. | Eligible for future trusted reward processing only. |
| `rejected` | Coach reviewed evidence but did not accept it; athlete must update and resubmit. | Not eligible. |

## Why This Step Does Not Create Real Workflow Actions

This step defines pure helper functions and presentational timeline UI only.  
It does not add submit, approve, reject, or transition actions.

## Why Rewards Remain Verification-Gated

The lifecycle service keeps reward gate messaging explicit: only `verified` can become eligible for future trusted reward processing.  
`draft`, `submitted`, and `rejected` remain locked.

## What Future Agents Must Not Infer

Future agents must not infer that this foundation added:

- real submit workflow actions
- real coach approve or reject actions
- reward calculation
- reward result writes
- athlete progress writes
- Firebase, authentication, or storage integration

## Deliberately Out Of Scope

This step intentionally excludes:

- Firebase
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
