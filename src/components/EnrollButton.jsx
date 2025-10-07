// src/components/EnrollButton.jsx
import React from 'react';
import './EnrollButton.css';

function EnrollButton() {
  const handleEnroll = () => {
    // signup.hive.io is the official portal listing multiple services
    window.open('https://signup.hive.io/', '_blank');
  };

  return (
    <button className="enroll-button" onClick={handleEnroll}>
      <img src="/images/hive-logo.png" alt="Hive Logo" className="enroll-logo" />
      <span>New to Hive? Enroll Now</span>
    </button>
  );
}

export default EnrollButton;