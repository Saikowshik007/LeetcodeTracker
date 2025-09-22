import { animationConfig } from './config';

// Helper function to draw an arrow
export const drawArrow = (context, fromX, fromY, toX, toY, color) => {
  const headLength = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  // Draw line
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.stroke();
  
  // Draw arrowhead
  context.beginPath();
  context.moveTo(toX, toY);
  context.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  context.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  context.closePath();
  context.fillStyle = color;
  context.fill();
};

// Helper function to draw a curved arrow (for linked list cycles)
export const drawCurvedArrow = (context, fromX, fromY, toX, toY, color) => {
  const controlPointX = (fromX + toX) / 2;
  const controlPointY = fromY - 50;
  
  // Draw curved line
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.quadraticCurveTo(controlPointX, controlPointY, toX, toY);
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.stroke();
  
  // Calculate angle at the end point for the arrow head
  const endAngle = Math.atan2(toY - controlPointY, toX - controlPointX);
  const headLength = 10;
  
  // Draw arrowhead
  context.beginPath();
  context.moveTo(toX, toY);
  context.lineTo(
    toX - headLength * Math.cos(endAngle - Math.PI / 6),
    toY - headLength * Math.sin(endAngle - Math.PI / 6)
  );
  context.lineTo(
    toX - headLength * Math.cos(endAngle + Math.PI / 6),
    toY - headLength * Math.sin(endAngle + Math.PI / 6)
  );
  context.closePath();
  context.fillStyle = color;
  context.fill();
};

// Helper function to draw a linked list
export const drawLinkedList = (context, nodes, horizontalSpacing, startY, nodeRadius, prev, current, next) => {
  for (let i = 0; i < nodes.length; i++) {
    const x = (i + 1) * horizontalSpacing;
    
    // Determine node color based on pointers
    let fillColor = animationConfig.colors.background;
    let strokeColor = animationConfig.colors.primary;
    
    if (i === current) {
      fillColor = 'rgba(234, 67, 53, 0.2)';
      strokeColor = animationConfig.colors.highlight;
    } else if (i === prev) {
      fillColor = 'rgba(52, 168, 83, 0.2)';
      strokeColor = animationConfig.colors.secondary;
    } else if (i === next) {
      fillColor = 'rgba(66, 133, 244, 0.2)';
      strokeColor = animationConfig.colors.primary;
    }
    
    // Draw node
    context.beginPath();
    context.arc(x, startY, nodeRadius, 0, 2 * Math.PI);
    context.fillStyle = fillColor;
    context.fill();
    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.stroke();
    
    // Draw node value
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(nodes[i], x, startY);
    
    // Draw arrow to next node if not the last node
    if (i < nodes.length - 1) {
      drawArrow(context, x + nodeRadius, startY, (i + 2) * horizontalSpacing - nodeRadius, startY, animationConfig.colors.primary);
    }
  }
};

// Helper function to draw a partially reversed linked list
export const drawPartiallyReversedList = (context, nodes, nodeIndex, horizontalSpacing, startY, nodeRadius, prev, current, next, subStep) => {
  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    const x = (i + 1) * horizontalSpacing;
    
    // Determine node color based on pointers
    let fillColor = animationConfig.colors.background;
    let strokeColor = animationConfig.colors.primary;
    
    if (i === current) {
      fillColor = 'rgba(234, 67, 53, 0.2)';
      strokeColor = animationConfig.colors.highlight;
    } else if (i === prev) {
      fillColor = 'rgba(52, 168, 83, 0.2)';
      strokeColor = animationConfig.colors.secondary;
    } else if (i === next) {
      fillColor = 'rgba(66, 133, 244, 0.2)';
      strokeColor = animationConfig.colors.primary;
    }
    
    // Draw node
    context.beginPath();
    context.arc(x, startY, nodeRadius, 0, 2 * Math.PI);
    context.fillStyle = fillColor;
    context.fill();
    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.stroke();
    
    // Draw node value
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(nodes[i], x, startY);
  }
  
  // Draw arrows based on reversal progress
  for (let i = 0; i < nodes.length; i++) {
    const x = (i + 1) * horizontalSpacing;
    
    if (i < nodeIndex) {
      // These nodes are already reversed
      if (i > 0) {
        drawArrow(context, x + nodeRadius, startY, (i) * horizontalSpacing + nodeRadius, startY, animationConfig.colors.secondary);
      }
    } else if (i === nodeIndex) {
      // Current node being processed
      if (subStep >= 1) {
        // Point current to prev
        if (prev !== null) {
          drawArrow(context, x + nodeRadius, startY, (prev + 1) * horizontalSpacing + nodeRadius, startY, animationConfig.colors.highlight);
        }
      } else {
        // Not yet reversed
        if (i < nodes.length - 1) {
          drawArrow(context, x + nodeRadius, startY, (i + 2) * horizontalSpacing - nodeRadius, startY, animationConfig.colors.primary);
        }
      }
    } else {
      // Nodes not yet processed
      if (i < nodes.length - 1) {
        drawArrow(context, x + nodeRadius, startY, (i + 2) * horizontalSpacing - nodeRadius, startY, animationConfig.colors.primary);
      }
    }
  }
  
  // Draw pointer labels
  if (prev !== null) {
    const prevX = (prev + 1) * horizontalSpacing;
    context.fillStyle = animationConfig.colors.secondary;
    context.font = '14px Arial';
    context.fillText("prev", prevX, startY + nodeRadius + 20);
  }
  
  if (current !== null) {
    const currentX = (current + 1) * horizontalSpacing;
    context.fillStyle = animationConfig.colors.highlight;
    context.font = '14px Arial';
    context.fillText("curr", currentX, startY + nodeRadius + 20);
  }
  
  if (next !== null) {
    const nextX = (next + 1) * horizontalSpacing;
    context.fillStyle = animationConfig.colors.primary;
    context.font = '14px Arial';
    context.fillText("next", nextX, startY + nodeRadius + 20);
  }
};

// Helper function to draw a binary tree
export const drawTree = (context, node, x, y, horizontalSpacing, level = 0) => {
  if (!node) return;
  
  const nodeRadius = 20;
  
  // Draw node
  context.beginPath();
  context.arc(x, y, nodeRadius, 0, 2 * Math.PI);
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
  context.fillText(node.value, x, y);
  
  // Calculate positions for children
  const verticalSpacing = 60;
  const nextLevel = level + 1;
  const nextHorizontalSpacing = horizontalSpacing / 2;
  
  // Draw left child
  if (node.left) {
    const leftX = x - nextHorizontalSpacing;
    const leftY = y + verticalSpacing;
    
    // Draw line to left child
    context.beginPath();
    context.moveTo(x - nodeRadius / 2, y + nodeRadius / 2);
    context.lineTo(leftX + nodeRadius / 2, leftY - nodeRadius / 2);
    context.strokeStyle = animationConfig.colors.primary;
    context.lineWidth = 1;
    context.stroke();
    
    // Draw left subtree
    drawTree(context, node.left, leftX, leftY, nextHorizontalSpacing, nextLevel);
  }
  
  // Draw right child
  if (node.right) {
    const rightX = x + nextHorizontalSpacing;
    const rightY = y + verticalSpacing;
    
    // Draw line to right child
    context.beginPath();
    context.moveTo(x + nodeRadius / 2, y + nodeRadius / 2);
    context.lineTo(rightX - nodeRadius / 2, rightY - nodeRadius / 2);
    context.strokeStyle = animationConfig.colors.primary;
    context.lineWidth = 1;
    context.stroke();
    
    // Draw right subtree
    drawTree(context, node.right, rightX, rightY, nextHorizontalSpacing, nextLevel);
  }
};

// Helper function to highlight nodes in a tree
export const highlightTreeNodes = (context, node, visited, queue, x, y, horizontalSpacing, level = 0) => {
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

// Made with Bob
