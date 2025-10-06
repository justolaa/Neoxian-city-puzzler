// src/components/Timer.jsx

import React from 'react';
import './Timer.css'


function Timer({ time }) {
  // Format seconds into MM:SS format
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="timer-display">
      {formatTime(time)}
    </div>
  );
}

export default Timer;