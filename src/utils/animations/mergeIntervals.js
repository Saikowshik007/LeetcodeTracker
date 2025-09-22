import { animationConfig } from './config';

// Animation function for Merge Intervals
const animateMergeIntervals = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample intervals for demonstration
  const intervals = [[1, 3], [2, 6], [8, 10], [15, 18]];
  
  // Clear canvas
  context.clearRect(0, 0, width, height);
  
  // Define scale for visualization
  const maxValue = 20;
  const scaleX = (width - 60) / maxValue;
  const startX = 30;
  const axisY = height - 40;
  const intervalHeight = 20;
  
  // Draw number line
  context.strokeStyle = animationConfig.colors.text;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(startX, axisY);
  context.lineTo(startX + maxValue * scaleX, axisY);
  context.stroke();
  
  // Draw ticks and labels
  for (let i = 0; i <= maxValue; i += 5) {
    const x = startX + i * scaleX;
    context.beginPath();
    context.moveTo(x, axisY - 5);
    context.lineTo(x, axisY + 5);
    context.stroke();
    
    context.fillStyle = animationConfig.colors.text;
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.fillText(i.toString(), x, axisY + 20);
  }
  
  // Animation steps
  let mergedIntervals = [];
  let description = '';
  
  if (step === 0) {
    description = 'Original intervals (sorted by start time)';
    mergedIntervals = [...intervals];
  } else {
    // Sort intervals by start time
    const sortedIntervals = [...intervals].sort((a, b) => a[0] - b[0]);
    mergedIntervals = [sortedIntervals[0]];
    
    const processedSteps = Math.min(step, sortedIntervals.length);
    
    for (let i = 1; i < processedSteps; i++) {
      const current = sortedIntervals[i];
      const lastMerged = mergedIntervals[mergedIntervals.length - 1];
      
      // If current interval overlaps with the last merged interval
      if (current[0] <= lastMerged[1]) {
        // Merge the intervals
        lastMerged[1] = Math.max(lastMerged[1], current[1]);
        description = `Merged interval [${lastMerged[0]}, ${lastMerged[1]}] with [${current[0]}, ${current[1]}]`;
      } else {
        // Add as separate interval
        mergedIntervals.push(current);
        description = `Added new interval [${current[0]}, ${current[1]}]`;
      }
    }
    
    if (processedSteps >= sortedIntervals.length) {
      description = `Final merged intervals: ${JSON.stringify(mergedIntervals)}`;
    }
  }
  
  // Draw intervals
  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const y = 50 + i * 30;
    
    // Draw interval
    const x1 = startX + interval[0] * scaleX;
    const x2 = startX + interval[1] * scaleX;
    
    context.fillStyle = 'rgba(66, 133, 244, 0.3)';
    context.fillRect(x1, y, x2 - x1, intervalHeight);
    
    context.strokeStyle = animationConfig.colors.primary;
    context.lineWidth = 2;
    context.strokeRect(x1, y, x2 - x1, intervalHeight);
    
    // Draw interval values
    context.fillStyle = animationConfig.colors.text;
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.fillText(`[${interval[0]}, ${interval[1]}]`, (x1 + x2) / 2, y + intervalHeight / 2 + 4);
  }
  
  // Draw merged intervals
  const mergedY = height - 100;
  context.fillStyle = animationConfig.colors.text;
  context.font = '14px Arial';
  context.textAlign = 'left';
  context.fillText("Merged:", startX, mergedY - 10);
  
  for (let i = 0; i < mergedIntervals.length; i++) {
    const interval = mergedIntervals[i];
    const x1 = startX + interval[0] * scaleX;
    const x2 = startX + interval[1] * scaleX;
    
    context.fillStyle = 'rgba(52, 168, 83, 0.3)';
    context.fillRect(x1, mergedY, x2 - x1, intervalHeight);
    
    context.strokeStyle = animationConfig.colors.secondary;
    context.lineWidth = 2;
    context.strokeRect(x1, mergedY, x2 - x1, intervalHeight);
    
    context.fillStyle = animationConfig.colors.text;
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.fillText(`[${interval[0]}, ${interval[1]}]`, (x1 + x2) / 2, mergedY + intervalHeight / 2 + 4);
  }
  
  return { description };
};

export default animateMergeIntervals;

// Made with Bob
