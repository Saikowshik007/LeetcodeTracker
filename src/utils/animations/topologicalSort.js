import { animationConfig } from './config';

// Animation function for Topological Sort
const animateTopologicalSort = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample graph for demonstration
  const graph = {
    'A': ['C', 'D'],
    'B': ['D'],
    'C': ['E'],
    'D': ['F'],
    'E': ['F', 'H'],
    'F': ['G'],
    'G': [],
    'H': []
  };
  
  // Node positions
  const nodePositions = {
    'A': { x: 100, y: 100 },
    'B': { x: 100, y: 200 },
    'C': { x: 200, y: 100 },
    'D': { x: 200, y: 200 },
    'E': { x: 300, y: 100 },
    'F': { x: 300, y: 200 },
    'G': { x: 400, y: 200 },
    'H': { x: 400, y: 100 }
  };
  
  // Clear canvas
  context.clearRect(0, 0, width, height);
  
  // Animation steps
  let visited = new Set();
  let stack = [];
  let currentNode = null;
  let processing = [];
  let description = '';
  
  if (step === 0) {
    description = 'Initial graph, topological sort starts with DFS';
  } else {
    // Simulate topological sort steps
    const nodes = Object.keys(graph);
    let stepCount = 0;
    
    // DFS function for topological sort
    const dfs = (node, visited, stack, processing, maxSteps) => {
      if (stepCount >= maxSteps) return false;
      
      stepCount++;
      processing.push(node);
      
      if (visited.has(node)) {
        processing.pop();
        return true;
      }
      
      visited.add(node);
      
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          currentNode = neighbor;
          if (!dfs(neighbor, visited, stack, processing, maxSteps)) {
            return false;
          }
        }
      }
      
      stack.unshift(node);
      processing.pop();
      return true;
    };
    
    // Run DFS for each unvisited node
    for (const node of nodes) {
      if (!visited.has(node) && stepCount < step) {
        currentNode = node;
        if (!dfs(node, visited, stack, processing, step)) {
          break;
        }
      }
    }
    
    if (stepCount >= step) {
      description = `Processed nodes: ${Array.from(visited).join(', ')}`;
      if (stack.length === nodes.length) {
        description = `Topological sort complete: ${stack.join(' → ')}`;
      } else if (processing.length > 0) {
        description = `Processing node: ${processing[processing.length - 1]}`;
      }
    }
  }
  
  // Draw graph
  // Draw edges
  for (const [node, neighbors] of Object.entries(graph)) {
    const startX = nodePositions[node].x;
    const startY = nodePositions[node].y;
    
    for (const neighbor of neighbors) {
      const endX = nodePositions[neighbor].x;
      const endY = nodePositions[neighbor].y;
      
      // Draw arrow
      const angle = Math.atan2(endY - startY, endX - startX);
      const nodeRadius = 20;
      
      // Calculate start and end points adjusted for node radius
      const adjustedStartX = startX + nodeRadius * Math.cos(angle);
      const adjustedStartY = startY + nodeRadius * Math.sin(angle);
      const adjustedEndX = endX - nodeRadius * Math.cos(angle);
      const adjustedEndY = endY - nodeRadius * Math.sin(angle);
      
      // Draw line
      context.beginPath();
      context.moveTo(adjustedStartX, adjustedStartY);
      context.lineTo(adjustedEndX, adjustedEndY);
      context.strokeStyle = animationConfig.colors.primary;
      context.lineWidth = 2;
      context.stroke();
      
      // Draw arrowhead
      const headLength = 10;
      context.beginPath();
      context.moveTo(adjustedEndX, adjustedEndY);
      context.lineTo(
        adjustedEndX - headLength * Math.cos(angle - Math.PI / 6),
        adjustedEndY - headLength * Math.sin(angle - Math.PI / 6)
      );
      context.lineTo(
        adjustedEndX - headLength * Math.cos(angle + Math.PI / 6),
        adjustedEndY - headLength * Math.sin(angle + Math.PI / 6)
      );
      context.closePath();
      context.fillStyle = animationConfig.colors.primary;
      context.fill();
    }
  }
  
  // Draw nodes
  for (const [node, position] of Object.entries(nodePositions)) {
    const { x, y } = position;
    const nodeRadius = 20;
    
    // Determine node color based on state
    let fillColor = animationConfig.colors.background;
    let strokeColor = animationConfig.colors.primary;
    
    if (processing.includes(node)) {
      fillColor = 'rgba(234, 67, 53, 0.2)';
      strokeColor = animationConfig.colors.highlight;
    } else if (visited.has(node)) {
      fillColor = 'rgba(52, 168, 83, 0.2)';
      strokeColor = animationConfig.colors.secondary;
    }
    
    // Draw node
    context.beginPath();
    context.arc(x, y, nodeRadius, 0, 2 * Math.PI);
    context.fillStyle = fillColor;
    context.fill();
    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.stroke();
    
    // Draw node label
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(node, x, y);
  }
  
  // Draw topological order
  if (stack.length > 0) {
    const orderStartX = 100;
    const orderStartY = height - 80;
    const boxWidth = 40;
    const boxHeight = 40;
    
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'left';
    context.fillText("Topological Order:", 20, orderStartY - 10);
    
    for (let i = 0; i < stack.length; i++) {
      const x = orderStartX + i * (boxWidth + 10);
      
      // Draw box
      context.fillStyle = 'rgba(52, 168, 83, 0.2)';
      context.strokeStyle = animationConfig.colors.secondary;
      context.lineWidth = 2;
      context.fillRect(x, orderStartY, boxWidth, boxHeight);
      context.strokeRect(x, orderStartY, boxWidth, boxHeight);
      
      // Draw node label
      context.fillStyle = animationConfig.colors.text;
      context.font = '16px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(stack[i], x + boxWidth / 2, orderStartY + boxHeight / 2);
    }
  }
  
  // Draw description
  context.fillStyle = animationConfig.colors.text;
  context.font = '14px Arial';
  context.textAlign = 'center';
  context.fillText(description, width / 2, 40);
  
  return { description };
};

export default animateTopologicalSort;

