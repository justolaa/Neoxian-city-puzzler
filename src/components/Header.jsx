// src/components/Header.jsx
import { toggleMute } from '../audioManager';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ onLogoClick }) {

      const [muted, setMuted] = useState(false);
  
  const handleMuteToggle = () => {
    const newMutedState = toggleMute();
    setMuted(newMutedState);
  };

  return (
    <header className="app-header">
      <Link to="/" onClick={onLogoClick} className="logo-link">
        <img src="/images/neoxian-logo.png" alt="Neoxian City Logo" className="logo-image" />
        <span className="logo-text">Neoxian Puzzler</span>
      </Link>
         <div className="audio-controls">
        <button onClick={handleMuteToggle} title={muted ? "Unmute" : "Mute"}>
          {muted ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  );
}

export default Header;