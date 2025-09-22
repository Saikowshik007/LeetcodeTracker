import { animationConfig } from './config';

// Animation function for Cyclic Sort
const animateCyclicSort = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample array for demonstration (0 to n-1 range)
  const array = [3, 1, 5, 4, 2, 0];
  
  // Clear canvas
  context.clearRect(0, 0, width, height);
  
  // Draw array
  const boxWidth = width / (array.length + 2);
  const boxHeight = 40;
  const startX = boxWidth;
  const startY = height / 2 - boxHeight / 2;
  
  // Animation steps
  let currentArray = [...array];
  let currentIndex = 0;
  let description = '';
  
  if (step === 0) {
    description = 'Initial array';
  } else {
    // Simulate cyclic sort steps
    for (let i = 0; i < step; i++) {
      if (currentIndex >= array.length) {
        description = 'Sort complete';
        break;
      }
      
      const correctPosition = currentArray[currentIndex];
      
      if (currentArray[currentIndex] !== currentIndex) {
        // Swap
        [currentArray[currentIndex], currentArray[correctPosition]] = 
          [currentArray[correctPosition], currentArray[currentIndex]];
        
        description = `Swap ${currentArray[correctPosition]} and ${currentArray[currentIndex]}`;
      } else {
        currentIndex++;
        description = `Element ${currentIndex-1} is in correct position, moving to next`;
      }
    }
  }
  
  // Draw array boxes
  for (let i = 0; i < currentArray.length; i++) {
    const x = startX + i * boxWidth;
    
    // Highlight current index
    const isCurrentIndex = (i === currentIndex && step > 0);
    const isCorrectPosition = (currentArray[i] === i);
    
    // Draw box
    context.fillStyle = isCurrentIndex ? 'rgba(234, 67, 53, 0.2)' : 
                        isCorrectPosition ? 'rgba(52, 168, 83, 0.2)' : 
                        animationConfig.colors.background;
    context.strokeStyle = isCurrentIndex ? animationConfig.colors.highlight : 
                          isCorrectPosition ? animationConfig.colors.secondary : 
                          animationConfig.colors.primary;
    context.lineWidth = 2;
    context.fillRect(x, startY, boxWidth, boxHeight);
    context.strokeRect(x, startY, boxWidth, boxHeight);
    
    // Draw value
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(currentArray[i], x + boxWidth / 2, startY + boxHeight / 2);
    
    // Draw index below
    context.fillStyle = animationConfig.colors.text;
    context.font = '12px Arial';
    context.fillText(`idx: ${i}`, x + boxWidth / 2, startY + boxHeight + 15);
  }
  
  // Draw description
  context.fillStyle = animationConfig.colors.text;
  context.font = '14px Arial';
  context.textAlign = 'center';
  context.fillText(description, width / 2, startY - 20);
  
  return { description };
};

export default animateCyclicSort;

