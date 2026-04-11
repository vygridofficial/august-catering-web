import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const db = admin.firestore();
export const adminAuth = admin.auth();

// Prefix all collections per project so multiple projects can share one Firestore database.
// Configure per-project via FIREBASE_COLLECTION_PREFIX env var.
export const COLLECTION_PREFIX = process.env.FIREBASE_COLLECTION_PREFIX || 'augustcatering';

export const projectCollection = (name: string) =>
  db.collection(`${COLLECTION_PREFIX}_${name}`);

export { admin };
