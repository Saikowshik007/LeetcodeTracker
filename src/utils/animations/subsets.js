import { animationConfig } from './config';

// Animation function for Subsets/Backtracking
const animateSubsets = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample array for demonstration
  const array = [1, 2, 3];
  
  // Clear canvas
  context.clearRect(0, 0, width, height);
  
  // Generate all subsets
  const allSubsets = [[]];
  for (const num of array) {
    const newSubsets = [];
    for (const subset of allSubsets) {
      newSubsets.push([...subset, num]);
    }
    allSubsets.push(...newSubsets);
  }
  
  // Draw original array
  const boxWidth = 40;
  const boxHeight = 40;
  const startX = width / 2 - (array.length * boxWidth) / 2;
  const startY = 50;
  
  context.fillStyle = animationConfig.colors.text;
  context.font = '16px Arial';
  context.textAlign = 'left';
  context.fillText("Original Array:", 20, startY - 10);
  
  for (let i = 0; i < array.length; i++) {
    const x = startX + i * boxWidth;
    
    // Draw box
    context.fillStyle = animationConfig.colors.background;
    context.strokeStyle = animationConfig.colors.primary;
    context.lineWidth = 2;
    context.fillRect(x, startY, boxWidth, boxHeight);
    context.strokeRect(x, startY, boxWidth, boxHeight);
    
    // Draw value
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(array[i], x + boxWidth / 2, startY + boxHeight / 2);
  }
  
  // Animation steps
  let currentStep = 0;
  let description = '';
  
  if (step === 0) {
    description = 'Initial array: [' + array.join(', ') + ']';
    currentStep = 0;
  } else {
    currentStep = Math.min(step, allSubsets.length);
    description = `Generated ${currentStep} of ${allSubsets.length} subsets`;
  }
  
  // Draw subsets
  const subsetsPerRow = 4;
  const subsetBoxWidth = 80;
  const subsetBoxHeight = 40;
  const subsetStartX = width / 2 - (subsetsPerRow * subsetBoxWidth) / 2;
  const subsetStartY = startY + boxHeight + 40;
  
  context.fillStyle = animationConfig.colors.text;
  context.font = '16px Arial';
  context.textAlign = 'left';
  context.fillText("Subsets:", 20, subsetStartY - 10);
  
  for (let i = 0; i < currentStep; i++) {
    const row = Math.floor(i / subsetsPerRow);
    const col = i % subsetsPerRow;
    
    const x = subsetStartX + col * subsetBoxWidth;
    const y = subsetStartY + row * (subsetBoxHeight + 10);
    
    // Draw subset box
    context.fillStyle = 'rgba(66, 133, 244, 0.1)';
    context.strokeStyle = animationConfig.colors.primary;
    context.lineWidth = 2;
    context.fillRect(x, y, subsetBoxWidth, subsetBoxHeight);
    context.strokeRect(x, y, subsetBoxWidth, subsetBoxHeight);
    
    // Draw subset content
    context.fillStyle = animationConfig.colors.text;
    context.font = '14px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    const subsetStr = allSubsets[i].length === 0 ? '∅' : '[' + allSubsets[i].join(', ') + ']';
    context.fillText(subsetStr, x + subsetBoxWidth / 2, y + subsetBoxHeight / 2);
  }
  
  // Draw current subset being generated
  if (step > 0 && step < allSubsets.length) {
    const currentSubset = allSubsets[step];
    
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.fillText(`Current subset: [${currentSubset.join(', ')}]`, width / 2, height - 40);
  }
  
  // Draw decision tree (simplified)
  if (step > 0) {
    const treeStartX = width / 2;
    const treeStartY = height - 100;
    const nodeRadius = 15;
    const levelHeight = 40;
    
    // Draw root node
    context.beginPath();
    context.arc(treeStartX, treeStartY, nodeRadius, 0, 2 * Math.PI);
    context.fillStyle = animationConfig.colors.background;
    context.fill();
    context.strokeStyle = animationConfig.colors.primary;
    context.lineWidth = 2;
    context.stroke();
    
    context.fillStyle = animationConfig.colors.text;
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('∅', treeStartX, treeStartY);
    
    // Highlight the path to the current subset
    if (step < allSubsets.length) {
      const currentSubset = allSubsets[step];
      let currentX = treeStartX;
      let currentY = treeStartY;
      
      for (let i = 0; i < array.length; i++) {
        const isIncluded = currentSubset.includes(array[i]);
        const nextX = currentX + (isIncluded ? 30 : -30);
        const nextY = currentY + levelHeight;
        
        // Draw line
        context.beginPath();
        context.moveTo(currentX, currentY + nodeRadius);
        context.lineTo(nextX, nextY - nodeRadius);
        context.strokeStyle = animationConfig.colors.secondary;
        context.lineWidth = 2;
        context.stroke();
        
        // Draw node
        context.beginPath();
        context.arc(nextX, nextY, nodeRadius, 0, 2 * Math.PI);
        context.fillStyle = 'rgba(52, 168, 83, 0.2)';
        context.fill();
        context.strokeStyle = animationConfig.colors.secondary;
        context.lineWidth = 2;
        context.stroke();
        
        // Update current position
        currentX = nextX;
        currentY = nextY;
      }
    }
  }
  
  return { description };
};

export default animateSubsets;
