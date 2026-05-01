# Firestore Rules Deployment Preflight

## Status

Step 52 adds a deployment preflight and runbook foundation for Firestore rules only.

No rules were deployed during this step. The app remains mock backed by default, no Firestore writes were performed, no app Firestore reads were run, no seed apply was run, and no Firebase custom claims were set.

## What Happened In The Firebase Read Smoke Test

After fake Firestore seed data had been applied and verified with functions-side Admin reads, the app repository read smoke test was run with:

```bash
EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=firebase
```

The observed result was:

- Requested provider mode: Firebase.
- Active provider mode: Firebase.
- Dataset under test: Firebase seeded example dataset.
- All read checks failed with `Missing or insufficient permissions`.

The app was then returned to the safe local defaults:

```bash
EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=mock
EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=preview
```

## Why This Is A Safe Failure

`Missing or insufficient permissions` is the right failure mode when the client app cannot prove it is authorised to read private junior training data. It means Firestore refused the app reads instead of falling open to public access.

For DRIVE, that is safer than a permissive misconfiguration. The product handles junior athlete training context, coach verification data, PM5 evidence references, and reward-sensitive progress, so blocked reads are preferable until rules, claims, and provider mode have all been deliberately checked.

## Why Rules Likely Need Deploying

The repository contains a local `firestore.rules` file and `firebase.json` points Firestore rules at that file. A local rules file does not affect a Firebase project until the rules are deliberately deployed.

Because the fake seed verification succeeded through trusted Admin reads while the client app received permission errors, the likely next infrastructure step is to deploy the intended Firestore rules to the expected Firebase project and then rerun the app Firebase read smoke test.

## Why Deployment Must Be Deliberate

Deploying Firestore rules changes the live access boundary for junior training data. A rules deployment can block legitimate test reads, accidentally widen access, or create a mismatch between auth claims, seeded fake data, and repository paths.

Any deployment must therefore be a manual, explicit Mikey action after reviewing local rules, Firebase config, project target, seed status, and app environment mode. This Cursor task does not deploy rules and must not be treated as deployment approval.

## Why The App Must Return To Mock After Testing

Firebase repository mode is for controlled local read testing only. The normal app preview should use:

```bash
EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=mock
EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=preview
```

Returning to mock after a Firebase test avoids accidentally connecting athlete, coach, or developer preview routes to live Firestore data while DRIVE is still hardening auth, rules, and workflow boundaries.

## Why No Real Junior Data Should Be Used

Rules deployment testing must use the fixed fake example dataset only. Real junior names, real Firebase UIDs, parent details, real club private data, service account material, and operational role assignment inputs must not be placed in committed files or ad hoc Firestore test records.

This protects DRIVE's safeguarding posture while still allowing infrastructure checks against known fake ids such as `example-club`, `example-j15-squad`, and `example-athlete`.

## Why The App Must Not Write Firestore

The app currently has read-only Firebase repository foundations for controlled testing. It must not write submissions, reward results, athlete progress, squad progress, PM5 evidence paths, or coach review outcomes.

Firestore writes are deliberately out of scope because they affect private training evidence, coach authority, reward integrity, and auditability. Submit, approve, reject, reward calculation, progress writes, and Storage upload all require later explicit workflow steps.

## Future Manual Checklist

### Before Deploy

- Confirm `git status` is clean.
- Confirm local `.env` is set back to `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=mock`.
- Confirm local `.env` is set back to `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=preview`.
- Confirm there is no real junior data in Firestore.
- Confirm fake seed verification passed.
- Review `firestore.rules`.
- Review `firebase.json`.
- Confirm the Firebase project is the expected project.
- Do not deploy Storage rules yet unless explicitly requested.

### Deploy Command For Later

Mikey may run this later after the checklist has been reviewed. It must not be run during this Cursor task.

```bash
firebase deploy --only firestore:rules
```

### After Deploy

- Wait briefly for rules propagation.
- Run the app Firebase read smoke test again with `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=firebase`.
- Return `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER` to `mock` after the test.
- Confirm `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE` remains `preview`.
- Confirm `git status` is clean.

## Local Preflight Script

The optional local preflight script checks repository files only:

```bash
cd functions
npm run preflight:rules
```

It reads `firestore.rules` and `firebase.json`, checks that Firebase config references the local rules file, checks expected collection match paths, warns on obvious public blanket read/write patterns, prints a report, and clearly states that no deploy happened.

It does not use Firebase Admin, does not contact Firestore, does not read or write Firestore data, does not mutate the app repository provider, and does not deploy rules.

## What Future Agents Must Not Infer

Future agents must not infer from this preflight foundation that:

- Firestore rules have been deployed.
- The app should switch to Firebase repository mode by default.
- App Firestore reads are now expected to pass before rules are deployed.
- App Firestore writes are approved.
- `firebase deploy` should be run automatically.
- `apply:seed` or `apply:claims` should be run.
- `DRIVE_FIRESTORE_SEED_APPLY=true` or `DRIVE_CLAIMS_LIVE_APPLY=true` should be set.
- Real junior data, real club data, or real Firebase UIDs should be created.
- Firebase Storage upload, PM5 upload, submit, approve, or reject actions exist.
- Reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, public profiles, messaging, OCR, Concept2 API, live PM5 Bluetooth, Unity, or Godot are approved.

## Deliberately Out Of Scope

This step intentionally excludes deployment, `firebase deploy`, Firestore app reads, Firestore writes, Firestore deletes, seed mutation, running `apply:seed`, running `apply:claims`, setting Firebase custom claims, enabling live apply environment flags, repository provider default changes, route protection default changes, Firebase Storage upload, PM5 upload, submit actions, approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, public profiles, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
