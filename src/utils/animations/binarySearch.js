import { animationConfig } from './config';

// Animation function for Modified Binary Search
const animateBinarySearch = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample array for demonstration (rotated sorted array)
  const array = [4, 5, 6, 7, 0, 1, 2];
  const target = 0;
  
  // Clear canvas
  context.clearRect(0, 0, width, height);
  
  // Draw array
  const boxWidth = width / (array.length + 2);
  const boxHeight = 40;
  const startX = boxWidth;
  const startY = height / 2 - boxHeight / 2;
  
  // Draw array boxes
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
    
    // Draw index
    context.fillStyle = animationConfig.colors.text;
    context.font = '12px Arial';
    context.fillText(i, x + boxWidth / 2, startY + boxHeight + 15);
  }
  
  // Animation steps
  let left = 0;
  let right = array.length - 1;
  let mid = 0;
  let description = '';
  let found = false;
  
  if (step === 0) {
    description = `Initialize: left = 0, right = ${array.length - 1}, target = ${target}`;
  } else {
    // Simulate binary search steps
    for (let i = 0; i < step; i++) {
      if (left > right) {
        description = `Target ${target} not found`;
        break;
      }
      
      mid = Math.floor((left + right) / 2);
      
      if (array[mid] === target) {
        description = `Found target ${target} at index ${mid}`;
        found = true;
        break;
      }
      
      // This is the modified part for rotated arrays
      // Check if the left half is sorted
      if (array[left] <= array[mid]) {
        // If target is in the left half
        if (array[left] <= target && target < array[mid]) {
          right = mid - 1;
          description = `Left half is sorted and target ${target} is in this half. Set right = ${right}`;
        } else {
          left = mid + 1;
          description = `Left half is sorted but target ${target} is not in this half. Set left = ${left}`;
        }
      } 
      // Right half is sorted
      else {
        // If target is in the right half
        if (array[mid] < target && target <= array[right]) {
          left = mid + 1;
          description = `Right half is sorted and target ${target} is in this half. Set left = ${left}`;
        } else {
          right = mid - 1;
          description = `Right half is sorted but target ${target} is not in this half. Set right = ${right}`;
        }
      }
    }
  }
  
  // Draw pointers
  if (step > 0) {
    // Draw left pointer
    const leftX = startX + left * boxWidth;
    context.fillStyle = animationConfig.colors.secondary;
    context.beginPath();
    context.moveTo(leftX + boxWidth / 2, startY - 20);
    context.lineTo(leftX + boxWidth / 2 - 10, startY - 10);
    context.lineTo(leftX + boxWidth / 2 + 10, startY - 10);
    context.closePath();
    context.fill();
    context.fillText("L", leftX + boxWidth / 2, startY - 30);
    
    // Draw right pointer
    const rightX = startX + right * boxWidth;
    context.fillStyle = animationConfig.colors.secondary;
    context.beginPath();
    context.moveTo(rightX + boxWidth / 2, startY - 20);
    context.lineTo(rightX + boxWidth / 2 - 10, startY - 10);
    context.lineTo(rightX + boxWidth / 2 + 10, startY - 10);
    context.closePath();
    context.fill();
    context.fillText("R", rightX + boxWidth / 2, startY - 30);
    
    // Draw mid pointer
    const midX = startX + mid * boxWidth;
    context.fillStyle = animationConfig.colors.highlight;
    context.beginPath();
    context.moveTo(midX + boxWidth / 2, startY + boxHeight + 20);
    context.lineTo(midX + boxWidth / 2 - 10, startY + boxHeight + 10);
    context.lineTo(midX + boxWidth / 2 + 10, startY + boxHeight + 10);
    context.closePath();
    context.fill();
    context.fillText("M", midX + boxWidth / 2, startY + boxHeight + 30);
    
    // Highlight found element
    if (found) {
      const foundX = startX + mid * boxWidth;
      context.fillStyle = 'rgba(52, 168, 83, 0.3)';
      context.fillRect(foundX, startY - 5, boxWidth, boxHeight + 10);
      context.strokeStyle = animationConfig.colors.secondary;
      context.lineWidth = 3;
      context.strokeRect(foundX, startY - 5, boxWidth, boxHeight + 10);
    }
  }
  
  // Draw target
  context.fillStyle = animationConfig.colors.text;
  context.font = '16px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(`Target: ${target}`, width / 2, startY - 50);
  
  // Draw description
  context.fillStyle = animationConfig.colors.text;
  context.font = '14px Arial';
  context.textAlign = 'center';
  context.fillText(description, width / 2, height - 40);
  
  return { description };
};

export default animateBinarySearch;

// Made with Bob
