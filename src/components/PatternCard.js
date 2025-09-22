import React, { useState } from 'react';
import SubPatternSection from './SubPatternSection';
import AnimationContainer from './AnimationContainer';

const PatternCard = ({ pattern, solvedProblems, onProblemToggle, userId }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate pattern progress
  const patternTotalProblems = pattern.subPatterns.reduce(
    (total, subPattern) => total + subPattern.problems.length, 0
  );

  let patternSolvedProblems = 0;
  pattern.subPatterns.forEach(subPattern => {
    subPattern.problems.forEach(problem => {
      if (solvedProblems[problem.id]) {
        patternSolvedProblems++;
      }
    });
  });

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="pattern-card">
      <div className="pattern-header" onClick={toggleExpanded}>
        <h3>{pattern.name}</h3>
        <div className="pattern-progress">
          {patternSolvedProblems}/{patternTotalProblems}
        </div>
      </div>

      <div className={`pattern-content ${isExpanded ? 'expanded' : ''}`}>
        {isExpanded && (
          <>
            <AnimationContainer patternId={pattern.id} />

            {pattern.subPatterns.map(subPattern => (
              <SubPatternSection
                key={subPattern.id}
                subPattern={subPattern}
                solvedProblems={solvedProblems}
                onProblemToggle={onProblemToggle}
                userId={userId}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PatternCard;