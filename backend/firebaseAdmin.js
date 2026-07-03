import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Place your Firebase Service Account JSON file in the backend directory
// and rename it to 'firebaseServiceAccountKey.json', OR provide environment variables.
const serviceAccountPath = path.join(__dirname, 'firebaseServiceAccountKey.json');

let isInitialized = false;

if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    isInitialized = true;
    console.log('Firebase Admin SDK initialized successfully via file.');
} else {
    console.warn('⚠️ Firebase Admin SDK not initialized: firebaseServiceAccountKey.json not found.');
    console.warn('Please generate it from Firebase Console > Project Settings > Service Accounts and place it in the backend folder.');
}

// Helper to send a push notification to a specific device token
export const sendPushNotification = async (token, title, body, data = {}) => {
    if (!isInitialized) return;
    
    if (!token) {
        console.warn('No FCM token provided, skipping push notification.');
        return;
    }

    try {
        const message = {
            notification: {
                title,
                body
            },
            data,
            token
        };

        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

export default admin;
