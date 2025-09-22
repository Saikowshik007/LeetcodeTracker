import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Function to fetch all pattern data from Firestore
export const fetchPatternData = async () => {
  try {
    const patterns = [];

    // Get all patterns
    const patternsSnapshot = await getDocs(collection(db, 'patterns'));

    // Process each pattern
    for (const patternDoc of patternsSnapshot.docs) {
      const pattern = { id: patternDoc.id, ...patternDoc.data() };
      pattern.subPatterns = [];

      // Get subpatterns for this pattern
      const subPatternsSnapshot = await getDocs(
        collection(db, 'patterns', patternDoc.id, 'subPatterns')
      );

      // Process each subpattern
      for (const subPatternDoc of subPatternsSnapshot.docs) {
        const subPattern = { id: subPatternDoc.id, ...subPatternDoc.data() };
        subPattern.problems = [];

        // Get problems for this subpattern
        const problemsSnapshot = await getDocs(
          collection(db, 'patterns', patternDoc.id, 'subPatterns', subPatternDoc.id, 'problems')
        );

        // Add each problem to the subpattern
        problemsSnapshot.forEach(problemDoc => {
          subPattern.problems.push({ id: problemDoc.id, ...problemDoc.data() });
        });

        // Sort problems by ID
        subPattern.problems.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        // Add subpattern to pattern
        pattern.subPatterns.push(subPattern);
      }

      // Add pattern to patterns array
      patterns.push(pattern);
    }

    return patterns;
  } catch (error) {
    console.error('Error fetching pattern data:', error);
    return [];
  }
};

// Function to count total problems
export const countTotalProblems = async () => {
  try {
    let total = 0;

    // Get all patterns
    const patternsSnapshot = await getDocs(collection(db, 'patterns'));

    // Process each pattern
    for (const patternDoc of patternsSnapshot.docs) {
      // Get subpatterns for this pattern
      const subPatternsSnapshot = await getDocs(
        collection(db, 'patterns', patternDoc.id, 'subPatterns')
      );

      // Process each subpattern
      for (const subPatternDoc of subPatternsSnapshot.docs) {
        // Count problems for this subpattern
        const problemsSnapshot = await getDocs(
          collection(db, 'patterns', patternDoc.id, 'subPatterns', subPatternDoc.id, 'problems')
        );
        total += problemsSnapshot.size;
      }
    }

    return total;
  } catch (error) {
    console.error('Error counting problems:', error);
    return 0;
  }
};

// Function to update problem solved status for a user
export const updateProblemStatus = async (userId, problemId, isSolved) => {
  try {
    const userRef = doc(db, 'users', userId);

    // Update the solved status in the user's document
    await updateDoc(userRef, {
      [`solvedProblems.${problemId}`]: isSolved
    });

    console.log(`Problem ${problemId} marked as ${isSolved ? 'solved' : 'unsolved'} for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error updating problem status:', error);
    return false;
  }
};

// Function to load user data
export const loadUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      // Create new user document if it doesn't exist
      const newUserData = {
        createdAt: serverTimestamp(),
        solvedProblems: {}
      };

      await setDoc(doc(db, 'users', userId), newUserData);
      return newUserData;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    return { solvedProblems: {} };
  }
};

// Function to get all solved problems for a user
export const getUserSolvedProblems = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (userDoc.exists() && userDoc.data().solvedProblems) {
      return userDoc.data().solvedProblems;
    }

    return {};
  } catch (error) {
    console.error('Error getting solved problems:', error);
    return {};
  }
};

// Function to count solved problems for a user
export const countSolvedProblems = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (userDoc.exists() && userDoc.data().solvedProblems) {
      const solvedProblems = userDoc.data().solvedProblems;
      return Object.values(solvedProblems).filter(status => status === true).length;
    }

    return 0;
  } catch (error) {
    console.error('Error counting solved problems:', error);
    return 0;
  }
};