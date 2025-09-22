import { animationConfig } from './config';

// Animation function for Dynamic Programming (Fibonacci example)
const animateDynamicProgramming = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  context.clearRect(0, 0, width, height);
  
  // Animation parameters
  const n = 6; // Calculate Fibonacci up to n
  const boxWidth = 60;
  const boxHeight = 40;
  const startX = width / 2 - (n * boxWidth) / 2;
  const startY = 80;
  const memoStartY = startY + boxHeight + 60;
  const recursionTreeStartY = memoStartY + boxHeight + 60;
  
  // Animation steps
  let description = '';
  let fibCalls = 0;
  let memo = Array(n + 1).fill(null);
  let currentCalculation = null;
  
  // Recursive Fibonacci function with memoization for animation
  const fib = (num, maxCalls) => {
    if (fibCalls >= maxCalls) {
      return null;
    }
    
    fibCalls++;
    currentCalculation = num;
    
    if (num <= 1) {
      memo[num] = num;
      return num;
    }
    
    if (memo[num] !== null) {
      return memo[num];
    }
    
    const result = fib(num - 1, maxCalls);
    if (result === null) return null;
    
    const result2 = fib(num - 2, maxCalls);
    if (result2 === null) return null;
    
    memo[num] = result + result2;
    return memo[num];
  };
  
  // Run the animation based on step
  if (step === 0) {
    description = `Initialize: Calculate Fibonacci(${n})`;
  } else {
    // Calculate Fibonacci with limited calls based on step
    fib(n, step);
    
    if (memo[n] !== null) {
      description = `Fibonacci(${n}) = ${memo[n]} (Completed in ${fibCalls} calls)`;
    } else {
      description = `Step ${step}: Computing Fibonacci(${currentCalculation})`;
    }
  }
  
  // Draw title
  context.fillStyle = animationConfig.colors.text;
  context.font = '18px Arial';
  context.textAlign = 'center';
  context.fillText(`Dynamic Programming: Fibonacci Sequence`, width / 2, 40);
  
  // Draw Fibonacci sequence boxes
  context.fillStyle = animationConfig.colors.text;
  context.font = '16px Arial';
  context.textAlign = 'left';
  context.fillText("Fibonacci Sequence:", 20, startY - 10);
  
  for (let i = 0; i <= n; i++) {
    const x = startX + i * boxWidth;
    
    // Draw box
    context.fillStyle = animationConfig.colors.background;
    context.strokeStyle = animationConfig.colors.primary;
    context.lineWidth = 2;
    context.fillRect(x, startY, boxWidth, boxHeight);
    context.strokeRect(x, startY, boxWidth, boxHeight);
    
    // Draw index
    context.fillStyle = animationConfig.colors.text;
    context.font = '14px Arial';
    context.textAlign = 'center';
    context.fillText(`F(${i})`, x + boxWidth / 2, startY + boxHeight / 2 - 8);
    
    // Draw value if calculated
    if (i <= 1 || memo[i] !== null) {
      context.fillStyle = animationConfig.colors.text;
      context.font = '16px Arial';
      context.fillText(`${i <= 1 ? i : memo[i]}`, x + boxWidth / 2, startY + boxHeight / 2 + 12);
    }
  }
  
  // Draw memoization table
  context.fillStyle = animationConfig.colors.text;
  context.font = '16px Arial';
  context.textAlign = 'left';
  context.fillText("Memoization Table:", 20, memoStartY - 10);
  
  for (let i = 0; i <= n; i++) {
    const x = startX + i * boxWidth;
    
    // Draw box
    const isMemoized = memo[i] !== null;
    context.fillStyle = isMemoized ? 'rgba(52, 168, 83, 0.2)' : animationConfig.colors.background;
    context.strokeStyle = isMemoized ? animationConfig.colors.secondary : animationConfig.colors.primary;
    context.lineWidth = 2;
    context.fillRect(x, memoStartY, boxWidth, boxHeight);
    context.strokeRect(x, memoStartY, boxWidth, boxHeight);
    
    // Draw index
    context.fillStyle = animationConfig.colors.text;
    context.font = '14px Arial';
    context.textAlign = 'center';
    context.fillText(`memo[${i}]`, x + boxWidth / 2, memoStartY + boxHeight / 2 - 8);
    
    // Draw value if memoized
    if (isMemoized) {
      context.fillStyle = animationConfig.colors.text;
      context.font = '16px Arial';
      context.fillText(`${memo[i]}`, x + boxWidth / 2, memoStartY + boxHeight / 2 + 12);
    }
  }
  
  // Draw recursion tree (simplified)
  if (step > 0) {
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'left';
    context.fillText("Recursion Tree (simplified):", 20, recursionTreeStartY - 10);
    
    // Draw root node
    const rootX = width / 2;
    const rootY = recursionTreeStartY + 30;
    const nodeRadius = 20;
    
    // Draw F(n) node
    drawNode(context, rootX, rootY, `F(${n})`, memo[n] !== null, currentCalculation === n);
    
    // Draw first level children if we've made enough calls
    if (fibCalls > 1) {
      const child1X = rootX - 80;
      const child1Y = rootY + 60;
      const child2X = rootX + 80;
      const child2Y = rootY + 60;
      
      // Draw lines to children
      context.beginPath();
      context.moveTo(rootX, rootY + nodeRadius);
      context.lineTo(child1X, child1Y - nodeRadius);
      context.strokeStyle = animationConfig.colors.primary;
      context.lineWidth = 1;
      context.stroke();
      
      context.beginPath();
      context.moveTo(rootX, rootY + nodeRadius);
      context.lineTo(child2X, child2Y - nodeRadius);
      context.strokeStyle = animationConfig.colors.primary;
      context.lineWidth = 1;
      context.stroke();
      
      // Draw F(n-1) node
      drawNode(context, child1X, child1Y, `F(${n-1})`, memo[n-1] !== null, currentCalculation === n-1);
      
      // Draw F(n-2) node
      drawNode(context, child2X, child2Y, `F(${n-2})`, memo[n-2] !== null, currentCalculation === n-2);
      
      // Draw second level for F(n-1) if we've made enough calls
      if (fibCalls > 3 && n > 2) {
        const grandchild1X = child1X - 40;
        const grandchild1Y = child1Y + 60;
        const grandchild2X = child1X + 40;
        const grandchild2Y = child1Y + 60;
        
        // Draw lines to grandchildren
        context.beginPath();
        context.moveTo(child1X, child1Y + nodeRadius);
        context.lineTo(grandchild1X, grandchild1Y - nodeRadius);
        context.strokeStyle = animationConfig.colors.primary;
        context.lineWidth = 1;
        context.stroke();
        
        context.beginPath();
        context.moveTo(child1X, child1Y + nodeRadius);
        context.lineTo(grandchild2X, grandchild2Y - nodeRadius);
        context.strokeStyle = animationConfig.colors.primary;
        context.lineWidth = 1;
        context.stroke();
        
        // Draw F(n-2) node
        drawNode(context, grandchild1X, grandchild1Y, `F(${n-2})`, memo[n-2] !== null, currentCalculation === n-2);
        
        // Draw F(n-3) node
        drawNode(context, grandchild2X, grandchild2Y, `F(${n-3})`, memo[n-3] !== null, currentCalculation === n-3);
      }
    }
  }
  
  // Draw description
  context.fillStyle = animationConfig.colors.text;
  context.font = '14px Arial';
  context.textAlign = 'center';
  context.fillText(description, width / 2, height - 20);
  
  return { description };
};

// Helper function to draw a node in the recursion tree
const drawNode = (context, x, y, label, isMemoized, isActive) => {
  const nodeRadius = 20;
  
  // Determine node color based on state
  let fillColor = animationConfig.colors.background;
  let strokeColor = animationConfig.colors.primary;
  
  if (isActive) {
    fillColor = 'rgba(234, 67, 53, 0.2)';
    strokeColor = animationConfig.colors.highlight;
  } else if (isMemoized) {
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
  context.font = '14px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(label, x, y);
};

export default animateDynamicProgramming;

