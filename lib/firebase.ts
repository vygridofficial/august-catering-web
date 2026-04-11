import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || (projectId ? `${projectId}.appspot.com` : undefined);

  const hasServiceAccount = Boolean(projectId && clientEmail && privateKey);

  try {
    if (hasServiceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
    } else {
      // Build/runtime fallback so module imports don't fail when explicit creds are absent.
      admin.initializeApp();
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    if (!admin.apps.length) {
      try {
        admin.initializeApp();
      } catch (fallbackError) {
        console.error('Firebase fallback initialization error', fallbackError);
      }
    }
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
