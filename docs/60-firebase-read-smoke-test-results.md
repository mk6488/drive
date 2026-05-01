# Firebase Read Smoke Test Results

## Status

Step 53 records the first successful Firebase repository read smoke test after Firestore rules were deployed manually for DRIVE: Winter Quest.

The test proved that the seeded fake Firestore example dataset can be read through the active repository provider when Firebase mode is intentionally enabled. It did not broaden normal app behaviour: the repository provider was returned to mock afterwards, route protection remained in preview mode, and the working tree was clean after testing.

## What Was Tested

The developer-only repository read smoke test was run manually after rules propagation with Firebase repository mode intentionally enabled.

The smoke test read only the expected fake seeded example dataset through the repository provider:

- Dataset under test: Firebase seeded example dataset.
- Requested provider mode: Firebase.
- Active provider mode: Firebase.
- Overall result: Passed.
- Failed checks: none.

The passing fake ids were:

- Example athlete: `example-athlete`.
- Example squad: `example-j15-squad`.
- Example quest: `example-quest-rate-20`.
- Example submission: `example-submission-rate-20`.
- Example athlete progress: `example-athlete`.
- Example squad progress: `example-j15-squad`.

No real junior data, real club data, real Firebase UIDs, parent details, or private club records were used.

## Why Rules Were Deployed First

The previous Firebase repository read smoke test reached the seeded fake records through the app client but failed with `Missing or insufficient permissions`. That was the safer failure before deployed rules were confirmed because Firestore refused client reads rather than falling open.

Firestore rules were therefore deployed first so the client read smoke test could exercise the intended repository read boundary against the live project rules, instead of testing against stale or absent rules.

The manual deploy command was:

```bash
firebase deploy --only firestore:rules --project drive-winter-quest
```

Observed deploy result:

```text
Deploy complete!
```

Only Firestore rules were deployed. Storage rules were not deployed, Functions were not deployed, and no app deployment happened.

## Write And Upload Boundaries

This result is read-only. During this documentation step:

- No app Firestore writes were performed.
- No Firestore deletes were performed.
- No Firestore data was mutated.
- No `apply:seed` command was run.
- No `apply:claims` command was run.
- No Firebase custom claims were set.
- No Firebase Storage upload was tested.
- No PM5 upload was built or exercised.
- No submit, approve, or reject workflow was built.
- No athlete progress, squad progress, reward result, River Map, or Boathouse progress write was performed.
- No reward calculation was built.

## Current Safe State

The default local repository provider should remain `mock`. Firebase mode is for intentional, controlled repository read testing only.

Preview route protection remains the normal development mode. `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE` remained `preview` after the smoke test.

Seeded fake data exists in Firestore for controlled testing. The repository read path has now been proven against that fake dataset when Firebase mode is deliberately enabled.

App write workflows are still out of scope. Real junior data remains forbidden for repository smoke tests, seed examples, committed samples, and ad hoc Firestore records.

After testing, `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER` was returned to `mock`, route protection remained `preview`, and `git status` was clean.

## Future Test Checklist

- [ ] Test coach signed in with Firebase mode.
- [ ] Test athlete signed in with Firebase mode.
- [ ] Keep route protection preview unless explicitly testing enforcement.
- [ ] Confirm no Firestore writes occur from app screens.
- [ ] Confirm no Storage uploads occur.
- [ ] Return provider to mock after testing.
- [ ] Keep dev routes available.

## What Future Agents Must Not Infer

Future agents must not infer from this successful read smoke test that:

- Firebase is the default repository provider.
- Firebase mode should be left enabled after testing.
- Route protection enforcement should become the default.
- Real junior data or real club data may be created.
- Product workflows are ready for live Firestore data.
- App Firestore writes, deletes, or mutations are approved.
- Firebase Storage upload or PM5 upload exists.
- Submit, approve, or reject actions exist.
- Reward calculation exists.
- Reward results, athlete progress, squad progress, River Map progress, or Boathouse progress can be written from UI.
- Leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, or social features are approved.

## Deliberately Out Of Scope

This step intentionally excludes deployment, changing `.env`, changing repository provider defaults, changing route protection defaults, switching the app to Firebase mode by default, Firestore writes, Firestore deletes, seed mutation, running `apply:seed`, running `apply:claims`, setting Firebase custom claims, enabling live apply environment flags, Firebase Storage upload, PM5 upload, submit actions, approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, public profiles, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
