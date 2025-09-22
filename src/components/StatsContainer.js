import React from 'react';

const StatsContainer = ({ totalProblems, solvedProblems }) => {
  const progressPercentage = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stat-box">
        <h3>Total Problems</h3>
        <p>{totalProblems}</p>
      </div>

      <div className="stat-box">
        <h3>Solved</h3>
        <p>{solvedProblems}</p>
      </div>

      <div className="stat-box">
        <h3>Progress</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p>{progressPercentage}%</p>
      </div>
    </div>
  );
};

export default StatsContainer;