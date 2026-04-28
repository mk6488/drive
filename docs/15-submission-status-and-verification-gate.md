# Submission Status And Verification Gate

## Why This Shared Service Exists

Step 8 adds a shared submission status service so athlete and coach screens use the same language and the same reward gate rule.

Without this layer, each screen can drift into different wording or different gating behaviour. DRIVE requires one rule everywhere: rewards unlock only after coach verification.

The shared service is `src/services/submissions/submissionStatus.ts`.

It only decides:

- status labels
- status tone mapping for existing UI pills
- status descriptions
- verification gate messaging
- reward gate booleans

It does not calculate rewards and it does not trigger workflows.

## Allowed Submission Statuses

DRIVE domain status remains:

- `draft`
- `submitted`
- `verified`
- `rejected`

## Status Behaviour Table

| Status | User-facing label | Can unlock rewards | Meaning |
| --- | --- | --- | --- |
| `draft` | Draft | No | Athlete has started evidence and reflection but has not submitted for coach review. |
| `submitted` | Awaiting coach review | No | Athlete submitted evidence; the submission is awaiting coach review. |
| `verified` | Verified | Yes | Coach has verified the submission, so reward workflows may proceed. |
| `rejected` | Rejected | No | Coach reviewed and rejected the submission; athlete must update and resubmit. |

## Why `pending` Is Not A Domain Status

`pending` is intentionally not part of the domain model. The product language already uses `submitted` to represent "awaiting coach review". Adding `pending` would duplicate meaning and increase inconsistency risk.

## Why Only `verified` Unlocks Rewards

DRIVE rewards coach-verified execution quality, not raw completion. Allowing non-verified states to unlock rewards would break the core MVP loop and reward integrity.

`canSubmissionUnlockRewards(status)` therefore returns `true` only for `verified`.

## What Future Agents Must Not Infer

From this status and gate layer, future agents must not infer that:

- reward calculation is implemented
- reward writes are implemented
- athlete progress writes are implemented
- PM5 upload is implemented
- athlete final submit workflow is implemented
- coach approve or reject actions are implemented
- Firebase or authentication is implemented

## Deliberately Out Of Scope

This step does not add:

- Firebase
- authentication
- real PM5 upload
- Firebase Storage
- real submit actions
- real approve or reject actions
- reward calculation
- athlete progress writes
- reward result writes
- leaderboards
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, or social features

## Testing Note

No dedicated test runner script is currently defined in this repository, so this step documents expected status behaviour in the table above instead of adding new test tooling or packages.
