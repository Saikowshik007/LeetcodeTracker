import { animationConfig } from './config';
import { drawLinkedList, drawPartiallyReversedList } from './helpers';

// Animation function for In-place Reversal of a Linked List
const animateLinkedListReversal = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample linked list for demonstration
  const nodes = [1, 2, 3, 4, 5];
  
  // Clear canvas
  context.clearRect(0, 0, width, height);
  
  // Draw linked list
  const nodeRadius = 20;
  const horizontalSpacing = width / (nodes.length + 1);
  const startY = height / 2;
  
  // Animation steps
  let current = 0;
  let prev = null;
  let next = null;
  let description = '';
  
  if (step === 0) {
    description = 'Original linked list';
    drawLinkedList(context, nodes, horizontalSpacing, startY, nodeRadius, null, null, null);
  } else {
    // Simulate reversal steps
    const stepsPerNode = 3; // Each node takes 3 steps to reverse
    const nodeIndex = Math.floor((step - 1) / stepsPerNode);
    const subStep = (step - 1) % stepsPerNode;
    
    if (nodeIndex >= nodes.length) {
      description = 'Reversal complete';
      
      // Draw fully reversed list
      const reversedNodes = [...nodes].reverse();
      drawLinkedList(context, reversedNodes, horizontalSpacing, startY, nodeRadius, null, null, null);
    } else {
      current = nodeIndex;
      prev = nodeIndex > 0 ? nodeIndex - 1 : null;
      next = nodeIndex < nodes.length - 1 ? nodeIndex + 1 : null;
      
      if (subStep === 0) {
        description = `Step 1: Store next pointer (node ${next !== null ? nodes[next] : 'null'})`;
      } else if (subStep === 1) {
        description = `Step 2: Point current node ${nodes[current]} to previous node ${prev !== null ? nodes[prev] : 'null'}`;
        next = null; // Next is now stored but not shown
      } else {
        description = `Step 3: Move prev and current pointers forward`;
        const tempCurrent = current;
        current = current < nodes.length - 1 ? current + 1 : null;
        prev = tempCurrent;
      }
      
      // Draw partially reversed list
      drawPartiallyReversedList(context, nodes, nodeIndex, horizontalSpacing, startY, nodeRadius, prev, current, next, subStep);
    }
  }
  
  // Draw description
  context.fillStyle = animationConfig.colors.text;
  context.font = '14px Arial';
  context.textAlign = 'center';
  context.fillText(description, width / 2, 50);
  
  return { description };
};

export default animateLinkedListReversal;

// Made with Bob
