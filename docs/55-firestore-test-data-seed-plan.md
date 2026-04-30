# Firestore Test Data Seed Plan

## What Was Added

Step 48 adds a safe Firestore test data seed planning foundation for DRIVE: Winter Quest:

- `functions/src/firestoreSeedData.ts` defines static fake example seed records only.
- `functions/src/firestoreSeedPlan.ts` builds and validates a pure dry-run plan with Firestore document paths.
- `functions/src/dryRunFirestoreSeed.ts` prints the planned paths, document types, validation messages, and safety warnings.
- `functions/package.json` includes `dryrun:seed`.

This step does not write seed data to Firestore.

## Why Fake Seed Data Is Needed

Before DRIVE can safely test Firebase repository mode, the team needs one reviewed fake dataset that matches the expected Firestore paths and domain field names.

That reduces the risk of ad hoc documents, field-name drift, real junior data entering local examples, or future tests using records that do not match the app's repository mapping.

## Why It Matches The Test Claims

The seed plan uses only the current fake test scope:

- `example-club`
- `example-j15-squad`
- `example-athlete`

Those ids line up with the test coach and athlete claim shapes, so future controlled repository testing can reason about club, squad, and linked athlete boundaries without inventing private or real club records.

## Why This Step Does Not Write Firestore

The new seed plan is dry-run only. It builds strings, validates fake records, and prints planned output from the functions workspace.

It does not import Firebase Admin, initialise Firebase Admin, read Firestore, write Firestore, create users, deploy functions, or run any live seed process.

## Why No Real Junior Data Is Allowed

DRIVE handles junior athletes aged 14 to 18, so seed examples must avoid unnecessary or real personal data. Seed data must not include real junior names, real Firebase UIDs, parent details, service account data, real club private data, or operational claim input.

The committed records use obvious fake ids and example display names only.

## Submission Review Fields

Submitted seed submissions should omit `reviewedByUserId`, `reviewedAt`, and `coachNote` until coach review exists. They should not store those review fields as `null`.

This keeps fake seed data aligned with the current Firestore mapper and domain model, where review fields are optional before a submission is verified or rejected.

## Live Seed Application Status

Live seed application is a privileged operational workflow. It needs explicit approval, Firestore rules review, data ownership checks, audit expectations, and a clear decision about whether test data may be written to a Firebase project.

Step 48 did not add a write-capable seed script and did not write Firestore. Step 49 later added `apply:seed` as a separate guarded foundation only; it must not be run casually and remains blocked unless every live safety gate is explicitly satisfied.

## Repository Provider Status

The repository provider remains mock backed by default. This step does not change `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER`, does not switch app screens into Firebase repository mode, and does not make product routes read live Firestore data.

## Firestore Rules Remain Separate

Firestore rules deployment and testing remain separate future work. The dry-run plan can help future agents understand intended paths, but it is not a rules deployment, emulator test, live rules test, or proof that reads and writes are allowed.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Firestore seed data has been written.
- Live seed scripts are approved for casual use.
- Firebase Admin should be initialised by seed dry runs.
- The app should switch to Firebase repository mode.
- Firestore reads or writes are approved.
- Real junior data or real club private data may be used in seed files.
- Firebase Storage upload, PM5 upload, submit, approve, or reject actions exist.
- Reward calculation exists.
- Athlete progress, squad progress, River Map progress, Boathouse progress, or reward results can be written from the app.

## Deliberately Out Of Scope

This step intentionally excludes deployment, Firestore reads, Firestore writes, running live seed application, Firebase Admin initialisation for seed dry runs, user creation, custom claim setting, running `apply:claims`, enabling `DRIVE_CLAIMS_LIVE_APPLY`, repository provider switching, Firebase Storage upload, PM5 upload, submit actions, approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
