# Trusted Claims Live Apply Reporting

## What Changed

Step 44 cleans up trusted claims reporting so dry run reports and live apply reports cannot contradict each other.

- Dry run output still clearly states that no Firebase custom claims were set, Firebase Admin was not initialised, no Firestore read or write happened, and no audit record was written.
- Live apply output now separates the planned audit summary, safety gate result, and final execution result.
- The shared audit helper no longer emits dry-run-only claim-setting checklist wording unless the caller explicitly asks for dry run reporting.

No deployment happened, `npm run apply:claims` was not run, `DRIVE_CLAIMS_LIVE_APPLY=true` was not set, and no new Firebase custom claims were set during this step.

## Why The Reporting Needed Separation

A successful live apply can set Firebase custom claims for a target user. Reusing dry-run-only audit checklist wording in that live report was confusing because it could say claim setting was avoided even after the final result correctly reported that claims were set.

Dry run reporting is validation-only. Live apply reporting must show both the plan and the outcome:

1. Planned audit summary.
2. Safety gate result.
3. Execution result.

Those are separate concerns and must not be collapsed into one generic checklist.

## Audit Draft Does Not Mean Audit Record Written

The audit helper still creates a planning draft only. It does not write Firestore records, create an audit collection, initialise Firebase Admin, call Firebase Auth, or mutate any data.

An audit draft means the proposed assignment has reviewable audit fields such as trusted actor id, audit reason, role, and claim scope. It does not mean an audit record exists in persistent storage.

## Claim Setting And Audit Writing Are Separate For Now

A successful live apply may set Firebase custom claims while still not writing an audit record yet. That is the current boundary: claim setting is guarded by the live apply safety gates, while audit persistence remains deliberately out of scope until a later approved server-side storage design.

Future work must not infer that a successful custom claim apply proves that audit persistence exists.

## Blocked Runs Must Be Explicit

When a live apply run is blocked, the final execution result must clearly say that no Firebase custom claims were set. Block reasons belong in the safety gate section, and the execution result must stay unambiguous.

This protects operators from confusing a planned audit summary or validation report with a successful mutation.

## Why This Step Did Not Run Live Apply

This step is a reporting cleanup only. Running `npm run apply:claims` is an operational action with access consequences, so it was deliberately not run.

`DRIVE_CLAIMS_LIVE_APPLY=true` was not set. Firebase Admin claim setting was not reached during validation, and no new custom claims were set during this cleanup.

## What Future Agents Must Not Infer

Future agents must not infer from this cleanup that:

- live apply should be run casually
- `DRIVE_CLAIMS_LIVE_APPLY` should be set
- audit records are now written
- Firestore audit storage exists
- service account files should be requested, created, stored, or committed
- the client app may assign roles or set custom claims
- public signup or account creation is approved
- protected routes, redirects, or hidden preview routes are enabled
- the app should switch to Firebase repository mode
- Firestore reads or writes are approved in the app
- PM5 upload, submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written

## Deliberately Out Of Scope

This step intentionally excludes deployment, running `apply:claims`, setting new Firebase custom claims, enabling `DRIVE_CLAIMS_LIVE_APPLY`, creating service account files, writing audit records, Firestore reads, Firestore writes, public signup, account creation, client-side role assignment tools, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, PM5 upload, submit actions, approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
