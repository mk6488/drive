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

## Trusted Claims Live Apply Runbook

See `../docs/46-trusted-claims-live-apply-runbook.md` and `CLAIMS_RUNBOOK.md` before any future claim apply work.

A guarded live apply script foundation now exists at `src/applyRoleClaimAssignment.ts`, with the npm entry `npm run apply:claims -- <path-to-live-claim-json>`.

Do not run it casually. It refuses to apply unless the operator passes a JSON file path, `DRIVE_CLAIMS_LIVE_APPLY=true` is set in the local runtime, the input confirmation phrase is exactly `APPLY_DRIVE_ROLE_CLAIMS`, the requested apply mode is `live`, validation passes, an audit draft can be created, and the safety gate allows apply. `adminFuture` remains blocked.

Dry run output should always be reviewed first. The client app still cannot assign roles, promote users, or set custom claims.

## Local Live Input Hygiene

Real live claim input files must stay local in `functions/live-inputs/`. That folder is ignored by Git, along with local live claim JSON patterns, so real Firebase UIDs, junior data, service account data, or operational role assignment inputs are not committed by accident.

Committed files in `functions/samples/` are fake examples only. `samples/live-coach-claim.example.json` is a safe rehearsal example with placeholder values; it must not contain real Firebase UIDs, real junior names, real club private data, or service account data, and it must not be treated as an apply shortcut.

The next safe rehearsal may run `npm run apply:claims -- <local-live-input-json>` without setting `DRIVE_CLAIMS_LIVE_APPLY=true`. That rehearsal should block on purpose and report that no Firebase custom claims were set. No live apply has been run yet.

## Secrets And Sample Data

Do not store service account keys in this workspace. No service account key is needed for the current dry run tool. If future local credentials are used for the guarded live script, they must stay local and must never be committed.

The files in `samples/` are fake local examples only. Do not put real junior names, real Firebase user ids, real Firebase config, parent details, service account data, or other sensitive data in sample files.
