# Firestore Seed Verification Read

## What Was Added

Step 50 adds read-only Firestore seed verification tooling in the trusted `functions/` workspace:

- `functions/src/firestoreSeedVerification.ts` defines verification types, expected fake document checks, and report summary helpers.
- `functions/src/verifyFirestoreSeed.ts` reads the expected fake seeded document paths and reports whether each document exists and matches the planned fake ids.
- `functions/package.json` includes `verify:seed`.

This step does not connect the app to Firestore and does not change repository provider mode.

## Why Seed Verification Exists

The fake Firestore seed apply has now been run manually and succeeded. Before DRIVE can later test Firebase repository mode, the team needs a trusted server-side read check that the fake documents exist where the seed plan expects them.

The verifier compares the planned fake seed paths against the documents in Firestore for:

- `example-club`
- `example-j15-squad`
- `example-athlete`

It checks the fake club, squad, athlete, quest, submission, athlete progress, and squad progress documents only.

## Why It Reads Only Expected Fake Paths

The verification script builds the existing seed plan and reads only the document paths from that plan. It does not run broad collection scans, discover real clubs, search for juniors, or inspect unrelated Firestore data.

Keeping verification path-based protects the DRIVE boundary around junior athlete data and avoids normalising ad hoc test documents outside the planned fake dataset.

## Why It Does Not Write Firestore

`verify:seed` is a read-only diagnostic. It does not write documents, delete documents, mutate fields, run batch commits, run transactions, set custom claims, create users, upload PM5 evidence, calculate rewards, or update progress.

The guarded `apply:seed` workflow remains separate and must not be inferred from this read tool. Verification confirms the presence of fake example documents after an approved manual seed apply; it is not another apply mechanism.

## Why It Does Not Connect The App

The verifier lives in `functions/` and uses Firebase Admin only when the local script is run. No product screen imports it, no app repository calls it, and no Expo runtime configuration changes are required.

The repository provider remains mock backed by default. This step does not change `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER`, does not change `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE`, and does not make athlete or coach screens read live Firestore data.

## Why No Real Junior Data Is Used

The expected ids are obvious fake examples. The verification report is designed for the existing fake dataset only and does not require real junior names, parent details, real Firebase UIDs, service account files in the repository, or private club data.

This supports DRIVE's safeguarding posture while allowing controlled infrastructure checks before any future repository-mode testing.

## Relationship To The Successful Fake Seed Apply

The successful manual fake seed apply means fake example data should now exist in Firestore. Step 50 adds the read foundation needed to verify that result safely from the trusted functions workspace.

The verifier should report whether each expected fake document exists, whether expected ids still match `example-club`, `example-j15-squad`, and `example-athlete`, and whether any seeded document type marker disagrees with the planned type if such a marker is present.

## What Future Agents Must Not Infer

Future agents must not infer from this verification step that:

- The app should switch to Firebase repository mode.
- Product screens may read from Firestore.
- Product screens may write to Firestore.
- Seed verification is approval to run `apply:seed`.
- Seed verification is approval to run `apply:claims`.
- `DRIVE_FIRESTORE_SEED_APPLY=true` should be set.
- `DRIVE_CLAIMS_LIVE_APPLY=true` should be set.
- Real junior data, real club data, or real Firebase UIDs may be used.
- PM5 upload, submit, approve, or reject actions exist.
- Reward calculation exists.
- Reward results, athlete progress, or squad progress may be written from the app.

## Deliberately Out Of Scope

This step intentionally excludes deployment, app Firestore reads, app Firestore writes, repository provider switching, route protection mode changes, Firestore deletes, seed mutation, running `apply:seed`, running `apply:claims`, setting custom claims, Firebase Storage upload, PM5 upload, real submit actions, real approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
