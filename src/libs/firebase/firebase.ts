import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import path from 'path';

const serviceAccount = require('../../../firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET, // e.g., 'myapp.appspot.com'
});

const bucket = getStorage().bucket();

export { bucket };
