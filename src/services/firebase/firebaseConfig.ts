import type { FirebaseOptions } from 'firebase/app';

type FirebaseConfig = Required<
  Pick<FirebaseOptions, 'apiKey' | 'authDomain' | 'projectId' | 'storageBucket' | 'messagingSenderId' | 'appId'>
>;

export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

const firebaseConfigEnvironmentKeys = {
  apiKey: 'EXPO_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'EXPO_PUBLIC_FIREBASE_APP_ID',
} as const satisfies Record<keyof FirebaseConfig, string>;

export function getMissingFirebaseConfigKeys(): string[] {
  return Object.entries(firebaseConfigEnvironmentKeys)
    .filter(([configKey]) => !firebaseConfig[configKey as keyof FirebaseConfig])
    .map(([, environmentKey]) => environmentKey);
}

export function isFirebaseConfigComplete(): boolean {
  return getMissingFirebaseConfigKeys().length === 0;
}
