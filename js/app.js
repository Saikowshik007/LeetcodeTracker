// Main application logic

// DOM Elements
const patternsContainer = document.getElementById('patterns-container');
const totalProblemsElement = document.getElementById('total-problems');
const solvedProblemsElement = document.getElementById('solved-problems');
const progressFillElement = document.getElementById('progress-fill');
const progressPercentageElement = document.getElementById('progress-percentage');

// Global variables
let patterns = [];
let solvedProblems = {};
let currentUserId = null;

// Initialize the app with user data
async function initializeApp(userSolvedProblems = {}) {
    try {
        // Store the current user ID
        currentUserId = auth.currentUser.uid;
        
        // Store the user's solved problems
        solvedProblems = userSolvedProblems;
        
        // Fetch pattern data from Firebase
        patterns = await fetchPatternData();
        
        // Render patterns and problems
        renderPatterns(patterns);
        
        // Update statistics
        updateStatistics();
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Render patterns and problems
function renderPatterns(patterns) {
    // Clear the patterns container
    patternsContainer.innerHTML = '';
    
    // Render each pattern
    patterns.forEach(pattern => {
        // Create pattern card
        const patternCard = document.createElement('div');
        patternCard.className = 'pattern-card';
        
        // Create pattern header
        const patternHeader = document.createElement('div');
        patternHeader.className = 'pattern-header';
        
        // Create pattern title
        const patternTitle = document.createElement('h3');
        patternTitle.textContent = pattern.name;
        
        // Create pattern progress
        const patternProgress = document.createElement('div');
        patternProgress.className = 'pattern-progress';
        
        // Calculate pattern progress
        const patternTotalProblems = pattern.subPatterns.reduce((total, subPattern) => total + subPattern.problems.length, 0);
        let patternSolvedProblems = 0;
        
        pattern.subPatterns.forEach(subPattern => {
            subPattern.problems.forEach(problem => {
                if (solvedProblems[problem.id]) {
                    patternSolvedProblems++;
                }
            });
        });
        
        patternProgress.textContent = `${patternSolvedProblems}/${patternTotalProblems}`;
        
        // Append title and progress to header
        patternHeader.appendChild(patternTitle);
        patternHeader.appendChild(patternProgress);
        
        // Create pattern content
        const patternContent = document.createElement('div');
        patternContent.className = 'pattern-content';
        
        // Add click event to toggle pattern content
        patternHeader.addEventListener('click', () => {
            patternContent.classList.toggle('expanded');
        });
        
        // Render subpatterns
        pattern.subPatterns.forEach(subPattern => {
            // Create subpattern section
            const subPatternSection = document.createElement('div');
            subPatternSection.className = 'subpattern-section';
            
            // Create subpattern title
            const subPatternTitle = document.createElement('h4');
            subPatternTitle.textContent = subPattern.name;
            subPatternSection.appendChild(subPatternTitle);
            
            // Create problem list
            const problemList = document.createElement('ul');
            problemList.className = 'problem-list';
            
            // Render problems
            subPattern.problems.forEach(problem => {
                // Create problem item
                const problemItem = document.createElement('li');
                problemItem.className = 'problem-item';
                
                // Create problem info
                const problemInfo = document.createElement('div');
                problemInfo.className = 'problem-info';
                
                // Create problem title
                const problemTitle = document.createElement('div');
                problemTitle.className = 'problem-title';
                problemTitle.textContent = `${problem.id}. ${problem.name}`;
                
                // Create problem link
                const problemLink = document.createElement('a');
                problemLink.className = 'problem-link';
                problemLink.href = problem.url;
                problemLink.target = '_blank';
                problemLink.textContent = 'View on LeetCode';
                
                // Append title and link to info
                problemInfo.appendChild(problemTitle);
                problemInfo.appendChild(problemLink);
                
                // Create solved checkbox
                const solvedCheckbox = document.createElement('input');
                solvedCheckbox.type = 'checkbox';
                solvedCheckbox.className = 'solved-checkbox';
                solvedCheckbox.checked = solvedProblems[problem.id] || false;
                
                // Add event listener to checkbox
                solvedCheckbox.addEventListener('change', async () => {
                    await updateProblemStatus(currentUserId, problem.id, solvedCheckbox.checked);
                    solvedProblems[problem.id] = solvedCheckbox.checked;
                    updateStatistics();
                });
                
                // Append checkbox and info to item
                problemItem.appendChild(solvedCheckbox);
                problemItem.appendChild(problemInfo);
                
                // Append item to list
                problemList.appendChild(problemItem);
            });
            
            // Append problem list to subpattern section
            subPatternSection.appendChild(problemList);
            
            // Append subpattern section to pattern content
            patternContent.appendChild(subPatternSection);
        });
        
        // Append header and content to card
        patternCard.appendChild(patternHeader);
        patternCard.appendChild(patternContent);
        
        // Append card to container
        patternsContainer.appendChild(patternCard);
    });
}

// Update statistics
async function updateStatistics() {
    try {
        // Count total problems
        const totalProblems = await countTotalProblems();
        totalProblemsElement.textContent = totalProblems;
        
        // Count solved problems
        const solvedCount = await countSolvedProblems(currentUserId);
        solvedProblemsElement.textContent = solvedCount;
        
        // Calculate progress percentage
        const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
        progressFillElement.style.width = `${progressPercentage}%`;
        progressPercentageElement.textContent = `${progressPercentage}%`;
    } catch (error) {
        console.error('Error updating statistics:', error);
    }
}

// Add event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Firebase auth state change will trigger app initialization
});
