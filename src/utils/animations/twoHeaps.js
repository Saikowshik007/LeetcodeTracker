import { animationConfig } from './config';

// Animation function for Two Heaps
const animateTwoHeaps = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Sample array for finding median
  const array = [3, 1, 5, 4, 2, 8, 7, 6];
  
  // Clear canvas
  context.clearRect(0, 0, width, height);
  
  // Animation steps
  let maxHeap = []; // Stores smaller half
  let minHeap = []; // Stores larger half
  let processedArray = [];
  let median = null;
  let description = '';
  
  if (step === 0) {
    description = 'Initial array: ' + array.join(', ');
  } else {
    const processedSteps = Math.min(step, array.length);
    
    for (let i = 0; i < processedSteps; i++) {
      const num = array[i];
      processedArray.push(num);
      
      // Insert into heaps
      if (maxHeap.length === 0 || num <= Math.max(...maxHeap)) {
        maxHeap.push(num);
        maxHeap.sort((a, b) => b - a); // Max heap
      } else {
        minHeap.push(num);
        minHeap.sort((a, b) => a - b); // Min heap
      }
      
      // Balance heaps
      if (maxHeap.length > minHeap.length + 1) {
        minHeap.push(maxHeap.shift());
        minHeap.sort((a, b) => a - b);
      } else if (minHeap.length > maxHeap.length) {
        maxHeap.push(minHeap.shift());
        maxHeap.sort((a, b) => b - a);
      }
      
      // Calculate median
      if (maxHeap.length > minHeap.length) {
        median = maxHeap[0];
      } else {
        median = (maxHeap[0] + minHeap[0]) / 2;
      }
    }
    
    description = `Processed: [${processedArray.join(', ')}], Median: ${median}`;
  }
  
  // Draw array
  const boxWidth = width / (array.length + 2);
  const boxHeight = 40;
  const startX = boxWidth;
  const startY = 50;
  
  context.fillStyle = animationConfig.colors.text;
  context.font = '14px Arial';
  context.textAlign = 'left';
  context.fillText("Original Array:", startX, startY - 10);
  
  for (let i = 0; i < array.length; i++) {
    const x = startX + i * boxWidth;
    
    // Draw box
    const isProcessed = i < processedArray.length;
    
    context.fillStyle = isProcessed ? 'rgba(66, 133, 244, 0.2)' : animationConfig.colors.background;
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
  
  // Draw heaps
  const heapStartY = startY + boxHeight + 40;
  
  // Draw max heap
  context.fillStyle = animationConfig.colors.text;
  context.font = '14px Arial';
  context.textAlign = 'left';
  context.fillText("Max Heap (smaller half):", startX, heapStartY - 10);
  
  for (let i = 0; i < maxHeap.length; i++) {
    const x = startX + i * boxWidth;
    
    context.fillStyle = 'rgba(52, 168, 83, 0.2)';
    context.strokeStyle = animationConfig.colors.secondary;
    context.lineWidth = 2;
    context.fillRect(x, heapStartY, boxWidth, boxHeight);
    context.strokeRect(x, heapStartY, boxWidth, boxHeight);
    
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(maxHeap[i], x + boxWidth / 2, heapStartY + boxHeight / 2);
  }
  
  // Draw min heap
  const minHeapStartY = heapStartY + boxHeight + 20;
  
  context.fillStyle = animationConfig.colors.text;
  context.font = '14px Arial';
  context.textAlign = 'left';
  context.fillText("Min Heap (larger half):", startX, minHeapStartY - 10);
  
  for (let i = 0; i < minHeap.length; i++) {
    const x = startX + i * boxWidth;
    
    context.fillStyle = 'rgba(234, 67, 53, 0.2)';
    context.strokeStyle = animationConfig.colors.highlight;
    context.lineWidth = 2;
    context.fillRect(x, minHeapStartY, boxWidth, boxHeight);
    context.strokeRect(x, minHeapStartY, boxWidth, boxHeight);
    
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(minHeap[i], x + boxWidth / 2, minHeapStartY + boxHeight / 2);
  }
  
  // Draw median
  if (median !== null) {
    context.fillStyle = animationConfig.colors.text;
    context.font = '18px Arial';
    context.textAlign = 'center';
    context.fillText(`Current Median: ${median}`, width / 2, minHeapStartY + boxHeight + 30);
  }
  
  return { description };
};

export default animateTwoHeaps;

