import React from 'react';

const WeeklyProgressBar = ({ progress = 0 }) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div style={{
      width: '100%',
      height: '10px',
      background: 'rgba(241, 245, 249, 0.5)',
      borderRadius: '100px',
      overflow: 'hidden',
      position: 'relative',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 255, 255, 0.5)'
    }}>
      <div
        style={{
          width: `${clampedProgress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #14b8a6 0%, #6366f1 100%)',
          borderRadius: '100px',
          transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 0 10px rgba(20, 184, 166, 0.3)'
        }}
      />
    </div>
  );
};

export default WeeklyProgressBar;
