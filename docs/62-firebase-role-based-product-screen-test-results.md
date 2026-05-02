# Firebase Role-Based Product Screen Test Results

## Status

Step 55 records successful role-based Firebase product screen testing for DRIVE: Winter Quest.

This test happened after the general Firebase product screen test in `docs/61-firebase-product-screen-manual-test-results.md` because Step 54 proved the current preview screens could load in Firebase repository mode. Step 55 then checked the same read-only Firebase path while signed in as fake coach and athlete Firebase test users, so the role boundary messaging could be reviewed against the central route access rules.

## Temporary Test Configuration

Local `.env` was temporarily set to:

```bash
EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=firebase
EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=preview
```

The test used fake Firebase test users only. No real junior account was used, no real junior data was used, and no real club data was created.

Route protection remained in preview mode throughout the test. No redirects were expected or used. After testing, `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER` was returned to `mock`, `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE` remained `preview`, and `git status` was clean.

## Coach Scenario

- Signed in as the fake coach Firebase test user.
- Role shown: `coach`.
- `/coach` loaded.
- `/coach/verification` loaded.
- `/coach/quest-builder` loaded.
- `/athlete` remained visible because route protection was in preview mode, but showed future access not authorised.
- `/dev/role-access-smoke-test` loaded.
- `/dev/repository-read-smoke-test` loaded.
- No permission errors occurred.
- No crashes occurred.

## Athlete Scenario

- Signed out of the coach test user.
- Signed in as the fake athlete Firebase test user.
- Role shown: `athlete`.
- `/athlete` loaded.
- `/athlete/submission` loaded.
- `/athlete/progress` loaded.
- `/athlete/boathouse` loaded.
- `/coach` remained visible because route protection was in preview mode, but showed future access not authorised.
- `/dev/role-access-smoke-test` loaded.
- `/dev/repository-read-smoke-test` loaded.
- No permission errors occurred.
- No crashes occurred.

## Write And Upload Boundaries

This was a read-only manual screen test:

- No app Firestore writes were performed.
- No Firestore deletes were performed.
- No Firestore data was mutated.
- No Firebase Storage upload was tested.
- No PM5 upload workflow was built or exercised.
- No submit, approve, or reject action was built or exercised.
- No athlete progress, squad progress, reward result, River Map, or Boathouse progress write was performed.
- No reward calculation was built.

## Key Interpretation

Firebase repository mode can read fake seeded data for both coach and athlete test roles when it is intentionally enabled for local testing. Route protection preview mode keeps product screens visible for development review while still showing role boundary messaging.

Future enforced mode should block the opposite role area: coaches should not access athlete-only areas, and athletes should not access coach-only areas. This preview-mode result must not be mistaken for production access control.

Firestore rules and route access rules remain separate safety layers. Firestore rules govern data reads and future writes at the database boundary, while route access rules govern app route decisions. No write workflows are enabled yet.

## Future Test Checklist

- [ ] Repeat the same test with route protection mode enforced.
- [ ] Confirm a coach is blocked from the athlete area in enforced mode.
- [ ] Confirm an athlete is blocked from the coach area in enforced mode.
- [ ] Keep developer routes available during development.
- [ ] Confirm no Firestore writes occur from product screens.
- [ ] Return provider to mock after testing.
- [ ] Return route protection to preview after testing.

## What Future Agents Must Not Infer

Future agents must not infer from this successful role-based screen test that:

- Firebase is the default repository provider.
- Firebase mode should be left enabled after testing.
- Route protection preview is production access control.
- Route protection enforcement should become the default.
- Real junior data or real club data may be created.
- App Firestore writes, deletes, or mutations are approved.
- Firebase Storage upload or PM5 upload exists.
- Submit, approve, or reject actions exist.
- Reward calculation exists.
- Reward results, athlete progress, squad progress, River Map progress, or Boathouse progress can be written from UI.
- Leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, or social features are approved.

## Deliberately Out Of Scope

This step intentionally excludes deployment, changing `.env`, changing repository provider defaults, changing route protection defaults, switching the app to Firebase mode by default, Firestore writes, Firestore deletes, seed mutation, running `apply:seed`, running `apply:claims`, setting Firebase custom claims, enabling live apply environment flags, Firebase Storage upload, PM5 upload, submit actions, approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, public profiles, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
