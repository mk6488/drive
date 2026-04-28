# Storage Rules And PM5 Evidence Paths

## What Was Added

Step 21 adds a Firebase Storage and PM5 evidence path foundation for DRIVE: Winter Quest:

- `storage.rules` defines intended private Storage access for future PM5 evidence files.
- `firebase.json` now references `storage.rules` alongside the existing Firestore rules and indexes.
- `src/services/firebase/storagePaths.ts` adds pure PM5 evidence path helpers.
- `src/services/firebase/index.ts` exports only safe Firebase config, app, Firestore path, and Storage path helpers.

This step does not connect Firebase Storage to the app, initialise Storage, upload files, read files, write Firestore, or switch the repository provider away from mocks.

## Why PM5 Evidence Is Private

PM5 photos are junior athlete training evidence. They support coach verification and reward integrity, not public display or social content.

The Storage rules therefore do not create public read access, public galleries, social sharing paths, messaging paths, or arbitrary user folders. PM5 files remain private because DRIVE must protect junior athlete data and keep the MVP centred on honest evidence, useful reflection, and coach verified execution quality.

## Intended Storage Path Structure

Future PM5 evidence files are scoped under:

```text
clubs/{clubId}/submissions/{submissionId}/pm5/{fileName}
```

The matching helper is:

```text
pm5EvidencePath(clubId, submissionId, fileName)
```

The helper is a pure path builder. It imports no Firebase SDKs, does not initialise Storage, and does not upload anything.

## Why Uploads Are Not Implemented Yet

Real upload requires approved workflow work:

- Firebase Auth and role claims.
- Submission ownership checks.
- Firestore submission records linked to Storage objects.
- Coach verification state handling.
- Error handling, image picking, and user-facing upload UX.

Adding upload now would imply a live evidence workflow before the authentication, submission, and verification boundaries are ready.

## Why Storage Is Not Initialised In App Code Yet

The Firebase app foundation exists, but Storage is not initialised in app code because this step is a rules and path foundation only. Screens and components must not import Firebase Storage directly.

Future Storage access should live inside approved services or repositories that preserve the DRIVE boundaries: athletes submit only their own evidence, coaches review only authorised club or squad evidence, and reward/progress writes remain trusted and verification-gated.

## Storage Rule Intentions

The rules are intentionally conservative:

- Unauthenticated users cannot read or write PM5 evidence.
- Athletes can create PM5 evidence only in their own club context with a future linked athlete claim.
- Athletes cannot read other athletes' PM5 photos.
- Coaches can read PM5 evidence only in their own club context with assigned squad context.
- Admin access is club-scoped planning only, not a broad public bypass.
- Files must be images.
- Files are limited to a placeholder size of 8 MB.
- Client update and delete are denied.
- Trusted server cleanup can be designed later.

Storage rules cannot fully prove the submission document shape yet. Future workflow work should link each Storage object to a Firestore submission document and validate that the submission belongs to the linked athlete, club, and authorised squad before upload and review.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Firebase Auth has been added.
- Login, signup, or protected routes exist.
- Firebase Storage is initialised in app code.
- Real PM5 upload exists.
- Image picking exists.
- Screens may import Firebase Storage directly.
- Firestore repositories exist.
- The repository provider should switch to Firebase.
- Submission submit, approve, or reject actions exist.
- Reward calculation exists.
- Reward results, athlete progress, squad progress, River Map progress, or Boathouse progress can be written.
- PM5 files may become public.
- Public galleries, social sharing, direct messaging, or leaderboards are approved.

## Deliberately Out Of Scope

This step intentionally excludes Firebase Auth implementation, login, signup, protected routes, Firestore repositories, app Firestore reads or writes, Firebase Storage initialisation, real PM5 upload, image picking, submit actions, approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
