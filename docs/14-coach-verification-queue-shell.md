# Coach Verification Queue Shell

## What Was Added

Step 7 adds a coach-facing verification queue shell preview:

- `src/screens/coach/CoachVerificationQueueShellScreen.tsx`
- `src/components/game/CoachSubmissionReviewCard.tsx`
- `src/components/game/CoachVerificationBoundaryPanel.tsx`
- `app/coach/verification.tsx`

It also updates `src/screens/coach/CoachHomePlaceholderScreen.tsx` so coaches can open the queue shell from the coach home preview.

## How This Supports The DRIVE Brief

The queue shell makes coach review visible as a core part of the Winter Quest loop:

- It reads mock submissions, quests, and athlete data to show review context.
- It prioritises submissions awaiting coach review in the list order.
- It frames PM5 evidence and reflections as private training evidence for coach-led review.
- It reinforces that rewards unlock only after trusted verification.

This keeps the product centred on coach verified execution quality rather than raw completion.

## Why Approve And Reject Are Disabled

Approve and reject controls are shown but disabled to communicate future workflow shape without pretending that verification is implemented.

The shell does not:

- update submission status
- mutate mock data
- perform real coach verification actions

## Why Rewards Remain Verification-Gated

The screen copy explicitly states that rewards remain locked until trusted coach verification is complete.

No reward calculation or progress update workflow is triggered from this coach UI shell.

## Why Trusted Write Repositories Are Not Called From UI

Trusted reward and progress write boundaries are intentionally excluded from this screen to protect integrity:

- UI reads are limited to mock read repositories.
- Trusted writes remain reserved for dedicated verification workflows.
- The shell avoids any direct reward or progress writes from client UI.

## Safeguarding Reflected In The Coach Screen

The queue includes safeguarding copy that states:

- PM5 photos are private training evidence.
- Reflections are for training review only.
- Coach notes must be practical, respectful, and training focused.
- The app must not encourage training through pain, illness, injury, or exhaustion.
- No public rankings or public athlete profiles are part of this shell.

## What Future Agents Must Not Infer

Future agents must not infer from this shell that:

- real coach approve or reject workflows are implemented
- reward calculation is implemented
- progress updates are implemented
- Firebase, authentication, or storage integrations exist
- public sharing or ranking features are present

## Deliberately Out Of Scope

This step deliberately excludes:

- Firebase
- authentication
- real PM5 upload
- Firebase Storage
- real approve or reject actions
- reward calculation
- athlete progress writes
- reward result writes
- leaderboards
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features
