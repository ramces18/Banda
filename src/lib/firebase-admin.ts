import admin from 'firebase-admin';

// Check if the environment variable is set
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  if (process.env.NODE_ENV === 'production') {
    // In production, we might want to throw an error if the key is missing.
    // However, for now, we will just warn to avoid crashing the app during startup.
    console.warn('Firebase admin initialization skipped. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  } else {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK features will be disabled in development.');
  }
}

// Initialize app only if it's not already initialized and the key is present
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    // The key is a stringified JSON, so it needs to be parsed.
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: "banda-b4fc5",
    });
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY or initializing Firebase admin:', error);
    // Do not throw an error, just log it. This prevents the entire app from crashing.
  }
}

// Export admin services, but they will be null if initialization failed.
export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminMessaging = admin.apps.length ? admin.messaging() : null;
