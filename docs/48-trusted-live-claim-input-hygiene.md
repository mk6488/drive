# Trusted Live Claim Input Hygiene

## What Was Added

Step 41 adds local input hygiene for future trusted live claim assignment rehearsals:

- `.gitignore` now excludes `functions/live-inputs/` and local live claim JSON patterns.
- `functions/samples/live-coach-claim.example.json` provides a fake live-mode coach claim example for review only.
- `functions/README.md` and `functions/CLAIMS_RUNBOOK.md` document where real local inputs belong and why they must not be committed.

No live apply script was run, `DRIVE_CLAIMS_LIVE_APPLY` was not set, Firebase Admin was not initialised, and no Firebase custom claims were set.

## Why Live Claim Inputs Must Stay Local

Future live claim inputs may contain Firebase UIDs, trusted actor ids, role assignment reasons, club scope, squad scope, and coach or athlete display names. Those values affect access to junior athlete training context, coach verification surfaces, private PM5 evidence, and future reward-sensitive progress.

Real inputs must stay local so operational assignment data, junior data, and club-private details do not enter source control or review artefacts.

## Why `functions/live-inputs/` Is Ignored

`functions/live-inputs/` is the intended local-only folder for future real rehearsal files. Ignoring the folder makes the safe path obvious while reducing the chance that a real Firebase UID or role assignment file is committed.

Additional local live JSON patterns are ignored for the same reason. They catch common filenames for one-off rehearsals without changing the guarded `apply:claims` script.

## Why Fake Samples Are Safe To Commit

Committed samples in `functions/samples/` must use fake data only. The new example uses placeholder values such as `example-firebase-uid-coach`, `example-trusted-actor`, `example-club`, and `Example Coach`.

The example exists to show the shape of a future live-mode input. It must not contain real Firebase UIDs, real junior names, real club private data, Firebase config, or service account data.

## Why The Example Must Not Be Used With Real Users

`functions/samples/live-coach-claim.example.json` is not an apply shortcut. It is committed documentation data only.

Future agents must not edit this sample into a real user file, wire it to an npm script, or make any command run it by default. Real rehearsal files must be created locally under `functions/live-inputs/` and remain ignored.

## Why No Apply Script Was Run

This step prepares hygiene only. Running `apply:claims` would be an operational rehearsal step, and running it with `DRIVE_CLAIMS_LIVE_APPLY=true` would be a live apply step.

Neither happened here. The guarded generic script remains present, but no shortcut scripts such as `apply:coach`, `apply:athlete`, `apply:live`, or `apply:test` were added.

## Why No Service Account File Is Needed Yet

The next safe rehearsal should deliberately block before Firebase Admin can be reached. It does not need service account files because the live apply environment flag must remain unset.

Service account files must not be requested, created, stored, or committed for this foundation.

## Why No Custom Claims Were Set

No custom claims were set because this step does not run live apply, does not enable `DRIVE_CLAIMS_LIVE_APPLY`, and does not initialise Firebase Admin.

The future blocked rehearsal should confirm the same outcome: the input can be parsed and reported, but Firebase custom claim writing remains blocked.

## Why The Next Rehearsal Should Block On Purpose

The next rehearsal should run the generic `apply:claims` command against a local ignored input while leaving `DRIVE_CLAIMS_LIVE_APPLY` unset. That proves the live input file shape can be rehearsed safely and that the safety gate refuses to set claims by default.

This protects DRIVE's safeguarding boundary before any real role claim is assigned.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- live claim setting is approved now
- `DRIVE_CLAIMS_LIVE_APPLY` should be set
- service account files should be requested, created, stored, or committed
- Firebase Admin initialisation should be reached during blocked rehearsal
- sample files may contain real user ids, junior names, club private data, or credentials
- sample files should be wired into apply shortcuts
- the client app may assign roles or set custom claims
- public signup, protected routes, or repository provider switching are approved
- Firestore reads or writes are approved

## Deliberately Out Of Scope

This step intentionally excludes deployment, running `apply:claims`, live claim setting, Firebase Admin initialisation, service account setup, public signup, account creation, client-side role assignment tools, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, Firestore reads, Firestore writes, PM5 upload, submit actions, approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
