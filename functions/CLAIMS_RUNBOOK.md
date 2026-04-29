# DRIVE Claims Runbook

The trusted live claim apply runbook lives in `../docs/46-trusted-claims-live-apply-runbook.md`.

A guarded live claim apply script foundation exists at `src/applyRoleClaimAssignment.ts`, with the npm entry `npm run apply:claims -- <path-to-live-claim-json>`.

Do not run it casually. It must refuse to apply unless `DRIVE_CLAIMS_LIVE_APPLY=true`, the input confirmation phrase is exactly `APPLY_DRIVE_ROLE_CLAIMS`, the requested apply mode is `live`, the proposed assignment validates, the audit draft is present, and the safety gate allows apply. `adminFuture` remains blocked.

Always review the dry run first. Do not add service account files to this workspace, do not commit credentials, and do not involve the client app in role assignment. The client app still cannot assign roles or set custom claims.
