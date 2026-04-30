# DRIVE Claims Runbook

The trusted live claim apply runbook lives in `../docs/46-trusted-claims-live-apply-runbook.md`.

A guarded live claim apply script foundation exists at `src/applyRoleClaimAssignment.ts`, with the npm entry `npm run apply:claims -- <path-to-live-claim-json>`.

Step 42 implements the guarded Firebase Admin custom claim setting path behind the existing safety gates. Do not run it casually. It must refuse to apply unless `DRIVE_CLAIMS_LIVE_APPLY=true`, the input confirmation phrase is exactly `APPLY_DRIVE_ROLE_CLAIMS`, the requested apply mode is `live`, the proposed assignment validates, the audit draft is present, and the safety gate allows apply. `adminFuture` remains blocked.

Always review the dry run and a blocked rehearsal first. Real credentials must stay local and ignored. Do not add service account files to this workspace, do not commit credentials, and do not involve the client app in role assignment. The client app still cannot assign roles or set custom claims.

## Local Live Input Hygiene

Real live claim input files belong in `functions/live-inputs/` and must remain local. That folder is ignored by Git so real Firebase UIDs, junior athlete data, coach assignment data, club-private details, and operational rehearsal inputs do not enter source control.

Committed files in `functions/samples/` are fake examples only. They are safe to review because they use placeholder ids and example names, but they must never be edited into real assignment files or used as shortcuts for applying claims.

The first real test of a live input must be a blocked rehearsal: run the generic `apply:claims` script with a local file while leaving `DRIVE_CLAIMS_LIVE_APPLY` unset. It should refuse to apply and confirm that no Firebase custom claims were set.

Service account files are still not needed for that blocked rehearsal because the live apply environment flag remains disabled and Firebase Admin initialisation must not be reached. `DRIVE_CLAIMS_LIVE_APPLY` must stay unset until a later explicit live apply step approves real claim setting.
