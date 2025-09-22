import React from 'react';
import ProblemItem from './ProblemItem';

const SubPatternSection = ({ subPattern, solvedProblems, onProblemToggle, userId }) => {
  return (
    <div className="subpattern-section">
      <h4>{subPattern.name}</h4>
      <ul className="problem-list">
        {subPattern.problems.map(problem => (
          <ProblemItem
            key={problem.id}
            problem={problem}
            isSolved={solvedProblems[problem.id] || false}
            onToggle={onProblemToggle}
            userId={userId}
          />
        ))}
      </ul>
    </div>
  );
};

export default SubPatternSection;