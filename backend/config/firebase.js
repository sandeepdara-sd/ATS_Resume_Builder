import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseInitialized = false;

const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      firebaseInitialized = true;
      // console.log('✅ Firebase Admin initialized from .env');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    firebaseInitialized = false;
  }
};

const canVerifyFirebaseTokens = () => firebaseInitialized;

export { initializeFirebase, canVerifyFirebaseTokens };
export default admin;



// import admin from 'firebase-admin';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

// const serviceAccount = require('./serviceAccountKey.json');

// let firebaseInitialized = false;

// const initializeFirebase = () => {
//   try {
//     if (!admin.apps.length) {
//       admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount)
//       });
//       firebaseInitialized = true;
//       console.log('✅ Firebase Admin initialized from file');
//     }
//   } catch (error) {
//     console.error('❌ Firebase Admin initialization failed:', error.message);
//     firebaseInitialized = false;
//   }
// };

// const canVerifyFirebaseTokens = () => firebaseInitialized;

// export { initializeFirebase, canVerifyFirebaseTokens };
// export default admin;
