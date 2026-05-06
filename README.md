# DRIVE: Winter Quest

DRIVE is a gamified junior rowing erg training app for athletes aged 14 to 18.

The first product is **DRIVE: Winter Quest**, a coach verified winter training loop where athletes complete erg quests, upload PM5 screen evidence, reflect on the session, and earn rewards only after coach verification.

## Core Philosophy

DRIVE must reward execution quality, not just completion.

The product should reward pacing discipline, rate control, consistency, honest uploads, useful reflection, improvement, good training habits, and coach verified effort.

## MVP Loop

1. Coach creates weekly erg quests.
2. Athlete completes the erg session.
3. Athlete uploads a PM5 screen photo.
4. Athlete adds a short reflection.
5. Coach verifies or rejects the upload.
6. Rewards unlock after coach verification.
7. Squad mission progress updates.
8. River Map or Boathouse progress updates.

## MVP Boundaries

The MVP deliberately excludes:

- OCR
- Concept2 Logbook API integration
- Live PM5 Bluetooth
- Unity or Godot
- Pure speed leaderboards
- Metres-only rewards
- Generic workout tracking

## Documentation

Future work must read these documents before implementation:

- `docs/00-product-brief.md`
- `docs/01-mvp-scope.md`
- `docs/02-game-design-rules.md`
- `docs/03-reward-system.md`
- `docs/04-user-roles-and-safeguarding.md`
- `docs/05-technical-architecture.md`
- `docs/06-firestore-schema.md`
- `docs/07-build-roadmap.md`
- `docs/08-definition-of-done.md`
- `docs/09-development-setup.md`
- `docs/10-ui-and-navigation-shell.md`
- `docs/11-domain-model-and-repository-boundaries.md`
- `docs/12-athlete-todays-quest-screen.md`
- `docs/13-athlete-pm5-submission-shell.md`
- `docs/14-coach-verification-queue-shell.md`
- `docs/15-submission-status-and-verification-gate.md`
- `docs/16-reward-rules-foundation.md`
- `docs/17-submission-lifecycle-timeline.md`
- `docs/18-controlled-lifecycle-preview-harness.md`
- `docs/19-coach-quest-builder-shell.md`
- `docs/20-quest-template-catalogue.md`
- `docs/21-squad-mission-and-river-map-shell.md`
- `docs/22-boathouse-builder-shell.md`
- `docs/23-repository-provider-foundation.md`
- `docs/24-submission-and-verification-command-boundaries.md`
- `docs/25-auth-and-role-boundary-foundation.md`
- `docs/26-firebase-app-and-environment-foundation.md`
- `docs/27-firestore-security-rules-foundation.md`
- `docs/28-storage-rules-and-pm5-evidence-paths.md`
- `docs/29-firebase-auth-service-foundation.md`
- `docs/30-controlled-auth-provider-shell.md`
- `docs/31-role-gate-and-route-access-foundation.md`
- `docs/32-protected-route-component-foundation.md`
- `docs/33-preview-route-boundary-wrapping.md`
- `docs/34-firestore-and-storage-service-foundation.md`
- `docs/35-firestore-domain-mapping-foundation.md`
- `docs/36-firestore-read-repository-foundation.md`
- `docs/37-repository-provider-mode-foundation.md`
- `docs/38-repository-provider-status-preview.md`
- `docs/39-firebase-connection-status-preview.md`
- `docs/40-auth-role-claims-diagnostic-foundation.md`
- `docs/41-trusted-role-assignment-boundary.md`
- `docs/42-trusted-claims-function-workspace.md`
- `docs/43-trusted-claims-dry-run-tool.md`
- `docs/44-trusted-role-assignment-audit-trail.md`
- `docs/45-trusted-claim-apply-safety-gate.md`
- `docs/46-trusted-claims-live-apply-runbook.md`
- `docs/47-trusted-claims-live-apply-script-foundation.md`
- `docs/48-trusted-live-claim-input-hygiene.md`
- `docs/49-trusted-claims-live-apply-implementation.md`
- `docs/50-firebase-admin-credential-readiness-check.md`
- `docs/51-trusted-claims-live-apply-reporting.md`
- `docs/52-role-access-smoke-test-preview.md`
- `docs/53-protected-route-enforcement-mode-foundation.md`
- `docs/54-protected-route-manual-test-results.md`
- `docs/55-firestore-test-data-seed-plan.md`
- `docs/56-firestore-seed-apply-script-foundation.md`
- `docs/57-firestore-seed-verification-read.md`
- `docs/58-repository-read-smoke-test-preview.md`
- `docs/59-firestore-rules-deployment-preflight.md`
- `docs/60-firebase-read-smoke-test-results.md`
- `docs/61-firebase-product-screen-manual-test-results.md`
- `docs/62-firebase-role-based-product-screen-test-results.md`
- `docs/63-firebase-enforced-route-manual-test-results.md`
- `docs/64-foundation-checkpoint-and-next-phase-plan.md`
- `docs/65-submission-write-boundary-review-and-plan.md`
- `docs/66-submission-write-command-service-foundation.md`
- `docs/67-submission-write-plan-manual-test-results.md`
- `docs/68-submission-write-dry-run-tool.md`

Use `docs/08-definition-of-done.md` before finishing substantive tasks to check scope, safeguarding, architecture boundaries, verification-gated rewards, and final reporting.

## Cursor Rules

Project rules live in `.cursor/rules/` and are intended to keep future agent work aligned with the DRIVE brief.

## Current Safe Defaults

- Repository provider: `mock`.
- Route protection: `preview`.
- Real junior data: not used.
- Submission write workflows: not implemented yet; Step 59 submission write plans are preview-only and do not write Firestore. Step 60 recorded the first manual preview check. Step 61 adds a functions-side submission write dry run tool only; live submission writes are still not implemented.

## Development Setup

Install dependencies:

```bash
npm install
```

`.env.example` lists the repository provider mode variable and the Expo public Firebase variables reserved for future Firebase work. Real Firebase values are not required for the current mock-backed preview, and real `.env` files must stay local.

The current app still runs as a mock-backed preview by default. Setting `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=firebase` is for intentional controlled repository testing only and requires complete Firebase config; normal preview mode does not require a Firebase project or real Firebase values.

Route protection defaults to preview mode. `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=enforced` is required to activate protected route blocking inside already wrapped route boundaries; preview mode remains the normal behaviour and does not redirect, hide public or developer routes, or protect unwrapped routes. After local enforced-mode testing, local `.env` files should be returned to `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=preview`.

A `functions/` workspace exists for future trusted role claim assignment only. It is not deployed and does not create a live role assignment endpoint. The local dry run validates fake sample claim assignments and prints audit-style planning output plus a future apply safety gate section only; it does not write audit records or real claims. Step 40 adds a guarded trusted claims live apply script foundation only. Step 41 adds trusted live claim input hygiene only: real live claim input files must stay local and out of Git, fake committed samples remain examples only. Step 42 adds a guarded live apply implementation behind the existing safety gates only. Step 43 adds a Firebase Admin credential readiness check only. Step 44 cleans up trusted claims reporting only so dry run validation wording and live apply execution results are clearly separated. Step 45 adds a role access smoke test preview only for inspecting the current signed-in session's expected access decisions. Step 46 adds protected route enforcement mode foundations only. Step 47 records manual protected route testing only, including the restored preview-mode expectation for local `.env`. Step 48 adds Firestore test data seed planning and `dryrun:seed` output only. Step 49 adds a guarded Firestore seed apply script foundation only. The fake example seed data has since been applied manually for `example-club`, `example-j15-squad`, and `example-athlete`; Step 50 adds read-only seed verification tooling to confirm those fake documents exist. Step 51 adds a developer-only repository read smoke test preview for checking the mock preview dataset in mock mode and the seeded Firestore example dataset in Firebase mode through the active provider. Step 52 adds Firestore rules deployment preflight documentation and a local rules preflight script only; it does not deploy rules or contact Firestore. Step 53 records that after Firestore rules were manually deployed, the Firebase repository read smoke test passed against the seeded fake example dataset. Step 55 records successful role-based Firebase product screen testing for fake coach and athlete test users only. Step 56 records successful Firebase repository mode testing with route protection temporarily enforced for fake coach and athlete Firebase test users only. The app still uses mock repositories and preview route protection by default after testing, no new claim apply was run, `DRIVE_CLAIMS_LIVE_APPLY` was not set, and no new custom claims were set. The client app still cannot assign roles, promote users, or decide coach access by itself.

Start the Expo development server:

```bash
npm run start
```

Run typecheck:

```bash
npm run typecheck
```

Run lint:

```bash
npm run lint
```

Developer lifecycle preview route:

```bash
/dev/submission-lifecycle
```

This route is for reviewing the four submission lifecycle states only. It is not a product workflow and does not upload,
submit, approve, reject, calculate rewards, or write progress.

Developer role access preview route:

```bash
/dev/role-access
```

This route is for reviewing future route access decisions only. It does not protect routes, redirect users, hide preview
routes, create accounts, read Firestore, or switch the repository provider away from mocks.

Developer protected route boundary preview route:

```bash
/dev/protected-route-boundary
```

This route is for reviewing the protected route component foundation only. Protected routes are still not enabled: it
does not redirect users, hide children, wrap product routes, read Firestore, or switch the repository provider away from
mocks.

Developer repository provider status preview route:

```bash
/dev/repository-provider
```

This route can be used to inspect requested and active provider mode without connecting to live data. It does not read
Firestore, write Firestore, test Storage, upload PM5 evidence, or require a Firebase project for normal preview mode.

Developer repository read smoke test preview route:

```bash
/dev/repository-read-smoke-test
```

This route can be used to manually test read-only loading of expected fake repository records through the active provider.
Mock mode checks the mock preview dataset by default. Firebase mode checks only the seeded Firestore example dataset when
it is intentionally enabled with env configuration. The route does not switch provider mode, write or delete Firestore
data, upload to Storage, or prove product workflows are ready.

Developer submission write plan preview route:

```bash
/dev/submission-write-plan
```

This route previews pure athlete draft and submit-for-review write plans with fake ids only. It does not write Firestore,
upload to Storage, save live drafts, submit work for coach review, calculate rewards, or write progress.

Developer Firebase connection status preview route:

```bash
/dev/firebase-status
```

This route can be used to check local Firebase config and run an explicit Firebase app initialisation check without
touching live data. The app remains mock backed by default and this preview does not read Firestore, write Firestore,
test Storage upload, or sign in with Firebase Auth.

Developer auth claims diagnostic preview route:

```bash
/dev/auth-claims
```

This route can be used to inspect whether the current Firebase Auth session has complete DRIVE role claims. A signed-in
test user without role claims should show "Account is not ready for DRIVE access yet". The diagnostic does not assign
claims, create accounts, protect routes, read Firestore, write Firestore, or upload PM5 evidence.

Developer role access smoke test preview route:

```bash
/dev/role-access-smoke-test
```

This route can be used to inspect the current signed-in session's expected access decisions for public, athlete, coach,
developer, and future admin areas. It is diagnostic only: protected routes are still not enabled, preview routes remain
visible, Firestore is not read or written, and the repository provider remains mock backed.

Developer trusted role assignment boundary preview route:

```bash
/dev/role-assignment-boundary
```

This route can be used to inspect the future trusted role assignment boundary. It is planning only and does not assign
roles, set custom claims, create accounts, read Firestore, write Firestore, or expose admin tools.

## Current Status

This repository currently contains DRIVE guardrails, the Step 2 Expo React Native TypeScript app foundation, the Step 3 static UI shell, Step 4 domain model plus mock repository boundaries, Step 5's mock-backed athlete Today's Quest screen, Step 6's athlete PM5 evidence submission shell preview, Step 7's coach verification queue shell preview, Step 8's shared submission status plus reward gate foundation layer, Step 9's reward rules design foundation, Step 10's submission lifecycle timeline foundation, Step 11's developer-only lifecycle preview harness, Step 12's coach quest builder shell preview, Step 13's static quest template catalogue with a local template picker only, Step 14's preview-only squad mission and River Map progress shell, Step 15's preview-only Boathouse Builder shell, Step 16's mock-backed repository provider foundation only, Step 17's submission and verification command boundary foundation only, Step 18's auth and role boundary foundation only, Step 19's Firebase app and environment boundary foundation only, Step 20's Firestore rules, indexes, config, and path foundation only, Step 21's Firebase Storage rules and PM5 evidence path foundations only, Step 22's Firebase Auth service foundation and sign in shell only, Step 23's controlled Auth Provider shell only, Step 24's role gate and route access foundation only, Step 25's protected route component foundation only, Step 26's preview-only route boundary wrapping for athlete and coach preview routes, Step 27's lazy Firestore and Storage service helpers only, Step 28's pure Firestore document and domain mapping foundations only, Step 29's disconnected Firestore read repository foundations only, Step 30's repository provider mode foundation only, Step 31's developer-only repository provider status preview only, Step 32's Firebase connection status preview only, Step 33's Firebase Auth role claims diagnostics only, Step 34's trusted role assignment boundary foundations only, Step 35's trusted claims functions workspace foundation only, Step 36's trusted claims dry run tool only, Step 37's trusted role assignment audit trail foundations only, Step 38's trusted claim apply safety gate foundation only, Step 39's trusted claims live apply runbook only, Step 40's guarded trusted claims live apply script foundation only, Step 41's trusted live claim input hygiene only, Step 42's guarded trusted claims live apply implementation only, Step 43's Firebase Admin credential readiness check only, Step 44's trusted claims reporting cleanup only, Step 45's role access smoke test preview only, Step 46's protected route enforcement mode foundations only, Step 47's protected route manual test documentation only, Step 48's Firestore test data seed planning plus dry-run output only, Step 49's guarded Firestore seed apply script foundation only, Step 50's Firestore seed verification read tooling only, Step 51's developer-only repository read smoke test preview only, Step 52's Firestore rules deployment preflight foundation only, Step 53's Firebase read smoke test results documentation only, Step 54's Firebase product screen manual test results documentation only, Step 55's role-based Firebase product screen test results documentation only, Step 56's Firebase enforced route manual test results documentation only, Step 57's foundation checkpoint and next phase plan documentation only, Step 58's submission write boundary review and implementation plan documentation only, Step 59's pure submission write command service foundation only, Step 60's submission write plan preview manual test documentation only, and Step 61's functions-side submission write dry run tool only. Fake seed data has been applied manually for the fixed example ids, and after Firestore rules were manually deployed, Firebase read smoke testing passed against that fake dataset. Step 54 recorded that the current product preview screens loaded successfully in Firebase repository mode against fake seeded data without permission errors or crashes. Step 55 recorded successful fake coach and athlete Firebase test-user product screen checks while route protection remained preview-only. Step 56 recorded successful fake coach and athlete Firebase test-user route checks while route protection was temporarily enforced. Step 57 records the current safe defaults and recommends the next phase begin with submission write boundary planning before any reward or progress writes. Step 58 expands that planning, Step 59 adds preview-only write command planning, Step 60 records the first manual preview check, and Step 61 adds local dry-run rehearsal output; no live submission writes, Firestore writes, or Storage uploads are implemented yet. The app still uses mock repositories and preview route protection by default after testing, and product screens remain disconnected from Firestore unless Firebase mode is intentionally configured.

Step 11 adds `/dev/submission-lifecycle` as a local-state preview for draft, submitted, verified, and rejected lifecycle states only. Real lifecycle actions, reward calculation, and trusted reward/progress writes remain intentionally out of scope.

Step 12 adds `/coach/quest-builder` as a local-state coach quest builder shell only. It previews training quality target language and attribute focus, but does not save quests, write repositories, mutate mock data, calculate rewards, unlock badges, or write progress.

Step 13 adds static rowing quest templates and a local-only picker for the coach builder. Template selection fills draft preview state only; it does not create real quests, write repositories, mutate mock data, calculate rewards, or unlock badges.

Step 14 adds `/athlete/progress` as a read-only preview for squad mission and River Map progress. Static preview data shows quality-based squad contribution only; it does not write progress, calculate rewards, mutate mock data, or create leaderboards.

Step 15 adds `/athlete/boathouse` as a read-only Boathouse Builder shell. Static preview resources and upgrades show how future coach verified training quality could build a shared rowing space; it does not write progress, calculate rewards, mutate mock data, or create leaderboards.

Step 16 adds a mock-backed repository provider foundation so product screens depend on repository contracts rather than direct mock imports. It does not add Firebase, authentication, environment switching, real writes, reward calculation, or provider selection beyond the mock provider.

Step 17 adds TypeScript command input types, pure validation helpers, and pure verification boundary helpers for future submission and coach review workflows. It does not expose command writes through the repository provider, mutate mock data, upload PM5 evidence, submit, approve, reject, calculate rewards, or write progress.

Step 18 adds auth role types, pure role access helpers, static preview sessions, and presentational role-boundary UI copy. It does not add Firebase Auth, real login or signup, user creation, auth state persistence, protected routes, role enforcement against live data, or admin functionality.

Step 19 adds the official Firebase SDK, placeholder-only Firebase environment variable guidance, and controlled Firebase app initialisation helpers. It does not add Firebase Auth, Firestore, Storage upload, Firebase repositories, repository provider switching, real workflow actions, or screen-level Firebase imports.

Step 20 adds planning-level Firestore security rules, a minimal indexes placeholder, Firebase config references for those files, and pure Firestore path helpers. Firestore is not connected to the app yet: there are no Firestore repositories, no app reads or writes, and no provider switch away from mock repositories.

Step 21 adds planning-level Firebase Storage rules for private PM5 evidence and pure Storage path helpers. Firebase Storage is not connected to the app yet: there is no Storage initialisation in app code, no image picking, no upload workflow, and no public file access.

Step 22 adds lazy Firebase Auth initialisation, a DRIVE auth service boundary, safe auth error messages, and `/auth/login` as a sign in foundation for existing Firebase users only. Role-based routing and protected routes are not enabled yet, and the app still keeps preview routes available.

Step 23 adds a central `AuthProvider` that observes Firebase Auth session state through the DRIVE auth service and exposes loading, unauthenticated, authenticated, warning, and sign-out state to preview UI. Preview routes remain available, protected routes are still not enabled, and the provider does not redirect, guard routes, read Firestore, write Firestore, or switch the mock-backed repository provider.

Step 24 adds pure route access decision helpers plus `/dev/role-access` as a local-state developer preview for unauthenticated, athlete, coach, and future admin sessions. Protected routes are still not enabled: the app does not redirect, hide preview routes, read or write Firestore, switch the mock-backed repository provider, or grant admin bypass access.

Step 25 adds `ProtectedRouteBoundary`, `ProtectedRouteStatusPanel`, and `/dev/protected-route-boundary` as a developer preview for the future protected route UI boundary. Protected routes are still not enabled: the boundary keeps children visible, does not redirect, does not wrap existing athlete or coach product routes, does not read or write Firestore, and does not switch the mock-backed repository provider.

Step 26 wraps existing athlete and coach preview routes with `ProtectedRouteBoundary` in preview mode only. Athlete and coach routes now show future access boundary information, but screens are still visible, routes are not blocked, redirects are not enabled, public and developer routes remain unwrapped, and the repository provider remains mock backed.

Step 27 adds lazy Firestore and Storage service boundary helpers. They do not add Firestore repositories, app Firestore reads or writes, Storage upload, image picking, PM5 upload workflow, repository provider switching, or screen-level Firebase imports.

Step 28 adds planning-level Firestore document types and pure domain mapper helpers for future repositories. It does not add Firestore repositories, app Firestore reads or writes, repository provider switching, reward calculation, reward result writes, or progress writes.

Step 29 adds read-only Firestore repository implementations behind the existing repository contracts. They are exported separately, are not connected to product screens or the repository provider, do not write Firestore, and do not require a Firebase project for mock-backed preview mode.

Step 30 adds explicit repository provider mode selection. Mock remains the default provider for preview mode; Firebase reads are selected only when `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=firebase` is set exactly and Firebase config appears complete.

Step 31 adds `/dev/repository-provider` as a developer-only provider status preview. It reports requested mode, active mode, mock fallback, Firebase config completeness, and missing config keys without reading Firestore, writing Firestore, testing Storage, or changing repository provider behaviour.

Step 32 adds `/dev/firebase-status` as a developer-only Firebase connection status preview. It checks local Firebase config completeness and can explicitly test Firebase app initialisation only; it does not read Firestore, write Firestore, upload to Storage, sign in with Auth, protect routes, or switch the app away from the mock-backed provider by default.

Step 33 adds pure Firebase Auth role claim validation helpers, an incomplete signed-in session state for missing DRIVE claims, the auth claims diagnostic panel, and `/dev/auth-claims` as a developer-only diagnostic route. A signed-in Firebase test user without role claims should show "Account is not ready for DRIVE access yet"; the step does not add signup, account creation, claim writing, Firebase Admin SDK, Cloud Functions, protected routes, Firestore reads or writes, Storage upload, real PM5 submission, reward calculation, or progress writes.

Step 34 adds pure trusted role assignment boundary types and validation helpers, a presentational boundary panel, `/dev/role-assignment-boundary` as a developer-only preview route, and planning documentation for future trusted role assignment. The client app still cannot assign roles, set custom claims, create accounts, promote users, read or write Firestore, or grant access when claims are missing.

Step 35 adds a minimal `functions/` TypeScript workspace for future trusted custom claim assignment planning. It is not deployed, does not export a live role assignment function, does not set custom claims, does not read or write Firestore, and does not change the client app's inability to assign roles.

Step 36 adds a local trusted claims dry run tool in the `functions/` workspace. It validates fake sample role claim assignment requests and prints planned claims, missing fields, invalid fields, and safety messages only; it does not set real Firebase custom claims, initialise Firebase Admin, deploy functions, create users, read Firestore, or write Firestore.

Step 37 adds planning-only role assignment audit trail types and pure helpers in the `functions/` workspace. Dry runs now include audit-style output showing planned audit status, actor, reason, claim scope, and safety checklist confirmation, but they still do not write audit records, set custom claims, initialise Firebase Admin, deploy functions, read Firestore, or write Firestore.

Step 38 adds pure trusted claim apply safety gate helpers in the `functions/` workspace. Dry runs now show a future apply safety gate section with validation status, block reasons, the required confirmation phrase, and explicit reminders that no custom claims were set, no audit record was written, and Firebase Admin was not initialised.

Step 39 adds `docs/46-trusted-claims-live-apply-runbook.md` and a short `functions/CLAIMS_RUNBOOK.md` pointer for future trusted claim apply planning. It did not set custom claims, initialise Firebase Admin, require service account files, or approve casual live claim setting.

Step 40 adds a guarded trusted claims live apply script foundation in `functions/` only. The script was not run, `DRIVE_CLAIMS_LIVE_APPLY` was not set, no Firebase custom claims have been set, and service account files remain out of the repository.

Step 41 adds local live claim input hygiene for future blocked rehearsals. Real live claim input files must stay in ignored local paths such as `functions/live-inputs/`, committed samples remain fake only, no live claim apply has been run, and no real Firebase custom claims have been set.

Step 42 implements the guarded Firebase Admin custom claim setting path in the functions workspace only. It remains locked behind the existing safety gates, was not run, `DRIVE_CLAIMS_LIVE_APPLY` was not set, and no Firebase custom claims were set.

Step 43 adds `admin:check` in the functions workspace as a local Firebase Admin credential readiness diagnostic only. It does not set claims, does not call `setCustomUserClaims`, does not read or write Firestore, does not create users, does not deploy anything, and does not mean live apply has been approved or run.

Step 44 cleans up trusted claims reporting only. Dry run output remains validation-only and live apply output now separates planned audit summary, safety gate result, and final execution result. No new `apply:claims` run happened in this step, `DRIVE_CLAIMS_LIVE_APPLY` was not set, and no new custom claims were set.

Step 45 adds `/dev/role-access-smoke-test` as a developer-only smoke test for the current signed-in session's expected role access decisions. It does not enable protected routes, redirect users, hide preview routes, read or write Firestore, switch repository provider mode, run `apply:claims`, or set custom claims.

Step 46 adds route protection mode configuration and status reporting only. Protected route enforcement defaults to preview mode and is not active unless `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=enforced` is explicitly configured; redirects are still avoided, public and developer routes remain open, and the repository provider remains mock backed by default.

Step 47 records manual protected route testing with a Firebase test athlete user. Enforced mode blocked the wrapped coach route for the athlete session while leaving developer routes visible and running no redirects; restored preview mode kept athlete and coach preview screens visible with future access messaging. Local `.env` should remain set to preview after testing.

Step 48 adds fake Firestore seed definitions and a dry-run plan for `example-club`, `example-j15-squad`, and `example-athlete` only. Firebase Admin is not initialised by `dryrun:seed`, and the repository provider remains mock backed.

Step 49 adds a guarded Firestore seed apply script foundation in the functions workspace only. `apply:seed` requires an explicit local JSON input path, the exact confirmation phrase, `requestedApplyMode: "live"`, `DRIVE_FIRESTORE_SEED_APPLY=true`, valid fake example seed data, and a passing safety gate before writes can be reached. The fake example seed data has since been applied manually.

Step 50 adds `verify:seed` in the functions workspace as a read-only Firestore seed verification script. It checks only the expected fake example document paths after the manual fake seed apply, does not write or delete Firestore data, and does not switch the app away from mock repositories.

Step 51 adds `/dev/repository-read-smoke-test` as a developer-only manual read preview. It checks the mock preview dataset in mock mode and the seeded Firestore example dataset in Firebase mode through the active repository provider only, does not import Firebase in screens or components, does not write or delete Firestore data, does not upload to Storage, does not prove product workflows are ready, and keeps mock mode as the default.

Step 52 adds `docs/59-firestore-rules-deployment-preflight.md` and `functions` `preflight:rules` as a local-only Firestore rules deployment preflight. It documents that the Firebase read smoke test currently fails with `Missing or insufficient permissions` until rules are deliberately deployed, and it does not deploy rules, contact Firestore, write Firestore, change provider defaults, or approve app writes.

Step 53 adds `docs/60-firebase-read-smoke-test-results.md` to record that manual Firestore rules deployment was followed by a passing Firebase repository read smoke test against the seeded fake example dataset. After testing, the repository provider was returned to mock, route protection remained preview, no app writes or Storage uploads were performed, and no real junior data was used.

Step 54 adds `docs/61-firebase-product-screen-manual-test-results.md` to record that the current athlete, coach, and repository read smoke test preview routes loaded successfully while Firebase repository mode was temporarily enabled. After testing, the app still defaults to mock provider mode, route protection remains preview by default, no app Firestore writes or Storage uploads were performed, and no real junior data was used.

Step 55 adds `docs/62-firebase-role-based-product-screen-test-results.md` to record that fake coach and athlete Firebase test users could load their expected preview screens in Firebase repository mode while opposite-role areas remained visible only because route protection was preview-only. After testing, the app defaults remained mock provider and preview route protection, no app Firestore writes or Storage uploads were performed, and no real junior data was used.

Step 56 adds `docs/63-firebase-enforced-route-manual-test-results.md` to record that Firebase repository mode and enforced route protection worked together for fake coach and athlete Firebase test users. Coach routes were allowed for the coach test user while athlete routes were blocked, athlete routes were allowed for the athlete test user while coach routes were blocked, and developer routes remained visible. After testing, app defaults remained mock provider and preview route protection; no app Firestore writes, Storage uploads, deployments, seed applies, claim applies, custom claim changes, or real junior data were involved.

Public signup, account creation, PM5 upload workflows, coach verification actions, reward calculation logic, product screen Firebase data access, and future integrations have not been added.
