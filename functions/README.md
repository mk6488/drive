# DRIVE Functions Workspace

This workspace is for trusted server-side planning for DRIVE: Winter Quest. It is not deployed, it does not expose a live role assignment function, and normal project work must not set Firebase custom claims.

## Trusted Claims Dry Runs

The local dry run scripts validate fake claim assignment requests and print what would be assigned in a future trusted workflow:

```bash
npm run dryrun:coach
npm run dryrun:athlete
npm run dryrun:incomplete
```

Each dry run builds the TypeScript workspace, reads a local sample JSON file, validates it with the pure role claim validation helpers, and reports missing fields, invalid fields, proposed claims, and safeguarding messages.

No Firebase Admin SDK claim setting happens here. The dry run does not call `setCustomUserClaims`, does not create users, does not read Firestore, and does not write Firestore.

Dry run output is validation only. It can say that no claims were set and Firebase Admin was not initialised because the dry run path never performs live execution.

## Firestore Seed Dry Run

`npm run dryrun:seed` builds the functions workspace and previews a fake Firestore seed plan for `example-club`, `example-j15-squad`, and `example-athlete` only.

The seed dry run prints planned document paths, document types, validation messages, and safety warnings. It does not initialise Firebase Admin, does not read Firestore, does not write Firestore, does not create users, and does not upload PM5 evidence. No real junior data, real Firebase UIDs, parent details, service account data, or real club private data should ever be used in seed definitions or local seed input files.

## Firestore Seed Verification Read

`npm run verify:seed` builds the functions workspace and reads the expected fake Firestore seed document paths for `example-club`, `example-j15-squad`, and `example-athlete` only.

Use it after a deliberately approved fake seed apply to confirm that the planned fake club, squad, athlete, quest, submission, athlete progress, and squad progress documents exist and still match the expected fake ids. The command uses Firebase Admin only inside the local functions script when the command is run.

`npm run verify:seed` is read only. It does not write Firestore data, delete Firestore data, mutate seeded documents, set Firebase custom claims, create users, upload PM5 evidence, run reward processing, or connect the app to Firestore. The app repository provider remains mock backed until a later explicit step changes that boundary.

## Submission Write Dry Runs

Submission write dry runs are local and write-free. They preview future athlete draft and submit document shapes for fake example ids only:

```bash
npm run dryrun:submission:draft
npm run dryrun:submission:submit
npm run dryrun:submission:invalid
```

The dry run prints the planned submission document path, planned future document shape, validation status, and blocked reasons. It does not initialise Firebase Admin, read Firestore, write Firestore, upload PM5 evidence, write reward results, write athlete progress, or write squad progress.

`dryrun:submission:invalid` is expected to complete as a blocked rehearsal. Live submission draft saving, live submit for coach review, PM5 upload, and coach approve or reject actions are not implemented yet.

## Firestore Rules Deployment Preflight

`npm run preflight:rules` builds the functions workspace and checks local rule configuration files only. It reads `../firestore.rules` and `../firebase.json`, confirms Firebase config points at the local rules file, checks expected collection match paths, and warns if an obvious public blanket read/write rule appears.

`npm run preflight:rules` does not deploy rules, does not run `firebase deploy`, does not use Firebase Admin, does not contact Firestore, and does not read or write Firestore data. Real Firestore rules deployment remains a manual explicit step for later review.

## Guarded Firestore Seed Apply Foundation

A guarded seed apply script foundation now exists at `src/applyFirestoreSeed.ts`, with the npm entry `npm run apply:seed -- <path-to-local-seed-apply-json>`.

Do not run it casually. It refuses to write unless the operator passes a JSON file path, `DRIVE_FIRESTORE_SEED_APPLY=true` is set in the local runtime, the input confirmation phrase is exactly `APPLY_DRIVE_FIRESTORE_SEED`, the requested apply mode is `live`, the seed plan validates, the safety gate allows apply, and the input includes a trusted actor id, audit reason, and environment name.

No live seed apply has been run yet. Only fake example data for `example-club`, `example-j15-squad`, and `example-athlete` is allowed at this stage. The committed `samples/firestore-seed.example.json` file is a fake shape example only; real local seed inputs must stay ignored in `functions/seed-inputs/` or local `*.seed.local.json` files and must never contain credentials, real junior data, real Firebase UIDs, or real club private data.

The dry run remains safe and write free. `npm run dryrun:seed` must not initialise Firebase Admin, read Firestore, write Firestore, or require service account files. `npm run apply:seed` writes fake seed data only when explicitly enabled and all safety gates pass. `npm run verify:seed` reads fake seeded documents to confirm they exist, but it must not write or delete Firestore data. Firebase repository mode is also not enabled by any seed command; the app remains mock backed by default.

## Firebase Admin Readiness Check

`npm run admin:check` builds the functions workspace and runs a local Firebase Admin credential readiness diagnostic only. It attempts Firebase Admin initialisation through the existing trusted Admin boundary and reports whether local credentials are available, plus the project id if it can be resolved safely.

The diagnostic does not set claims, does not call `setCustomUserClaims`, does not create users, does not read or write Firestore, and does not deploy anything. It is not a live apply rehearsal and it is not approval to run `apply:claims`.

Credentials must stay local and must never be committed. This step still does not require service account files in the repository; use only standard local Admin SDK credential mechanisms outside source control.

## Trusted Claims Live Apply Runbook

See `../docs/46-trusted-claims-live-apply-runbook.md` and `CLAIMS_RUNBOOK.md` before any future claim apply work.

A guarded live apply script foundation now exists at `src/applyRoleClaimAssignment.ts`, with the npm entry `npm run apply:claims -- <path-to-live-claim-json>`.

Do not run it casually. It refuses to apply unless the operator passes a JSON file path, `DRIVE_CLAIMS_LIVE_APPLY=true` is set in the local runtime, the input confirmation phrase is exactly `APPLY_DRIVE_ROLE_CLAIMS`, the requested apply mode is `live`, validation passes, an audit draft can be created, and the safety gate allows apply. `adminFuture` remains blocked.

Step 42 implements the guarded Firebase Admin custom claim setting path behind those gates. Dry run output and a blocked rehearsal must always be reviewed before any real apply. Real credentials must stay local and ignored; do not commit service account files or local live inputs. The client app still cannot assign roles, promote users, or set custom claims.

Live apply output has a separate final execution result that says whether claims were set or were not set because the run was blocked or failed. Audit records are still not written yet; claim setting and audit writing are separate concerns until a later approved audit persistence step.

## Local Live Input Hygiene

Real live claim input files must stay local in `functions/live-inputs/`. That folder is ignored by Git, along with local live claim JSON patterns, so real Firebase UIDs, junior data, service account data, or operational role assignment inputs are not committed by accident.

Committed files in `functions/samples/` are fake examples only. `samples/live-coach-claim.example.json` is a safe rehearsal example with placeholder values; it must not contain real Firebase UIDs, real junior names, real club private data, or service account data, and it must not be treated as an apply shortcut.

The next safe rehearsal may run `npm run apply:claims -- <local-live-input-json>` without setting `DRIVE_CLAIMS_LIVE_APPLY=true`. That rehearsal should block on purpose and report that no Firebase custom claims were set. No live apply has been run yet.

## Secrets And Sample Data

Do not store service account keys in this workspace. No service account key is needed for the current dry run tool. If future local credentials are used for the guarded live script, they must stay local and must never be committed.

The files in `samples/` are fake local examples only. Do not put real junior names, real Firebase user ids, real Firebase config, parent details, service account data, or other sensitive data in sample files.
