# Trusted Claims Live Apply Implementation

## What Was Added

Step 42 implements the guarded Firebase custom claim apply path inside the `functions/` workspace.

- `functions/src/applyRoleClaimAssignment.ts` now has an isolated `applyDriveCustomClaims()` helper that can call Firebase Admin Auth `setCustomUserClaims`.
- `functions/src/claimApplySafetyGate.ts` no longer reports `realApplyNotImplemented` when all live safety gates are satisfied.
- `functions/src/firebaseAdmin.ts` still initialises Firebase Admin only when a trusted live apply reaches the Admin helper.

This implementation was not run, `DRIVE_CLAIMS_LIVE_APPLY` was not set, and no Firebase custom claims were set during this task.

## Why Apply Is Still Blocked By Default

The apply path exists so DRIVE can later assign claims through a trusted server-side process, not through the client app. It remains deliberately hard to trigger because role claims affect junior athlete data, coach verification surfaces, and future reward-sensitive progress.

The script must still refuse to set claims unless every runtime safety gate passes:

- `DRIVE_CLAIMS_LIVE_APPLY` is exactly `true`.
- `requestedApplyMode` is exactly `live`.
- `confirmationPhrase` is exactly `APPLY_DRIVE_ROLE_CLAIMS`.
- The safety gate allows apply.
- The proposed role is `athlete` or `coach` only.
- `adminFuture` remains blocked.
- `targetUserId`, `trustedActorId`, `auditReason`, and `clubId` are present.
- Athlete claims include `linkedAthleteId`.
- Proposed claims pass validation.
- Firebase Admin can be initialised through standard local credential mechanisms.

If any check fails, the script prints block reasons and exits without setting claims.

## Why The Environment Flag Is Required

`DRIVE_CLAIMS_LIVE_APPLY=true` is a final runtime brake. A valid-looking local input file, a matching confirmation phrase, or a successful dry run is not enough to write custom claims.

The flag must stay unset for blocked rehearsals and normal validation so Firebase Admin initialisation is not reached by accident.

## Why The Confirmation Phrase Is Required

The confirmation phrase must match `APPLY_DRIVE_ROLE_CLAIMS` exactly. This makes live claim assignment an explicit operator action rather than something that can happen from a vague mode name, copied sample, or accidental command.

## Why `adminFuture` Remains Blocked

`adminFuture` is still a planning label only. It must not become a broad bypass into athlete, coach, club, squad, or system access.

Future admin behaviour needs separate product, security, audit, and safeguarding approval before any claim can be applied.

## Why No Audit Records Are Written Yet

The script may print an audit-style summary, but it does not write audit records to Firestore or anywhere else.

Persisted audit records still need a later explicit server-side design covering storage location, retention, review process, Firestore rules or server-only access, and safeguarding expectations.

## Why No Service Account Files Are Committed

Firebase Admin credentials are privileged. This task does not create, request, reference, or commit service account files.

If a future approved live apply uses local credentials, they must come from standard local Admin SDK credential mechanisms and remain outside source control.

## Why The Script Was Not Run

Running `npm run apply:claims` is an operational rehearsal or live apply action. This task only implements the locked code path and documentation.

The script was not run, no deployment happened, `DRIVE_CLAIMS_LIVE_APPLY` was not set, Firebase custom claims were not set, and no audit records were written.

## What Future Agents Must Not Infer

Future agents must not infer from this implementation that:

- live claim setting should be run casually
- `DRIVE_CLAIMS_LIVE_APPLY` should be set without explicit approval
- service account files should be requested, created, stored, or committed
- sample files may contain real user ids, junior names, club-private data, or credentials
- `adminFuture` can be applied
- the client app may assign roles or set custom claims
- public signup or account creation is approved
- protected routes, redirects, or hidden preview routes are enabled
- the app should switch to Firebase repository mode
- Firestore reads or writes are approved in the app
- PM5 upload, submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written

## Deliberately Out Of Scope

This step intentionally excludes deployment, running `apply:claims`, setting real Firebase custom claims, enabling `DRIVE_CLAIMS_LIVE_APPLY`, creating service account files, writing audit records, Firestore reads, Firestore writes, public signup, account creation, client-side role assignment tools, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, app Firestore reads, app Firestore writes, PM5 upload, submit actions, approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
