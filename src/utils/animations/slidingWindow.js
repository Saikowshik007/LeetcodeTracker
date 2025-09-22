import { animationConfig } from './config';

// Animation function for Sliding Window - Fixed Size pattern
const animateSlidingWindowFixed = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample array for demonstration
  const array = [1, 3, 2, 6, 8, 4, 7, 2, 5];
  const windowSize = 3;

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
  let windowStart = 0;
  let description = '';

  // Calculate current window based on step
  if (step === 0) {
    description = `Initialize: window size = ${windowSize}`;
  } else {
    windowStart = Math.min(step - 1, array.length - windowSize);

    if (windowStart >= array.length - windowSize) {
      description = 'End of array reached';
    } else {
      const sum = array.slice(windowStart, windowStart + windowSize).reduce((a, b) => a + b, 0);
      description = `Current window sum: ${sum}`;
    }
  }

  // Draw window
  if (step > 0) {
    const windowStartX = startX + windowStart * boxWidth;
    const windowWidth = windowSize * boxWidth;

    // Draw window highlight
    context.fillStyle = 'rgba(66, 133, 244, 0.2)';
    context.fillRect(windowStartX, startY - 10, windowWidth, boxHeight + 20);

    // Draw window border
    context.strokeStyle = animationConfig.colors.secondary;
    context.lineWidth = 3;
    context.strokeRect(windowStartX, startY - 10, windowWidth, boxHeight + 20);

    // Draw window sum
    const sum = array.slice(windowStart, windowStart + windowSize).reduce((a, b) => a + b, 0);
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`Sum: ${sum}`, windowStartX + windowWidth / 2, startY + boxHeight + 30);
  }

  // End animation if we've reached the end
  if (windowStart >= array.length - windowSize && step > 0) {
    return { description };
  }

  return { description };
};

export default animateSlidingWindowFixed;


