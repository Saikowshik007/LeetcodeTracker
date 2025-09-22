import React from 'react';
import PatternCard from './PatternCard';

const PatternsContainer = ({ patterns, solvedProblems, onProblemToggle, userId }) => {
  return (
    <div className="patterns-container">
      {patterns.map(pattern => (
        <PatternCard
          key={pattern.id}
          pattern={pattern}
          solvedProblems={solvedProblems}
          onProblemToggle={onProblemToggle}
          userId={userId}
        />
      ))}
    </div>
  );
};

export default PatternsContainer;