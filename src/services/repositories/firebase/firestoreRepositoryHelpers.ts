import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  type QueryConstraint,
} from 'firebase/firestore';

import { getDriveFirestore } from '@/src/services/firebase/firebaseFirestore';

type FirestoreDocumentMapper<TDocument, TDomain> = (id: string, data: TDocument) => TDomain;

export function getFirestoreForRepository() {
  // Missing Firebase config is a developer setup issue at this service boundary.
  // Do not fall back to mocks or silently change provider behaviour from a Firebase repository.
  return getDriveFirestore();
}

export async function readFirestoreDocument<TDocument, TDomain>(
  path: string,
  mapper: FirestoreDocumentMapper<TDocument, TDomain>,
): Promise<TDomain | null> {
  const snapshot = await getDoc(doc(getFirestoreForRepository(), path));

  if (!snapshot.exists()) {
    return null;
  }

  return mapper(snapshot.id, snapshot.data() as TDocument);
}

export async function readFirestoreQuery<TDocument, TDomain>(
  collectionPath: string,
  constraints: QueryConstraint[],
  mapper: FirestoreDocumentMapper<TDocument, TDomain>,
): Promise<TDomain[]> {
  const collectionReference = collection(getFirestoreForRepository(), collectionPath);
  const snapshot = await getDocs(query(collectionReference, ...constraints));

  return snapshot.docs.map((documentSnapshot) => mapper(documentSnapshot.id, documentSnapshot.data() as TDocument));
}
