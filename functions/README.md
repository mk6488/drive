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

Live seed application is not implemented yet. Do not add or run `seed:apply`, `seed:live`, or any script that writes Firestore without a later explicit approval step. Firebase repository mode is also not enabled by this dry run; the app remains mock backed by default.

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
