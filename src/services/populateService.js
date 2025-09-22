import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';

// Function to populate database with pattern data
export const populateDatabase = async (rawData) => {
  try {
    console.log('Starting database population...');

    // Parse the raw data
    const parsedData = parseRawData(rawData);

    if (!parsedData || parsedData.length === 0) {
      throw new Error('Failed to parse data or no data provided');
    }

    console.log(`Parsed ${parsedData.length} patterns`);

    // Use batched writes for better performance
    const batch = writeBatch(db);
    let problemCount = 0;

    parsedData.forEach(pattern => {
      const patternRef = doc(collection(db, 'patterns'), pattern.id);
      batch.set(patternRef, {
        name: pattern.name,
        id: pattern.id
      });

      // Add subpatterns as subcollection
      pattern.subPatterns.forEach(subPattern => {
        const subPatternRef = doc(collection(patternRef, 'subPatterns'), subPattern.id);
        batch.set(subPatternRef, {
          name: subPattern.name,
          id: subPattern.id
        });

        // Add problems as subcollection
        subPattern.problems.forEach(problem => {
          const problemRef = doc(collection(subPatternRef, 'problems'), problem.id);
          batch.set(problemRef, problem);
          problemCount++;
        });
      });
    });

    await batch.commit();
    console.log(`Database populated successfully with ${problemCount} problems!`);

    return { success: true, problemCount };
  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  }
};

// Function to parse raw data from the provided format
const parseRawData = (rawData) => {
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
};

// Helper function to generate ID from name
const generateId = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// Helper function to convert problem name to URL slug
const nameToUrlSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};