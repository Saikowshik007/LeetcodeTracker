// Authentication related functionality

// DOM Elements
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const populateBtn = document.getElementById('populate-btn');
const userEmailDisplay = document.getElementById('user-email');
const googleLoginBtn = document.getElementById('google-login');
const githubLoginBtn = document.getElementById('github-login');
const googleSignupBtn = document.getElementById('google-signup');
const githubSignupBtn = document.getElementById('github-signup');

// Initialize Firebase auth providers
const googleProvider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();

// Toggle between login and signup forms
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Show loading state
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Attempt to sign in
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            // Login successful, UI will update via auth state change listener
            loginForm.reset();
        })
        .catch(error => {
            // Handle errors
            alert(`Login failed: ${error.message}`);
            console.error('Login error:', error);
        })
        .finally(() => {
            // Reset button state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
});

// Handle signup form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Show loading state
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    // Attempt to create user
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            // Signup successful, UI will update via auth state change listener
            signupForm.reset();
            
            // Initialize user data in Firestore
            const user = auth.currentUser;
            return db.collection('users').doc(user.uid).set({
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                solvedProblems: {}
            });
        })
        .catch(error => {
            // Handle errors
            alert(`Signup failed: ${error.message}`);
            console.error('Signup error:', error);
        })
        .finally(() => {
            // Reset button state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .catch(error => {
            console.error('Logout error:', error);
        });
});

// Populate button event listener
populateBtn.addEventListener('click', () => {
    showPopulateUI();
});

// Function to handle social authentication
async function handleSocialAuth(provider) {
    try {
        // Sign in with popup
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Check if this is a new user
        const isNewUser = result.additionalUserInfo.isNewUser;
        
        if (isNewUser) {
            // Initialize user data in Firestore for new users
            await db.collection('users').doc(user.uid).set({
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                solvedProblems: {}
            });
        }
        
        console.log(`${isNewUser ? 'New user' : 'Existing user'} authenticated with ${provider.providerId}`);
    } catch (error) {
        console.error('Social authentication error:', error);
        alert(`Authentication failed: ${error.message}`);
    }
}

// Google login button event listener
googleLoginBtn.addEventListener('click', () => {
    handleSocialAuth(googleProvider);
});

// GitHub login button event listener
githubLoginBtn.addEventListener('click', () => {
    handleSocialAuth(githubProvider);
});

// Google signup button event listener (same as login for OAuth providers)
googleSignupBtn.addEventListener('click', () => {
    handleSocialAuth(googleProvider);
});

// GitHub signup button event listener (same as login for OAuth providers)
githubSignupBtn.addEventListener('click', () => {
    handleSocialAuth(githubProvider);
});

// Function to check if a user is an admin
function isAdmin(email) {
    // Use admin emails from environment variables if available
    // Otherwise, fall back to an empty array (no admins)
    return window.ADMIN_EMAILS && window.ADMIN_EMAILS.includes(email);
}

// Listen for authentication state changes
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        console.log('User logged in:', user.email);
        userEmailDisplay.textContent = user.email;
        
        // Show main content, hide auth section
        authSection.classList.add('hidden');
        mainSection.classList.remove('hidden');
        
        // Check if user is admin and show/hide populate button
        if (isAdmin(user.email)) {
            populateBtn.classList.remove('hidden');
        } else {
            populateBtn.classList.add('hidden');
        }
        
        // Load user data and initialize the app
        loadUserData(user.uid);
    } else {
        // User is signed out
        console.log('User logged out');
        
        // Show auth section, hide main content
        mainSection.classList.add('hidden');
        authSection.classList.remove('hidden');
        
        // Reset forms
        loginForm.reset();
        signupForm.reset();
        
        // Default to showing login form
        loginContainer.classList.remove('hidden');
        signupContainer.classList.add('hidden');
    }
});

// Load user data from Firestore
function loadUserData(userId) {
    db.collection('users').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                // Initialize app with user data
                if (userData.solvedProblems) {
                    initializeApp(userData.solvedProblems);
                } else {
                    initializeApp({});
                }
            } else {
                console.log('No user data found, creating new profile');
                // Create new user document if it doesn't exist
                db.collection('users').doc(userId).set({
                    email: auth.currentUser.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    solvedProblems: {}
                });
                initializeApp({});
            }
        })
        .catch(error => {
            console.error('Error loading user data:', error);
            initializeApp({});
        });
}

