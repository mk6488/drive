# DRIVE Functions Workspace

This workspace is for trusted server-side planning for DRIVE: Winter Quest. It is not deployed, it does not expose a live role assignment function, and it does not set Firebase custom claims.

## Trusted Claims Dry Runs

The local dry run scripts validate fake claim assignment requests and print what would be assigned in a future trusted workflow:

```bash
npm run dryrun:coach
npm run dryrun:athlete
npm run dryrun:incomplete
```

Each dry run builds the TypeScript workspace, reads a local sample JSON file, validates it with the pure role claim validation helpers, and reports missing fields, invalid fields, proposed claims, and safeguarding messages.

No Firebase Admin SDK claim setting happens here. The dry run does not call `setCustomUserClaims`, does not create users, does not read Firestore, and does not write Firestore.

## Secrets And Sample Data

Do not store service account keys in this workspace. No service account key is needed for the current dry run tool.

The files in `samples/` are fake local examples only. Do not put real junior names, real Firebase user ids, real Firebase config, parent details, service account data, or other sensitive data in sample files.
