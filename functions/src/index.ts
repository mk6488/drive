// Trusted role assignment for DRIVE: Winter Quest will live in this server workspace later.
//
// This functions workspace is deliberately not deployed yet. It does not export a live callable
// role assignment function and does not set Firebase custom claims.
//
// Client apps must never assign roles, promote users, or decide coach access by themselves.
// Future implementation must use an auditable trusted workflow that records who approved a
// role change, why it was needed, and which narrow club or squad scope was granted.
//
// DRIVE works with junior athletes, so safeguarding requires narrow role scopes and minimal
// claim data. Do not add parent details, unnecessary personal information, public signup,
// Firestore reads, Firestore writes, or custom claim writes in this foundation step.
