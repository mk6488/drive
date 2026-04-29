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

Use `docs/08-definition-of-done.md` before finishing substantive tasks to check scope, safeguarding, architecture boundaries, verification-gated rewards, and final reporting.

## Cursor Rules

Project rules live in `.cursor/rules/` and are intended to keep future agent work aligned with the DRIVE brief.

## Development Setup

Install dependencies:

```bash
npm install
```

`.env.example` lists the Expo public Firebase variables reserved for future Firebase work. Real Firebase values are not required for the current mock-backed preview, and real `.env` files must stay local.

The current app still runs as a mock-backed preview. Firestore and Storage helpers plus the disconnected Firestore read repository foundations are not wired into the provider, so the preview app does not require a Firebase project or real Firebase values yet.

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

## Current Status

This repository currently contains DRIVE guardrails, the Step 2 Expo React Native TypeScript app foundation, the Step 3 static UI shell, Step 4 domain model plus mock repository boundaries, Step 5's mock-backed athlete Today's Quest screen, Step 6's athlete PM5 evidence submission shell preview, Step 7's coach verification queue shell preview, Step 8's shared submission status plus reward gate foundation layer, Step 9's reward rules design foundation, Step 10's submission lifecycle timeline foundation, Step 11's developer-only lifecycle preview harness, Step 12's coach quest builder shell preview, Step 13's static quest template catalogue with a local template picker only, Step 14's preview-only squad mission and River Map progress shell, Step 15's preview-only Boathouse Builder shell, Step 16's mock-backed repository provider foundation only, Step 17's submission and verification command boundary foundation only, Step 18's auth and role boundary foundation only, Step 19's Firebase app and environment boundary foundation only, Step 20's Firestore rules, indexes, config, and path foundation only, Step 21's Firebase Storage rules and PM5 evidence path foundations only, Step 22's Firebase Auth service foundation and sign in shell only, Step 23's controlled Auth Provider shell only, Step 24's role gate and route access foundation only, Step 25's protected route component foundation only, Step 26's preview-only route boundary wrapping for athlete and coach preview routes, Step 27's lazy Firestore and Storage service helpers only, Step 28's pure Firestore document and domain mapping foundations only, and Step 29's disconnected Firestore read repository foundations only.

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

Public signup, account creation, PM5 upload workflows, coach verification actions, reward calculation logic, product screen Firebase data access, and future integrations have not been added.
