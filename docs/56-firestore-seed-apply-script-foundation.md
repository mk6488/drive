# Firestore Seed Apply Script Foundation

## What Was Added

Step 49 adds a guarded Firestore seed apply foundation inside the `functions/` workspace:

- `functions/src/firestoreSeedApplySafetyGate.ts` defines pure seed apply safety gate types and helpers.
- `functions/src/applyFirestoreSeed.ts` builds the existing fake seed plan, validates it, evaluates the safety gate, prints a report, and refuses to write unless every live gate passes.
- `functions/samples/firestore-seed.example.json` provides a fake committed input shape only.
- `functions/package.json` includes `apply:seed`, which requires an explicit JSON file path.

No live seed apply was run during this step.

## Why A Guarded Seed Apply Script Exists

Before DRIVE can test Firebase repository mode, the team needs a reviewed way to create fake Firestore data that matches the expected Firestore paths and the existing test claim scope. The apply foundation keeps that future operation in the trusted functions workspace instead of the client app.

The seed data is only for controlled testing of fake records. It is not a product workflow, not junior onboarding, and not evidence upload.

## Why It Is Blocked By Default

Firestore writes affect private junior training data boundaries and future repository testing, so the script must be difficult to trigger accidentally. The apply command does nothing useful unless an operator provides a local input file and all safety checks pass.

Required runtime safety gates include:

- Seed plan validation status must be `valid`.
- `DRIVE_FIRESTORE_SEED_APPLY` must equal `true`.
- `confirmationPhrase` must exactly equal `APPLY_DRIVE_FIRESTORE_SEED`.
- `requestedApplyMode` must be `live`.
- The safety gate must allow apply.
- `trustedActorId`, `auditReason`, and `environmentName` must be present.
- Seed data must be fake example data only.
- Firebase Admin must be initialisable before any future write can be committed.

## Why The Fake IDs Must Match

The fake seed plan remains scoped to:

- `example-club`
- `example-j15-squad`
- `example-athlete`

Those IDs match the current fake test coach and athlete claim shapes. Keeping the IDs fixed lets future repository-mode testing check club, squad, and linked-athlete boundaries without inventing real club records or real junior data.

## Why No Firestore Writes Happened

This step only adds the guarded foundation. The `apply:seed` command was not run, `DRIVE_FIRESTORE_SEED_APPLY=true` was not set, and no Firestore write path was exercised.

The existing `dryrun:seed` command remains write free. It does not initialise Firebase Admin, read Firestore, write Firestore, create users, or upload PM5 evidence.

## Repository Provider Status

The repository provider remains mock backed by default. This step does not change `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER`, does not switch the app to Firebase repository mode, and does not make product screens read from Firestore.

## Why No Real Junior Data Is Allowed

DRIVE is for junior athletes aged 14 to 18, so committed samples and local seed inputs must avoid real junior names, real Firebase UIDs, parent details, private club data, credentials, and service account material.

The committed example input uses placeholder values only. Future local inputs must stay ignored under `functions/seed-inputs/` or local seed JSON patterns.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Firestore seed data has been written.
- Live seed apply is approved for casual use.
- `DRIVE_FIRESTORE_SEED_APPLY=true` should be set without explicit approval.
- Service account files should be created, requested, stored, or committed.
- The app should switch to Firebase repository mode.
- Product screens may read from or write to Firestore.
- Real junior data, real Firebase UIDs, or real club private data may be used in seed files.
- Firebase Storage upload, PM5 upload, submit, approve, or reject actions exist.
- Reward calculation exists.
- Reward results, athlete progress, squad progress, River Map progress, or Boathouse progress can be written from the app.

## Deliberately Out Of Scope

This step intentionally excludes deployment, running `apply:seed`, setting `DRIVE_FIRESTORE_SEED_APPLY=true`, running `apply:claims`, setting Firebase custom claims, enabling `DRIVE_CLAIMS_LIVE_APPLY`, Firestore app reads, Firestore app writes, repository provider switching, Firebase Storage upload, PM5 upload, real submit actions, real approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
