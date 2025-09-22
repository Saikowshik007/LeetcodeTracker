// This script injects environment variables into the window object
// It should be included before any other scripts that use these variables

(function() {
    // Get environment variables from the server
    // In a production environment, these would be injected by the server
    // For local development, you can set them manually here
    window.ENV_FIREBASE_API_KEY = process.env.ENV_FIREBASE_API_KEY;
    window.ENV_FIREBASE_AUTH_DOMAIN = process.env.ENV_FIREBASE_AUTH_DOMAIN;
    window.ENV_FIREBASE_PROJECT_ID = process.env.ENV_FIREBASE_PROJECT_ID;
    window.ENV_FIREBASE_STORAGE_BUCKET = process.env.ENV_FIREBASE_STORAGE_BUCKET;
    window.ENV_FIREBASE_MESSAGING_SENDER_ID = process.env.ENV_FIREBASE_MESSAGING_SENDER_ID;
    window.ENV_FIREBASE_APP_ID = process.env.ENV_FIREBASE_APP_ID;
    window.ENV_FIREBASE_MEASUREMENT_ID = process.env.ENV_FIREBASE_MEASUREMENT_ID;
    
    // Load admin emails
    window.ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    
    console.log('Environment variables loaded');
})();

