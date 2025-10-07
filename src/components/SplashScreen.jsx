// src/components/SplashScreen.jsx
import React, { useState, useEffect } from 'react'; // 1. Import useState
import './SplashScreen.css';

function SplashScreen({ onAnimationEnd }) {
  const [isReady, setIsReady] = useState(false); // 2. Add 'isReady' state

  const handleStart = () => {
    // This function will be called when the user clicks our "Enter" button
    setIsReady(true); // Set the state to ready

    // Now that we have user interaction, we can safely play the sound
    const sound = new Audio('/audio/door-slide.mp3');
    sound.volume = 0.5;
    sound.play();
  };

  // We remove the old useEffect for sound, as it's now handled by the click

  return (
    <div className="splash-screen">
      {/* 
        The 'data-ready' attribute will be used by our CSS
        to control the animation start.
      */}
      <div className={`door left ${isReady ? 'animate' : ''}`} onAnimationEnd={onAnimationEnd}>
        <div className="logo-half"></div>
      </div>
      <div className={`door right ${isReady ? 'animate' : ''}`}>
        <div className="logo-half"></div>
      </div>
      
      <div className="splash-credits-container">
        <p className="splash-credits">created by @justola1 on Hive</p>
      </div>

      {/* 
        This is the "Click to Enter" button. 
        It will only be visible if the animation is not ready to start.
      */}
      {!isReady && (
        <div className="enter-container">
          <button className="enter-button" onClick={handleStart}>
            Enter
          </button>
        </div>
      )}
    </div>
  );
}

export default SplashScreen;