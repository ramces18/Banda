import admin from 'firebase-admin';

// Check if the environment variable is set
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Firebase admin initialization failed. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  } else {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK features will be disabled.');
  }
}

// Initialize app only if it's not already initialized and the key is present
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    // The key is a stringified JSON, so it needs to be parsed.
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY or initializing Firebase admin:', error);
  }
}

// Export admin services, but they will be null if initialization failed.
export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminMessaging = admin.apps.length ? admin.messaging() : null;
