import { animationConfig } from './config';
import { drawTree } from './helpers';

// Animation function for Tree BFS
const animateTreeBFS = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample binary tree for demonstration
  const tree = {
    value: 1,
    left: {
      value: 2,
      left: { value: 4, left: null, right: null },
      right: { value: 5, left: null, right: null }
    },
    right: {
      value: 3,
      left: { value: 6, left: null, right: null },
      right: { value: 7, left: null, right: null }
    }
  };
  
  // Clear canvas
  context.clearRect(0, 0, width, height);
  
  // Draw tree
  drawTree(context, tree, width / 2, 50, 80);
  
  // BFS traversal order
  const bfsOrder = [1, 2, 3, 4, 5, 6, 7];
  const levelSizes = [1, 2, 4]; // Number of nodes at each level
  
  // Animation steps
  let description = '';
  let queue = [];
  let visited = [];
  
  if (step === 0) {
    description = 'Initial tree, BFS starts at root';
  } else {
    let currentStep = step;
    let level = 0;
    let nodesProcessed = 0;
    
    // Calculate which nodes have been processed
    while (currentStep > 0 && level < levelSizes.length) {
      if (currentStep >= levelSizes[level]) {
        visited.push(...bfsOrder.slice(nodesProcessed, nodesProcessed + levelSizes[level]));
        nodesProcessed += levelSizes[level];
        currentStep -= levelSizes[level];
        level++;
      } else {
        visited.push(...bfsOrder.slice(nodesProcessed, nodesProcessed + currentStep));
        break;
      }
    }
    
    // Calculate current queue
    if (level < levelSizes.length) {
      const nextLevelStart = visited.length;
      const nextLevelEnd = Math.min(nextLevelStart + levelSizes[level], bfsOrder.length);
      queue = bfsOrder.slice(nextLevelStart, nextLevelEnd);
    }
    
    description = `Visited: [${visited.join(', ')}], Queue: [${queue.join(', ')}]`;
    
    if (visited.length === bfsOrder.length) {
      description = 'BFS traversal complete: ' + bfsOrder.join(' → ');
    }
  }
  
  // Highlight visited nodes and queue
  highlightTreeNodes(context, tree, visited, queue, width / 2, 50, 80);
  
  return { description };
};

// Helper function to highlight nodes in a tree
const highlightTreeNodes = (context, node, visited, queue, x, y, horizontalSpacing, level = 0) => {
  if (!node) return;
  
  const nodeRadius = 20;
  
  // Check if this node is in the visited list or queue
  const isVisited = visited.includes(node.value);
  const isInQueue = queue.includes(node.value);
  
  // Highlight node if needed
  if (isVisited || isInQueue) {
    context.beginPath();
    context.arc(x, y, nodeRadius + 4, 0, 2 * Math.PI);
    
    if (isVisited) {
      context.fillStyle = 'rgba(52, 168, 83, 0.3)';
      context.strokeStyle = animationConfig.colors.secondary;
    } else {
      context.fillStyle = 'rgba(66, 133, 244, 0.3)';
      context.strokeStyle = animationConfig.colors.primary;
    }
    
    context.fill();
    context.lineWidth = 2;
    context.stroke();
  }
  
  // Calculate positions for children
  const verticalSpacing = 60;
  const nextLevel = level + 1;
  const nextHorizontalSpacing = horizontalSpacing / 2;
  
  // Recursively highlight children
  if (node.left) {
    const leftX = x - nextHorizontalSpacing;
    const leftY = y + verticalSpacing;
    highlightTreeNodes(context, node.left, visited, queue, leftX, leftY, nextHorizontalSpacing, nextLevel);
  }
  
  if (node.right) {
    const rightX = x + nextHorizontalSpacing;
    const rightY = y + verticalSpacing;
    highlightTreeNodes(context, node.right, visited, queue, rightX, rightY, nextHorizontalSpacing, nextLevel);
  }
};

export default animateTreeBFS;

