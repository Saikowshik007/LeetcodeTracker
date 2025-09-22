import React, { useState, useRef, useEffect, useCallback } from 'react';
import { animationRegistry } from '../utils/animations';

const AnimationContainer = ({ patternId }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [description, setDescription] = useState('');
  const intervalRef = useRef(null);
  const currentStepRef = useRef(0);

  const animationFunc = animationRegistry[patternId];

  const resetAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    currentStepRef.current = 0;
    setDescription('');

    if (animationFunc && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const result = animationFunc({ canvas, context }, 0);
      if (result && result.description) {
        setDescription(result.description);
      }
    }
  }, [animationFunc]);

  useEffect(() => {
    if (animationFunc && canvasRef.current) {
      // Initialize animation
      resetAnimation();
    }
  }, [animationFunc, resetAnimation]);

  const startAnimation = () => {
    if (!animationFunc || !canvasRef.current) return;

    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      currentStepRef.current += 1;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const result = animationFunc({ canvas, context }, currentStepRef.current);

      if (!result) {
        // Animation complete
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      if (result.description) {
        setDescription(result.description);
      }
    }, 1000 / speed);
  };

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    stopAnimation();
    setCurrentStep(0);
    setDescription('');

    if (animationFunc && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const result = animationFunc({ canvas, context }, 0);
      if (result && result.description) {
        setDescription(result.description);
      }
    }
  };

  const toggleAnimation = () => {
    if (isPlaying) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);

    if (isPlaying) {
      stopAnimation();
      setTimeout(startAnimation, 50); // Small delay to restart with new speed
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!animationFunc) {
    return null; // Don't render if no animation available
  }

  return (
    <div className="animation-container">
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        style={{ width: '100%', maxWidth: '600px', border: '1px solid #ddd' }}
      />

      <div className="animation-controls">
        <button
          className="btn btn-small"
          onClick={toggleAnimation}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        <button
          className="btn btn-small"
          onClick={resetAnimation}
        >
          🔄
        </button>

        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={handleSpeedChange}
          style={{ flex: 1, margin: '0 10px' }}
        />

        <span>Speed: {speed}x</span>
      </div>

      {description && (
        <div className="animation-description">
          {description}
        </div>
      )}
    </div>
  );
};

export default AnimationContainer;