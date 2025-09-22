// Pattern solution animations

// Animation configuration
const animationConfig = {
    speed: 1000, // Default animation speed in ms
    colors: {
        primary: '#4285f4',
        secondary: '#34a853',
        highlight: '#ea4335',
        background: '#f5f5f5',
        text: '#333333'
    }
};

// Animation state
let animationState = {
    isPlaying: false,
    currentStep: 0,
    interval: null,
    currentAnimation: null
};

// Animation registry - maps pattern IDs to animation functions
const animationRegistry = {
    'two-pointers-converging': animateTwoPointersConverging,
    'two-pointers-fast-slow': animateTwoPointersFastSlow,
    'sliding-window-fixed': animateSlidingWindowFixed,
    'sliding-window-variable': animateSlidingWindowVariable
    // Add more animations as needed
};

// Function to initialize animation container
function initializeAnimationContainer(patternId) {
    const container = document.getElementById(`animation-${patternId}`);
    if (!container) return null;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = 200; // Fixed height for animations
    container.appendChild(canvas);
    
    // Create animation controls
    const controls = document.createElement('div');
    controls.className = 'animation-controls';
    
    const playButton = document.createElement('button');
    playButton.className = 'btn btn-small';
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    playButton.addEventListener('click', () => toggleAnimation(patternId));
    
    const resetButton = document.createElement('button');
    resetButton.className = 'btn btn-small';
    resetButton.innerHTML = '<i class="fas fa-undo"></i>';
    resetButton.addEventListener('click', () => resetAnimation(patternId));
    
    const speedControl = document.createElement('input');
    speedControl.type = 'range';
    speedControl.min = '0.5';
    speedControl.max = '2';
    speedControl.step = '0.1';
    speedControl.value = '1';
    speedControl.addEventListener('input', (e) => {
        animationConfig.speed = 1000 / e.target.value;
    });
    
    controls.appendChild(playButton);
    controls.appendChild(resetButton);
    controls.appendChild(speedControl);
    container.appendChild(controls);
    
    // Create description element
    const description = document.createElement('div');
    description.className = 'animation-description';
    container.appendChild(description);
    
    return {
        canvas,
        context: canvas.getContext('2d'),
        controls,
        playButton,
        resetButton,
        description
    };
}

// Function to start animation for a pattern
function startAnimation(patternId) {
    // Stop any running animation
    stopAnimation();
    
    // Get animation function
    const animationFunc = animationRegistry[patternId];
    if (!animationFunc) {
        console.error(`No animation found for pattern: ${patternId}`);
        return;
    }
    
    // Initialize animation container
    const container = initializeAnimationContainer(patternId);
    if (!container) return;
    
    // Initialize animation state
    animationState = {
        isPlaying: true,
        currentStep: 0,
        interval: null,
        currentAnimation: {
            patternId,
            container,
            func: animationFunc
        }
    };
    
    // Update play button
    container.playButton.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Start animation loop
    animationState.interval = setInterval(() => {
        const { currentStep, currentAnimation } = animationState;
        const { func, container } = currentAnimation;
        
        // Run animation step
        const result = func(container, currentStep);
        
        // If animation is complete, stop it
        if (!result) {
            stopAnimation();
            return;
        }
        
        // Update description
        if (result.description) {
            container.description.textContent = result.description;
        }
        
        // Increment step
        animationState.currentStep++;
    }, animationConfig.speed);
}

// Function to stop animation
function stopAnimation() {
    if (animationState.interval) {
        clearInterval(animationState.interval);
    }
    
    if (animationState.currentAnimation && animationState.currentAnimation.container) {
        animationState.currentAnimation.container.playButton.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    animationState.isPlaying = false;
}

// Function to toggle animation play/pause
function toggleAnimation(patternId) {
    if (!animationState.isPlaying) {
        if (animationState.currentAnimation && animationState.currentAnimation.patternId === patternId) {
            // Resume existing animation
            animationState.isPlaying = true;
            animationState.currentAnimation.container.playButton.innerHTML = '<i class="fas fa-pause"></i>';
            
            animationState.interval = setInterval(() => {
                const { currentStep, currentAnimation } = animationState;
                const { func, container } = currentAnimation;
                
                // Run animation step
                const result = func(container, currentStep);
                
                // If animation is complete, stop it
                if (!result) {
                    stopAnimation();
                    return;
                }
                
                // Update description
                if (result.description) {
                    container.description.textContent = result.description;
                }
                
                // Increment step
                animationState.currentStep++;
            }, animationConfig.speed);
        } else {
            // Start new animation
            startAnimation(patternId);
        }
    } else {
        // Pause animation
        stopAnimation();
    }
}

// Function to reset animation
function resetAnimation(patternId) {
    stopAnimation();
    animationState.currentStep = 0;
    
    if (animationState.currentAnimation && animationState.currentAnimation.patternId === patternId) {
        const { func, container } = animationState.currentAnimation;
        func(container, 0);
    }
}

// Animation function for Two Pointers - Converging pattern
function animateTwoPointersConverging(container, step) {
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
}

// Animation function for Two Pointers - Fast & Slow pattern
function animateTwoPointersFastSlow(container, step) {
    const { canvas, context } = container;
    const width = canvas.width;
    const height = canvas.height;
    
    // Sample linked list for demonstration
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const cycle = 3; // Index where the cycle starts (for visualization)
    
    // Clear canvas
    context.clearRect(0, 0, width, height);
    
    // Draw linked list
    const nodeRadius = 20;
    const nodeSpacing = 60;
    const startX = 50;
    const startY = height / 2;
    
    // Draw nodes and connections
    for (let i = 0; i < list.length; i++) {
        const x = startX + (i % 5) * nodeSpacing;
        const y = startY + Math.floor(i / 5) * nodeSpacing;
        
        // Draw node
        context.fillStyle = animationConfig.colors.background;
        context.strokeStyle = animationConfig.colors.primary;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(x, y, nodeRadius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        
        // Draw value
        context.fillStyle = animationConfig.colors.text;
        context.font = '14px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(list[i], x, y);
        
        // Draw connection to next node
        if (i < list.length - 1) {
            const nextX = startX + ((i + 1) % 5) * nodeSpacing;
            const nextY = startY + Math.floor((i + 1) / 5) * nodeSpacing;
            
            context.strokeStyle = animationConfig.colors.primary;
            context.beginPath();
            context.moveTo(x + nodeRadius, y);
            context.lineTo(nextX - nodeRadius, nextY);
            context.stroke();
        }
    }
    
    // Draw cycle connection (for visualization)
    const lastX = startX + ((list.length - 1) % 5) * nodeSpacing;
    const lastY = startY + Math.floor((list.length - 1) / 5) * nodeSpacing;
    const cycleX = startX + (cycle % 5) * nodeSpacing;
    const cycleY = startY + Math.floor(cycle / 5) * nodeSpacing;
    
    context.strokeStyle = animationConfig.colors.primary;
    context.beginPath();
    context.moveTo(lastX + nodeRadius, lastY);
    context.bezierCurveTo(
        lastX + nodeRadius + 50, lastY + 50,
        cycleX - nodeRadius - 50, cycleY + 50,
        cycleX - nodeRadius, cycleY
    );
    context.stroke();
    
    // Animation steps
    let slow = 0;
    let fast = 0;
    let description = '';
    
    // Calculate current pointers based on step
    if (step === 0) {
        description = 'Initialize: slow = head, fast = head';
    } else {
        for (let i = 0; i < step; i++) {
            slow = (slow + 1) % list.length;
            fast = (fast + 2) % list.length;
            
            if (slow === fast) {
                description = 'Cycle detected! Slow and fast pointers meet.';
                break;
            }
        }
        
        if (slow !== fast) {
            description = 'Moving pointers: slow advances by 1, fast advances by 2';
        }
    }
    
    // Draw slow pointer
    const slowX = startX + (slow % 5) * nodeSpacing;
    const slowY = startY + Math.floor(slow / 5) * nodeSpacing;
    
    context.fillStyle = animationConfig.colors.secondary;
    context.beginPath();
    context.arc(slowX, slowY - nodeRadius - 10, 5, 0, Math.PI * 2);
    context.fill();
    context.fillText('slow', slowX, slowY - nodeRadius - 20);
    
    // Draw fast pointer
    const fastX = startX + (fast % 5) * nodeSpacing;
    const fastY = startY + Math.floor(fast / 5) * nodeSpacing;
    
    context.fillStyle = animationConfig.colors.accent;
    context.beginPath();
    context.arc(fastX, fastY - nodeRadius - 10, 5, 0, Math.PI * 2);
    context.fill();
    context.fillText('fast', fastX, fastY - nodeRadius - 20);
    
    // End animation if cycle is detected
    if (slow === fast && step > 0) {
        return { description };
    }
    
    return { description };
}

// Animation function for Sliding Window - Fixed Size pattern
function animateSlidingWindowFixed(container, step) {
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
}

// Animation function for Sliding Window - Variable Size pattern
function animateSlidingWindowVariable(container, step) {
    const { canvas, context } = container;
    const width = canvas.width;
    const height = canvas.height;
    
    // Sample array for demonstration
    const array = [4, 2, 1, 7, 8, 1, 2, 8, 1, 0];
    const targetSum = 8;
    
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
    let start = 0;
    let end = 0;
    let sum = array[0];
    let description = '';
    let minLength = Infinity;
    let minStart = 0;
    let minEnd = 0;
    
    // Calculate current window based on step
    if (step === 0) {
        description = `Initialize: start = 0, end = 0, sum = ${array[0]}, target = ${targetSum}`;
    } else {
        for (let i = 0; i < step; i++) {
            if (sum >= targetSum) {
                // Update minimum length
                if (end - start + 1 < minLength) {
                    minLength = end - start + 1;
                    minStart = start;
                    minEnd = end;
                }
                
                // Shrink window from left
                sum -= array[start];
                start++;
            } else {
                // Expand window to right
                end++;
                if (end < array.length) {
                    sum += array[end];
                } else {
                    break;
                }
            }
        }
        
        if (end >= array.length && sum < targetSum) {
            if (minLength === Infinity) {
                description = 'No subarray found with sum >= target';
                return null; // End animation
            } else {
                description = `Minimum length subarray: ${minLength} (from index ${minStart} to ${minEnd})`;
                
                // Draw minimum window
                const minStartX = startX + minStart * boxWidth;
                const minWidth = (minEnd - minStart + 1) * boxWidth;
                
                context.fillStyle = 'rgba(52, 168, 83, 0.2)';
                context.fillRect(minStartX, startY - 10, minWidth, boxHeight + 20);
                
                context.strokeStyle = animationConfig.colors.secondary;
                context.lineWidth = 3;
                context.strokeRect(minStartX, startY - 10, minWidth, boxHeight + 20);
                
                return { description };
            }
        }
        
        if (sum >= targetSum) {
            description = `Current window sum: ${sum} >= ${targetSum} (shrink from left)`;
        } else {
            description = `Current window sum: ${sum} < ${targetSum} (expand to right)`;
        }
    }
    
    // Draw current window
    const windowStartX = startX + start * boxWidth;
    const windowWidth = (end - start + 1) * boxWidth;
    
    // Draw window highlight
    context.fillStyle = 'rgba(66, 133, 244, 0.2)';
    context.fillRect(windowStartX, startY - 10, windowWidth, boxHeight + 20);
    
    // Draw window border
    context.strokeStyle = animationConfig.colors.secondary;
    context.lineWidth = 3;
    context.strokeRect(windowStartX, startY - 10, windowWidth, boxHeight + 20);
    
    // Draw window sum
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`Sum: ${sum}`, windowStartX + windowWidth / 2, startY + boxHeight + 30);
    
    // Draw target
    context.fillStyle = animationConfig.colors.text;
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`Target: ${targetSum}`, width / 2, startY - 40);
    
    return { description };
}

