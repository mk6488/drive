# Firebase Admin Credential Readiness Check

## What Was Added

Step 43 adds a local Firebase Admin credential readiness diagnostic inside the `functions/` workspace:

- `functions/src/checkFirebaseAdminReadiness.ts` attempts Firebase Admin initialisation only when the script is run.
- `functions/package.json` includes `admin:check`, which builds the functions workspace and runs the compiled diagnostic.
- `functions/src/firebaseAdmin.ts` remains a lazy Admin boundary and now gives local credential guidance without requiring repository service account files.

No deployment happened, no Firebase custom claims were set, and no Firestore reads or writes were added.

## Why Readiness Is Checked Before Live Claims

DRIVE role claims will eventually decide access to junior athlete training context, private PM5 evidence, coach verification surfaces, and reward-sensitive progress. Before any real claim apply can be approved, the trusted functions workspace needs a safe way to confirm that local Firebase Admin credentials are available.

This check is deliberately separate from `apply:claims`. It helps identify local credential setup issues before a future approved live apply, without changing any Firebase user or DRIVE data.

## Why This Does Not Set Custom Claims

The diagnostic never calls `setCustomUserClaims` and never builds a custom claim payload. It only initialises Firebase Admin through the existing trusted boundary and probes whether credentials are available to the local process.

A passing `admin:check` is not approval to apply claims. Future live apply still requires dry run review, blocked rehearsal review, explicit approval, `DRIVE_CLAIMS_LIVE_APPLY=true`, the exact confirmation phrase, and all safety gates.

## Why This Does Not Read Or Write Firestore

The readiness check does not import Firestore helpers, open collections, read documents, write documents, create audit records, or test repository behaviour.

Firestore data involves private junior athlete records, coach verification context, and reward-sensitive progress. Credential readiness is only an infrastructure diagnostic, so it must not exercise live data paths.

## Why No Service Account File Is Required Yet

This step does not ask for, create, reference, or commit a service account file. The Admin boundary uses standard local Admin SDK credential mechanisms and keeps credential setup outside the repository.

Service account files and local credential material must stay out of source control. The repository is not the place for privileged Firebase credentials.

## Safe Claim Apply Sequence

The intended safe sequence before any future live claim apply is:

1. Run and review the trusted claims dry run.
2. Run and review a blocked rehearsal with `DRIVE_CLAIMS_LIVE_APPLY` unset.
3. Run `admin:check` locally to confirm credential readiness.
4. Obtain a separate explicit approval for live apply.
5. Only then consider the guarded live apply process with every safety gate satisfied.

This step only adds item 3. It does not approve or run live apply.

## What Future Agents Must Not Infer

Future agents must not infer from this diagnostic that:

- live claim setting is approved
- `apply:claims` should be run casually
- `DRIVE_CLAIMS_LIVE_APPLY` should be set
- service account files should be created, requested, referenced, stored, or committed
- the client app may assign roles or set custom claims
- public signup or account creation is approved
- protected routes, redirects, or hidden preview routes are enabled
- the app should switch to Firebase repository mode
- Firestore reads or writes are approved in the app or functions workspace
- audit records may now be written
- PM5 upload, submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written

## Deliberately Out Of Scope

This step intentionally excludes deployment, running `apply:claims`, setting real Firebase custom claims, enabling `DRIVE_CLAIMS_LIVE_APPLY`, creating service account files, writing Firestore, reading Firestore, creating users, writing audit records, public signup, account creation, client-side role assignment tools, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, app Firestore reads, app Firestore writes, PM5 upload, submit actions, approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
