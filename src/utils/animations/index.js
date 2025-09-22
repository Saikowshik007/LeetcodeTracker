import { animationConfig } from './config';
import * as helpers from './helpers';
import animateTwoPointersConverging from './twoPointers';
import animateSlidingWindowFixed from './slidingWindow';
import animateFastSlowPointers from './fastSlowPointers';
import animateMergeIntervals from './mergeIntervals';
import animateCyclicSort from './cyclicSort';
import animateLinkedListReversal from './linkedListReversal';
import animateTreeBFS from './treeBFS';
import animateTreeDFS from './treeDFS';
import animateTwoHeaps from './twoHeaps';
import animateSubsets from './subsets';
import animateBinarySearch from './binarySearch';
import animateTopologicalSort from './topologicalSort';
import animateDynamicProgramming from './dynamicProgramming';
import animateGreedyAlgorithms from './greedyAlgorithms';

// Animation registry - maps pattern IDs to animation functions
export const animationRegistry = {
  // Two Pointers
  'i-two-pointer-patterns': animateTwoPointersConverging,
  'pattern-1-two-pointers-converging-sorted-array-target-sum': animateTwoPointersConverging,
  
  // Sliding Window
  'ii-sliding-window-patterns': animateSlidingWindowFixed,
  'pattern-2-sliding-window-fixed-size': animateSlidingWindowFixed,
  
  // Fast & Slow Pointers
  'iii-fast-slow-pointers-patterns': animateFastSlowPointers,
  'pattern-3-fast-slow-pointers-cycle-detection': animateFastSlowPointers,
  
  // Merge Intervals
  'iv-merge-intervals-patterns': animateMergeIntervals,
  'pattern-4-merge-intervals': animateMergeIntervals,
  
  // Cyclic Sort
  'v-cyclic-sort-patterns': animateCyclicSort,
  'pattern-5-cyclic-sort': animateCyclicSort,
  
  // In-place Reversal of a Linked List
  'vi-in-place-reversal-patterns': animateLinkedListReversal,
  'pattern-6-in-place-reversal-of-linked-list': animateLinkedListReversal,
  
  // Tree BFS
  'vii-tree-bfs-patterns': animateTreeBFS,
  'pattern-7-tree-breadth-first-search': animateTreeBFS,
  
  // Tree DFS
  'viii-tree-dfs-patterns': animateTreeDFS,
  'pattern-8-tree-depth-first-search': animateTreeDFS,
  
  // Two Heaps
  'ix-two-heaps-patterns': animateTwoHeaps,
  'pattern-9-two-heaps': animateTwoHeaps,
  
  // Subsets
  'x-subsets-patterns': animateSubsets,
  'pattern-10-subsets': animateSubsets,
  
  // Modified Binary Search
  'xi-modified-binary-search-patterns': animateBinarySearch,
  'pattern-11-modified-binary-search': animateBinarySearch,
  
  // Topological Sort
  'xii-topological-sort-patterns': animateTopologicalSort,
  'pattern-12-topological-sort': animateTopologicalSort,
  
  // Dynamic Programming
  'xiii-dynamic-programming-patterns': animateDynamicProgramming,
  'pattern-13-dynamic-programming': animateDynamicProgramming,
  
  // Greedy Algorithms
  'xiv-greedy-algorithms-patterns': animateGreedyAlgorithms,
  'pattern-14-greedy-algorithms': animateGreedyAlgorithms
};

export { animationConfig, helpers };

