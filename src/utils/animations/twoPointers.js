import { animationConfig } from './config';

// Animation function for Two Pointers - Converging pattern
const animateTwoPointersConverging = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample array for demonstration
  const array = [1, 3, 4, 5, 7, 11, 15];
  const target = 9;

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
  }

  // Animation steps
  let left = 0;
  let right = array.length - 1;
  let description = '';

  // Calculate current pointers based on step
  if (step === 0) {
    description = `Initialize: left = 0, right = ${array.length - 1}`;
  } else {
    for (let i = 0; i < step; i++) {
      const sum = array[left] + array[right];
      if (sum === target) {
        description = `Found solution: ${array[left]} + ${array[right]} = ${target}`;
        break;
      } else if (sum < target) {
        left++;
        if (left > right) break;
      } else {
        right--;
        if (left > right) break;
      }
    }

    if (left > right) {
      description = 'No solution found';
      return null; // End animation
    }

    if (array[left] + array[right] === target) {
      description = `Found solution: ${array[left]} + ${array[right]} = ${target}`;
    } else {
      description = `Current sum: ${array[left]} + ${array[right]} = ${array[left] + array[right]}`;
      if (array[left] + array[right] < target) {
        description += ' (too small, move left pointer)';
      } else {
        description += ' (too large, move right pointer)';
      }
    }
  }

  // Draw pointers
  const leftX = startX + left * boxWidth;
  const rightX = startX + right * boxWidth;

  // Draw left pointer
  context.fillStyle = animationConfig.colors.secondary;
  context.beginPath();
  context.moveTo(leftX + boxWidth / 2, startY - 20);
  context.lineTo(leftX + boxWidth / 2 - 10, startY - 10);
  context.lineTo(leftX + boxWidth / 2 + 10, startY - 10);
  context.closePath();
  context.fill();

  // Draw right pointer
  context.fillStyle = animationConfig.colors.secondary;
  context.beginPath();
  context.moveTo(rightX + boxWidth / 2, startY - 20);
  context.lineTo(rightX + boxWidth / 2 - 10, startY - 10);
  context.lineTo(rightX + boxWidth / 2 + 10, startY - 10);
  context.closePath();
  context.fill();

  // Draw current sum
  context.fillStyle = animationConfig.colors.text;
  context.font = '16px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(`Target: ${target}`, width / 2, startY - 40);

  return { description };
};

export default animateTwoPointersConverging;

