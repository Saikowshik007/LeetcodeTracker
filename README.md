# LeetCode Pattern Tracker

A web application to track your progress through LeetCode problems organized by patterns.

## Features

- **Firebase Authentication**: Secure user login and registration with Email/Password, Google, and GitHub
- **Pattern Organization**: Problems organized by algorithmic patterns
- **Progress Tracking**: Mark problems as solved and track your progress
- **Interactive Animations**: Visualize how each algorithm pattern works with interactive animations
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd leetcode-tracker
```

### 2. Set up Firebase

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with the following providers:
   - Email/Password
   - Google
   - GitHub
3. For GitHub authentication:
   - Go to your GitHub account settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set the Authorization callback URL to `https://your-firebase-project-id.firebaseapp.com/__/auth/handler`
   - Copy the Client ID and Client Secret to Firebase GitHub authentication settings
4. Create a Firestore database
5. Get your Firebase configuration (apiKey, authDomain, etc.)

### 3. Set up Environment Variables

#### For Local Development

Create a file named `.env` in the root directory with the following content:

```
ENV_FIREBASE_API_KEY=your_api_key
ENV_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
ENV_FIREBASE_PROJECT_ID=your_project_id
ENV_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
ENV_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
ENV_FIREBASE_APP_ID=your_app_id
ENV_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### For Vercel Deployment

1. Create a new project in Vercel
2. Add the following environment variables in the Vercel project settings:
   - `ENV_FIREBASE_API_KEY`
   - `ENV_FIREBASE_AUTH_DOMAIN`
   - `ENV_FIREBASE_PROJECT_ID`
   - `ENV_FIREBASE_STORAGE_BUCKET`
   - `ENV_FIREBASE_MESSAGING_SENDER_ID`
   - `ENV_FIREBASE_APP_ID`
   - `ENV_FIREBASE_MEASUREMENT_ID`
   - `ADMIN_EMAILS` (comma-separated list of admin email addresses)
3. Deploy the project to Vercel

### 4. Populate the database

1. Open the application in your browser
2. Open the browser console (F12 or right-click > Inspect > Console)
3. Run the following command to open the database population UI:
   ```javascript
   showPopulateUI();
   ```
4. Paste the LeetCode pattern data into the textarea
5. Click "Populate Database" to initialize the database with the pattern data

### 5. Use the application

1. Register a new account or log in with an existing account
2. Browse through the patterns and problems
3. Mark problems as solved by checking the checkbox next to each problem
4. Track your progress through the statistics at the top of the page

## Project Structure

- `index.html`: Main HTML file
- `styles.css`: CSS styles
- `js/firebase-config.js`: Firebase configuration
- `js/auth.js`: Authentication logic
- `js/data.js`: Data handling functions
- `js/app.js`: Main application logic
- `js/populate-database.js`: Utility script to populate the database

## Database Structure

The application uses Firebase Firestore with the following structure:

- `patterns` (collection)
  - `{pattern-id}` (document)
    - `name`: Pattern name
    - `id`: Pattern ID
    - `subPatterns` (subcollection)
      - `{subpattern-id}` (document)
        - `name`: Subpattern name
        - `id`: Subpattern ID
        - `problems` (subcollection)
          - `{problem-id}` (document)
            - `id`: Problem ID
            - `name`: Problem name
            - `url`: LeetCode problem URL

- `users` (collection)
  - `{user-id}` (document)
    - `email`: User email
    - `createdAt`: Account creation timestamp
    - `solvedProblems`: Object mapping problem IDs to boolean values

## Algorithm Animations

The application includes interactive animations to help users understand how different algorithm patterns work. Each pattern has its own animation that demonstrates the core concept visually.

### Available Animations

- **Two Pointers - Converging**: Visualizes how two pointers move toward each other from opposite ends of an array
- **Two Pointers - Fast & Slow**: Demonstrates cycle detection using fast and slow pointers
- **Sliding Window - Fixed Size**: Shows how a fixed-size window slides through an array
- **Sliding Window - Variable Size**: Illustrates how a window can grow and shrink based on conditions

### Animation Controls

Each animation includes:
- Play/Pause button: Start or pause the animation
- Reset button: Return to the initial state
- Speed control: Adjust the animation speed

### Adding New Animations

To add a new animation:

1. Create a new animation function in `js/animations.js`
2. Register the animation in the `animationRegistry` object
3. Store any necessary animation data in Firebase using the `storePatternAnimationData` function

## Future Enhancements

- Add more LeetCode patterns and problems
- Implement sorting and filtering options
- Add difficulty indicators for problems
- Implement notes feature for each problem
- Add dark mode
- Add more algorithm animations