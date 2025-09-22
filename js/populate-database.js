// Utility script to populate Firebase with LeetCode pattern data
// This script can be run from the browser console after Firebase is initialized

async function populateDatabase() {
    try {
        console.log('Starting database population...');
        
        // Parse the raw data from the provided format
        const rawData = document.getElementById('raw-data').value;
        const parsedData = parseRawData(rawData);
        
        if (!parsedData || parsedData.length === 0) {
            console.error('Failed to parse data or no data provided');
            return;
        }
        
        console.log(`Parsed ${parsedData.length} patterns`);
        
        // Add each pattern as a document in the patterns collection
        const batch = firebase.firestore().batch();
        let problemCount = 0;
        
        parsedData.forEach(pattern => {
            const patternRef = firebase.firestore().collection('patterns').doc(pattern.id);
            batch.set(patternRef, { 
                name: pattern.name,
                id: pattern.id
            });
            
            // Add subpatterns as subcollection
            pattern.subPatterns.forEach(subPattern => {
                const subPatternRef = patternRef.collection('subPatterns').doc(subPattern.id);
                batch.set(subPatternRef, {
                    name: subPattern.name,
                    id: subPattern.id
                });
                
                // Add problems as subcollection
                subPattern.problems.forEach(problem => {
                    const problemRef = subPatternRef.collection('problems').doc(problem.id);
                    batch.set(problemRef, problem);
                    problemCount++;
                });
            });
        });
        
        await batch.commit();
        console.log(`Database populated successfully with ${problemCount} problems!`);
    } catch (error) {
        console.error('Error populating database:', error);
    }
}

// Function to parse raw data from the provided format
function parseRawData(rawData) {
    try {
        const lines = rawData.split('\n');
        const patterns = [];
        let currentPattern = null;
        let currentSubPattern = null;
        
        lines.forEach(line => {
            line = line.trim();
            
            // Skip empty lines
            if (!line) return;
            
            // Pattern line (e.g., "I. Two Pointer Patterns")
            if (/^[IVX]+\.\s+.+/.test(line)) {
                const name = line;
                const id = generateId(name);
                currentPattern = { id, name, subPatterns: [] };
                patterns.push(currentPattern);
                currentSubPattern = null;
            }
            // Subpattern line (e.g., "Pattern 1: Two Pointers - Converging (Sorted Array Target Sum)")
            else if (/^Pattern\s+\d+:/.test(line)) {
                const name = line;
                const id = generateId(name);
                currentSubPattern = { id, name, problems: [] };
                if (currentPattern) {
                    currentPattern.subPatterns.push(currentSubPattern);
                }
            }
            // Problem line (e.g., "11. Container With Most Water, 15. 3Sum, ...")
            else if (currentSubPattern) {
                // Split by comma to get individual problems
                const problemStrings = line.split(',');
                
                problemStrings.forEach(problemString => {
                    // Extract problem ID and name
                    const match = problemString.trim().match(/^(\d+)\.\s+(.+)$/);
                    if (match) {
                        const id = match[1];
                        const name = match[2];
                        const url = `https://leetcode.com/problems/${nameToUrlSlug(name)}/`;
                        
                        currentSubPattern.problems.push({ id, name, url });
                    }
                });
            }
        });
        
        return patterns;
    } catch (error) {
        console.error('Error parsing raw data:', error);
        return null;
    }
}

// Helper function to generate ID from name
function generateId(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Helper function to convert problem name to URL slug
function nameToUrlSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Create UI for data input
function createPopulateUI() {
    // Create container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.padding = '20px';
    
    // Create content
    const content = document.createElement('div');
    content.style.backgroundColor = 'white';
    content.style.padding = '20px';
    content.style.borderRadius = '8px';
    content.style.maxWidth = '800px';
    content.style.width = '100%';
    content.style.maxHeight = '90vh';
    content.style.overflow = 'auto';
    
    // Create title
    const title = document.createElement('h2');
    title.textContent = 'Populate Firebase Database';
    title.style.marginBottom = '20px';
    
    // Create textarea
    const textarea = document.createElement('textarea');
    textarea.id = 'raw-data';
    textarea.style.width = '100%';
    textarea.style.height = '300px';
    textarea.style.marginBottom = '20px';
    textarea.style.padding = '10px';
    textarea.placeholder = 'Paste the raw LeetCode pattern data here...';
    
    // Create buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    
    const populateButton = document.createElement('button');
    populateButton.textContent = 'Populate Database';
    populateButton.style.padding = '10px 20px';
    populateButton.style.backgroundColor = '#4285f4';
    populateButton.style.color = 'white';
    populateButton.style.border = 'none';
    populateButton.style.borderRadius = '4px';
    populateButton.style.cursor = 'pointer';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#ea4335';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    
    // Add event listeners
    populateButton.addEventListener('click', populateDatabase);
    closeButton.addEventListener('click', () => {
        document.body.removeChild(container);
    });
    
    // Append elements
    buttonContainer.appendChild(populateButton);
    buttonContainer.appendChild(closeButton);
    
    content.appendChild(title);
    content.appendChild(textarea);
    content.appendChild(buttonContainer);
    
    container.appendChild(content);
    
    // Append to body
    document.body.appendChild(container);
}

// Function to show the populate UI
function showPopulateUI() {
    createPopulateUI();
}

