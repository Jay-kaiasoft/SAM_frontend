// ProgressBar.js
import React from 'react';

const ProgressBar = ({ percentage, color }) => {
  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
        }}
      >
      </div>
        <span className="progress-label">{`${percentage}%`}</span>
    </div>
  );
};

export default ProgressBar;
