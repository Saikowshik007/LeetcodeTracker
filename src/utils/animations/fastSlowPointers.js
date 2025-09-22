import { animationConfig } from './config';
import { drawArrow, drawCurvedArrow } from './helpers';

// Animation function for Fast and Slow Pointers (Floyd's Cycle Detection)
const animateFastSlowPointers = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample linked list with cycle for demonstration
  // Visualize as: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 3 (cycle back to 3)
  const nodes = [1, 2, 3, 4, 5, 6];
  const cycleStart = 2; // Index where cycle begins (points to node with value 3)

  // Clear canvas
  context.clearRect(0, 0, width, height);

  // Draw linked list
  const nodeRadius = 20;
  const horizontalSpacing = width / (nodes.length + 1);
  const startY = height / 2;

  // Draw nodes and connections
  for (let i = 0; i < nodes.length; i++) {
    const x = (i + 1) * horizontalSpacing;
    
    // Draw node
    context.beginPath();
    context.arc(x, startY, nodeRadius, 0, 2 * Math.PI);
    context.fillStyle = animationConfig.colors.background;
    context.fill();
    context.strokeStyle = animationConfig.colors.primary;
    context.lineWidth = 2;
    context.stroke();
    
    // Draw node value
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(nodes[i], x, startY);
    
    // Draw arrow to next node
    if (i < nodes.length - 1) {
      const nextX = (i + 2) * horizontalSpacing;
      drawArrow(context, x + nodeRadius, startY, nextX - nodeRadius, startY, animationConfig.colors.primary);
    }
  }
  
  // Draw the cycle connection
  const lastX = nodes.length * horizontalSpacing;
  const cycleX = (cycleStart + 1) * horizontalSpacing;
  drawCurvedArrow(context, lastX + nodeRadius, startY, cycleX - nodeRadius, startY, animationConfig.colors.primary);
  
  // Animation steps
  let slow = 0;
  let fast = 0;
  let description = '';
  let cycleDetected = false;
  
  // Calculate current pointers based on step
  if (step === 0) {
    description = 'Initialize: slow = fast = head';
  } else {
    for (let i = 0; i < step; i++) {
      // Move slow pointer by 1
      slow = (slow + 1) % nodes.length;
      
      // Move fast pointer by 2
      fast = (fast + 1) % nodes.length;
      fast = (fast + 1) % nodes.length;
      
      // Check if pointers meet
      if (slow === fast) {
        cycleDetected = true;
        break;
      }
    }
    
    if (cycleDetected) {
      description = 'Cycle detected! Slow and fast pointers meet.';
      
      // Find cycle start (optional additional steps)
      if (step > nodes.length) {
        let finder = 0;
        let steps = step - nodes.length;
        for (let i = 0; i < Math.min(steps, nodes.length); i++) {
          slow = (slow + 1) % nodes.length;
          finder = (finder + 1) % nodes.length;
          
          if (slow === finder) {
            description = `Cycle start found at node with value ${nodes[finder]}`;
            break;
          }
        }
      }
    } else {
      description = `Slow pointer at ${nodes[slow]}, Fast pointer at ${nodes[fast]}`;
    }
  }
  
  // Draw slow pointer
  const slowX = (slow + 1) * horizontalSpacing;
  context.fillStyle = animationConfig.colors.secondary;
  context.beginPath();
  context.moveTo(slowX, startY + nodeRadius + 15);
  context.lineTo(slowX - 10, startY + nodeRadius + 5);
  context.lineTo(slowX + 10, startY + nodeRadius + 5);
  context.closePath();
  context.fill();
  context.fillText("S", slowX, startY + nodeRadius + 25);
  
  // Draw fast pointer
  const fastX = (fast + 1) * horizontalSpacing;
  context.fillStyle = animationConfig.colors.highlight;
  context.beginPath();
  context.moveTo(fastX, startY + nodeRadius + 15);
  context.lineTo(fastX - 10, startY + nodeRadius + 5);
  context.lineTo(fastX + 10, startY + nodeRadius + 5);
  context.closePath();
  context.fill();
  context.fillText("F", fastX, startY + nodeRadius + 25);
  
  return { description };
};

export default animateFastSlowPointers;

// Made with Bob
