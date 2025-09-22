import { animationConfig } from './config';

// Animation function for Greedy Algorithms (Activity Selection example)
const animateGreedyAlgorithms = (container, step) => {
  const { canvas, context } = container;
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  context.clearRect(0, 0, width, height);
  
  // Sample activities for demonstration
  // Each activity has [start time, finish time]
  const activities = [
    [1, 4],
    [3, 5],
    [0, 6],
    [5, 7],
    [3, 9],
    [5, 9],
    [6, 10],
    [8, 11],
    [8, 12],
    [2, 14],
    [12, 16]
  ];
  
  // Sort activities by finish time (greedy approach)
  const sortedActivities = [...activities].sort((a, b) => a[1] - b[1]);
  
  // Animation parameters
  const timelineStartX = 50;
  const timelineEndX = width - 50;
  const timelineY = 100;
  const maxTime = 16;
  const activityHeight = 30;
  const activitySpacing = 10;
  
  // Animation steps
  let selectedActivities = [];
  let currentActivity = null;
  let description = '';
  
  if (step === 0) {
    description = 'Initial activities sorted by finish time';
  } else {
    // Simulate greedy activity selection
    let lastFinishTime = 0;
    
    for (let i = 0; i < Math.min(step, sortedActivities.length); i++) {
      const activity = sortedActivities[i];
      currentActivity = activity;
      
      if (activity[0] >= lastFinishTime) {
        selectedActivities.push(activity);
        lastFinishTime = activity[1];
        description = `Selected activity [${activity[0]}, ${activity[1]}]`;
      } else {
        description = `Skipped activity [${activity[0]}, ${activity[1]}] (conflicts with last selected activity)`;
      }
    }
    
    if (step >= sortedActivities.length) {
      description = `Greedy selection complete: ${selectedActivities.length} activities selected`;
    }
  }
  
  // Draw title
  context.fillStyle = animationConfig.colors.text;
  context.font = '18px Arial';
  context.textAlign = 'center';
  context.fillText('Greedy Algorithm: Activity Selection Problem', width / 2, 40);
  
  // Draw timeline
  context.beginPath();
  context.moveTo(timelineStartX, timelineY);
  context.lineTo(timelineEndX, timelineY);
  context.strokeStyle = animationConfig.colors.text;
  context.lineWidth = 2;
  context.stroke();
  
  // Draw time markers
  const timeScale = (timelineEndX - timelineStartX) / maxTime;
  for (let i = 0; i <= maxTime; i += 2) {
    const x = timelineStartX + i * timeScale;
    
    context.beginPath();
    context.moveTo(x, timelineY - 5);
    context.lineTo(x, timelineY + 5);
    context.stroke();
    
    context.fillStyle = animationConfig.colors.text;
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.fillText(i.toString(), x, timelineY + 20);
  }
  
  // Draw all activities
  for (let i = 0; i < sortedActivities.length; i++) {
    const activity = sortedActivities[i];
    const y = timelineY + 40 + i * (activityHeight + activitySpacing);
    
    // Determine if this activity is selected or current
    const isSelected = selectedActivities.includes(activity);
    const isCurrent = currentActivity === activity && step > 0 && step <= sortedActivities.length;
    
    // Draw activity bar
    const startX = timelineStartX + activity[0] * timeScale;
    const endX = timelineStartX + activity[1] * timeScale;
    const width = endX - startX;
    
    // Determine color based on state
    let fillColor = animationConfig.colors.background;
    let strokeColor = animationConfig.colors.primary;
    
    if (isSelected) {
      fillColor = 'rgba(52, 168, 83, 0.2)';
      strokeColor = animationConfig.colors.secondary;
    } else if (isCurrent) {
      fillColor = 'rgba(234, 67, 53, 0.2)';
      strokeColor = animationConfig.colors.highlight;
    }
    
    // Draw activity
    context.fillStyle = fillColor;
    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.fillRect(startX, y, width, activityHeight);
    context.strokeRect(startX, y, width, activityHeight);
    
    // Draw activity label
    context.fillStyle = animationConfig.colors.text;
    context.font = '14px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`[${activity[0]}, ${activity[1]}]`, startX + width / 2, y + activityHeight / 2);
    
    // Draw activity index
    context.fillStyle = animationConfig.colors.text;
    context.font = '12px Arial';
    context.textAlign = 'right';
    context.fillText(`Activity ${i + 1}:`, startX - 10, y + activityHeight / 2);
  }
  
  // Draw selected activities
  if (selectedActivities.length > 0) {
    const selectedY = timelineY - 60;
    
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'left';
    context.fillText('Selected Activities:', timelineStartX, selectedY - 10);
    
    for (let i = 0; i < selectedActivities.length; i++) {
      const activity = selectedActivities[i];
      const startX = timelineStartX + activity[0] * timeScale;
      const endX = timelineStartX + activity[1] * timeScale;
      const width = endX - startX;
      
      // Draw activity
      context.fillStyle = 'rgba(52, 168, 83, 0.2)';
      context.strokeStyle = animationConfig.colors.secondary;
      context.lineWidth = 2;
      context.fillRect(startX, selectedY, width, activityHeight);
      context.strokeRect(startX, selectedY, width, activityHeight);
      
      // Draw activity label
      context.fillStyle = animationConfig.colors.text;
      context.font = '14px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(`[${activity[0]}, ${activity[1]}]`, startX + width / 2, selectedY + activityHeight / 2);
    }
  }
  
  // Draw description
  context.fillStyle = animationConfig.colors.text;
  context.font = '14px Arial';
  context.textAlign = 'center';
  context.fillText(description, width / 2, height - 20);
  
  return { description };
};

export default animateGreedyAlgorithms;

