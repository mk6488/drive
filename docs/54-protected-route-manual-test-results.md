# Protected Route Manual Test Results

Manual test recorded after Step 46.

## Test Context

- Test account type: Firebase test athlete user.
- No real junior account was used.
- No Firestore reads or writes were performed.
- No Firebase custom claims were changed during this test.
- No redirects were enabled.
- The app was not switched to Firebase repository mode.

This test confirms the visible difference between preview mode and enforced mode for already wrapped athlete and coach
routes. It does not approve route enforcement as the default behaviour.

## Enforced Mode Manual Check

Environment value:

```bash
EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=enforced
```

Expected result for an athlete user:

- `/athlete` is allowed.
- `/coach` is blocked.
- `/dev/role-access-smoke-test` remains visible.
- No redirects occur.

Observed result:

- Route protection mode shown: enforced.
- Enforcement active: yes.
- Signed in as athlete.
- `/athlete` showed the athlete screen with `Enforced: allowed`.
- `/coach` showed the coach screen boundary with `Enforced: blocked`.
- `/dev/role-access-smoke-test` showed normally.
- Redirects happened: no.

## Preview Mode Manual Check

Environment value:

```bash
EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=preview
```

Expected result:

- Athlete and coach preview screens remain visible.
- The boundary panel explains the future access decision.
- Developer routes remain visible.
- No redirects occur.

Observed result:

- Route protection mode shown: preview.
- Enforcement active: no.
- `/athlete` showed the screen with `Preview: allowed later`.
- `/coach` showed the screen with `Preview: not authorised later`.
- `/dev/role-access-smoke-test` showed normally.
- Redirects happened: no.
- Git status was clean after restoring preview mode.

## Future Manual Test Checklist

- [ ] Test as unauthenticated user.
- [ ] Test as coach user.
- [ ] Test as athlete user.
- [ ] Test invalid or missing claims.
- [ ] Verify public routes remain visible.
- [ ] Verify developer routes remain visible during development.
- [ ] Verify no redirects until redirect policy is explicitly added.
- [ ] Verify Firestore remains untouched during route tests.
- [ ] Verify `.env` is returned to preview after testing.

## Warning For Future Agents

Do not infer from this test that route enforcement should now be enabled by default.

- Preview remains the default route protection mode.
- Enforced mode must be explicitly selected with `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=enforced`.
- Redirects are still out of scope.
- Public and developer routes remain open.
- Firestore data access is still separate from route access.

## Deliberately Out Of Scope

This manual test did not deploy anything, run `apply:claims`, set Firebase custom claims, set
`DRIVE_CLAIMS_LIVE_APPLY=true`, change `.env`, switch the app to Firebase repository mode, read Firestore, write
Firestore, add Firebase Storage upload, build PM5 upload, build submit or coach review actions, calculate rewards, write
progress, build leaderboards, enable protected routes by default, add redirects, or hide public or developer routes.
