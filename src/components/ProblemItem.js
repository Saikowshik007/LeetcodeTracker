import React from 'react';
import { updateProblemStatus } from '../services/dataService';

const ProblemItem = ({ problem, isSolved, onToggle, userId }) => {
  const handleToggle = async (e) => {
    const isChecked = e.target.checked;

    try {
      await updateProblemStatus(userId, problem.id, isChecked);
      onToggle(problem.id, isChecked);
    } catch (error) {
      console.error('Error updating problem status:', error);
      // Reset checkbox if update failed
      e.target.checked = !isChecked;
    }
  };

  return (
    <li className="problem-item">
      <input
        type="checkbox"
        className="solved-checkbox"
        checked={isSolved}
        onChange={handleToggle}
      />
      <div className="problem-info">
        <div className={`problem-title ${isSolved ? 'solved' : ''}`}>
          {problem.id}. {problem.name}
        </div>
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="problem-link"
        >
          View on LeetCode
        </a>
      </div>
    </li>
  );
};

export default ProblemItem;