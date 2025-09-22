import { animationConfig } from './config';
import { drawTree } from './helpers';

// Helper function to get parent value of a node in the tree
const getParentValue = (tree, nodeValue, parent = null) => {
  if (!tree) return null;
  
  if ((tree.left && tree.left.value === nodeValue) || 
      (tree.right && tree.right.value === nodeValue)) {
    return tree.value;
  }
  
  return getParentValue(tree.left, nodeValue, tree.value) || 
         getParentValue(tree.right, nodeValue, tree.value);
};

// Helper function to get siblings of a node
const getSiblings = (tree, parentValue, nodeValue) => {
  // Find the parent node
  const findParent = (node) => {
    if (!node) return null;
    if (node.value === parentValue) return node;
    return findParent(node.left) || findParent(node.right);
  };
  
  const parent = findParent(tree);
  if (!parent) return [];
  
  const siblings = [];
  
  // Check if the node is in the left subtree
  if (parent.left && parent.left.value !== nodeValue && parent.right) {
    siblings.push(parent.right.value);
  }
  // Check if the node is in the right subtree
  else if (parent.right && parent.right.value !== nodeValue && parent.left) {
    siblings.push(parent.left.value);
  }
  
  return siblings;
};

// Animation function for Tree DFS
const animateTreeDFS = (container, step) => {
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
  
  // DFS traversal order (preorder)
  const dfsOrder = [1, 2, 4, 5, 3, 6, 7];
  
  // Animation steps
  let description = '';
  let visited = [];
  let stack = [];
  
  if (step === 0) {
    description = 'Initial tree, DFS starts at root';
    stack = [1];
  } else if (step <= dfsOrder.length) {
    visited = dfsOrder.slice(0, step);
    
    if (step < dfsOrder.length) {
      // Calculate stack based on DFS traversal
      const nextNode = dfsOrder[step];
      const parentValue = getParentValue(tree, nextNode);
      
      if (parentValue) {
        stack = [nextNode];
        
        // Add siblings to stack if they exist
        const siblings = getSiblings(tree, parentValue, nextNode);
        stack.push(...siblings);
      }
    }
    
    description = `Visited: [${visited.join(', ')}], Stack: [${stack.join(', ')}]`;
    
    if (step === dfsOrder.length) {
      description = 'DFS traversal complete: ' + dfsOrder.join(' → ');
    }
  }
  
  // Highlight visited nodes and stack
  highlightTreeNodes(context, tree, visited, stack, width / 2, 50, 80);
  
  return { description };
};

// Helper function to highlight nodes in a tree
const highlightTreeNodes = (context, node, visited, stack, x, y, horizontalSpacing, level = 0) => {
  if (!node) return;
  
  const nodeRadius = 20;
  
  // Check if this node is in the visited list or stack
  const isVisited = visited.includes(node.value);
  const isInStack = stack.includes(node.value);
  
  // Highlight node if needed
  if (isVisited || isInStack) {
    context.beginPath();
    context.arc(x, y, nodeRadius + 4, 0, 2 * Math.PI);
    
    if (isVisited) {
      context.fillStyle = 'rgba(52, 168, 83, 0.3)';
      context.strokeStyle = animationConfig.colors.secondary;
    } else {
      context.fillStyle = 'rgba(234, 67, 53, 0.3)';
      context.strokeStyle = animationConfig.colors.highlight;
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
    highlightTreeNodes(context, node.left, visited, stack, leftX, leftY, nextHorizontalSpacing, nextLevel);
  }
  
  if (node.right) {
    const rightX = x + nextHorizontalSpacing;
    const rightY = y + verticalSpacing;
    highlightTreeNodes(context, node.right, visited, stack, rightX, rightY, nextHorizontalSpacing, nextLevel);
  }
};

export default animateTreeDFS;

