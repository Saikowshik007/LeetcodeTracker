// Firebase configuration
// Configuration is loaded from environment variables (for Vercel deployment)
const firebaseConfig = {
    apiKey: window.ENV_FIREBASE_API_KEY,
    authDomain: window.ENV_FIREBASE_AUTH_DOMAIN,
    projectId: window.ENV_FIREBASE_PROJECT_ID,
    storageBucket: window.ENV_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.ENV_FIREBASE_MESSAGING_SENDER_ID,
    appId: window.ENV_FIREBASE_APP_ID,
    measurementId: window.ENV_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence for Firestore
db.enablePersistence()
    .catch(err => {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.log('Persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            // The current browser does not support all of the features required for persistence
            console.log('Persistence not supported by this browser');
        }
    });

