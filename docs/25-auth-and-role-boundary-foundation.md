# Auth And Role Boundary Foundation

## What Was Added

Step 18 adds an auth and role boundary foundation for DRIVE: Winter Quest without adding real authentication:

- `src/services/auth/authTypes.ts` defines preview-safe auth roles, users, sessions, and boundary state.
- `src/services/auth/roleAccess.ts` defines pure role access helpers for athlete, coach, and future admin planning.
- `src/services/auth/mockAuthSession.ts` defines static read-only preview sessions for athlete, coach, and unauthenticated states.
- `src/components/game/AuthBoundaryPanel.tsx` displays the current preview role and future access boundaries.
- Athlete, coach, verification, and welcome previews now explain that role access is preview-only until real auth exists.

## Why Role Boundaries Matter For DRIVE

DRIVE is for junior athletes and coaches, so role boundaries are a safeguarding and product requirement. Athletes should see their own training context, coaches should review squad evidence only where authorised, and reward-sensitive actions must remain separated from athlete-facing UI.

These boundaries protect the core loop: honest PM5 evidence, useful reflection, coach verification, and rewards only after trusted review.

## Why This Step Does Not Add Real Authentication

This foundation describes the shape of future auth without implementing it. There is no login, signup, token handling, persisted auth state, user creation, Firebase Auth, Firebase config, or environment variable setup.

The app remains a preview shell. The new sessions are static examples for copy and type boundaries only.

## How Athlete And Coach Access Are Represented

Athlete preview users include:

- `userId`
- `role`
- `displayName`
- `clubId`
- `squadIds`
- `linkedAthleteId`

The `linkedAthleteId` is athlete-only so future athlete access can be scoped to the athlete's own record.

Coach preview users include:

- `userId`
- `role`
- `displayName`
- `clubId`
- `squadIds`

Coach helpers only describe future access to coach areas, submission review, and quest draft boundaries for assigned club or squad context.

## Why Admin Is Future Only

The `admin` role remains represented as a future planning role because club, squad, coach, or system administration may be needed later.

This step deliberately does not grant broad admin behaviour, management screens, override permissions, or protected admin routes. Future admin functionality requires explicit product and safeguarding approval.

## Why Real Protected Routes Are Out Of Scope

The current routes are previews, not permission-enforced surfaces. Adding protected routes now would imply real authentication and session enforcement before Firebase Auth, security rules, and data-access policies have been approved.

The boundary panel and helpers are planning aids only. They do not block navigation or mutate route state.

## Why Firebase Auth Is Still Not Added

Firebase Auth remains deliberately out of scope because authentication affects junior data handling, role enforcement, Firestore access, Storage permissions, and trusted reward workflows.

Future Firebase work must preserve the role helpers, repository boundaries, and verification-gated reward model instead of letting screens write directly to Firebase or infer permissions from mock state.

## How This Supports Safeguarding

The foundation avoids unnecessary junior personal data and keeps role fields minimal. It does not collect parent details, sensitive junior details, private messaging data, or public profile data.

It reinforces that:

- athletes can only be scoped to their own athlete record
- coaches must remain limited to assigned club or squad context
- coach verification must remain coach-only once auth exists
- unauthenticated users should not access future protected areas
- reward and progress writes must not happen from athlete or preview UI

## What Future Agents Must Not Infer

Future agents must not infer that this foundation added:

- Firebase
- Firebase Auth
- authentication implementation
- Firebase config or environment variables
- real login or signup
- real protected routes
- user creation
- role enforcement against live data
- real PM5 upload
- real submit, approve, or reject actions
- reward calculation
- reward result writes
- athlete progress writes
- squad progress writes
- leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, or social features

## Deliberately Out Of Scope

This step intentionally excludes:

- Firebase implementation
- Firebase Auth
- environment variables
- real auth state persistence
- token handling
- user creation
- real login and signup workflows
- real protected routes and navigation guards
- admin functionality
- PM5 upload implementation
- submission writes
- coach approve or reject workflows
- reward calculation
- reward result writes
- athlete, squad, River Map, or Boathouse progress writes
