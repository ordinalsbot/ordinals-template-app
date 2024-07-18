import * as admin from 'firebase-admin';

const ServiceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL
};

// Check if Firebase Admin has been initialized to avoid "already exists" error
if (!admin.apps.length) {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    serviceAccountId: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    credential: admin.credential.cert(ServiceAccount)
  });
};

export default admin;
