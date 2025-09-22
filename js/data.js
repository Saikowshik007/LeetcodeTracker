// LeetCode pattern data handling with Firebase

// Function to fetch all pattern data from Firestore
async function fetchPatternData() {
    try {
        const patterns = [];
        
        // Get all patterns
        const patternsSnapshot = await db.collection('patterns').get();
        
        // Process each pattern
        for (const patternDoc of patternsSnapshot.docs) {
            const pattern = patternDoc.data();
            pattern.subPatterns = [];
            
            // Get subpatterns for this pattern
            const subPatternsSnapshot = await patternDoc.ref.collection('subPatterns').get();
            
            // Process each subpattern
            for (const subPatternDoc of subPatternsSnapshot.docs) {
                const subPattern = subPatternDoc.data();
                subPattern.problems = [];
                
                // Get problems for this subpattern
                const problemsSnapshot = await subPatternDoc.ref.collection('problems').get();
                
                // Add each problem to the subpattern
                problemsSnapshot.forEach(problemDoc => {
                    subPattern.problems.push(problemDoc.data());
                });
                
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
}

// Function to count total problems
async function countTotalProblems() {
    try {
        let total = 0;
        
        // Get all patterns
        const patternsSnapshot = await db.collection('patterns').get();
        
        // Process each pattern
        for (const patternDoc of patternsSnapshot.docs) {
            // Get subpatterns for this pattern
            const subPatternsSnapshot = await patternDoc.ref.collection('subPatterns').get();
            
            // Process each subpattern
            for (const subPatternDoc of subPatternsSnapshot.docs) {
                // Count problems for this subpattern
                const problemsSnapshot = await subPatternDoc.ref.collection('problems').get();
                total += problemsSnapshot.size;
            }
        }
        
        return total;
    } catch (error) {
        console.error('Error counting problems:', error);
        return 0;
    }
}

// Function to update problem solved status for a user
async function updateProblemStatus(userId, problemId, isSolved) {
    try {
        const userRef = db.collection('users').doc(userId);
        
        // Update the solved status in the user's document
        await userRef.update({
            [`solvedProblems.${problemId}`]: isSolved
        });
        
        console.log(`Problem ${problemId} marked as ${isSolved ? 'solved' : 'unsolved'} for user ${userId}`);
        return true;
    } catch (error) {
        console.error('Error updating problem status:', error);
        return false;
    }
}

// Function to get all solved problems for a user
async function getUserSolvedProblems(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (userDoc.exists && userDoc.data().solvedProblems) {
            return userDoc.data().solvedProblems;
        }
        
        return {};
    } catch (error) {
        console.error('Error getting solved problems:', error);
        return {};
    }
}

// Function to count solved problems for a user
async function countSolvedProblems(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (userDoc.exists && userDoc.data().solvedProblems) {
            const solvedProblems = userDoc.data().solvedProblems;
            return Object.values(solvedProblems).filter(status => status === true).length;
        }
        
        return 0;
    } catch (error) {
        console.error('Error counting solved problems:', error);
        return 0;
    }
}
