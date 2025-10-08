// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// 1. CLEANED UP IMPORTS
// We've combined the icon imports and updated the audio manager functions.
import { 
  FaHome, FaBookOpen, FaQuestionCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaVolumeMute, FaVolumeUp 
} from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';
import { toggleMusicMute, getMusicMutedState } from '../audioManager';

const HIVE_ENROLL_URL = 'https://signup.hive.io/';

function Sidebar({ isExpanded, setIsExpanded, user, isAdmin, onLoginKeychain, onLoginHivesigner, onLogout, onGoHome }) {
  
  // 2. UPDATED STATE AND HANDLER
  // The state and handler are now specific to music.
  const [musicMuted, setMusicMuted] = useState(getMusicMutedState());
  const userAvatarUrl = user ? `https://images.hive.blog/u/${user}/avatar` : '/images/default-avatar.png';

  const handleMusicToggle = () => {
    setMusicMuted(toggleMusicMute());
  };
  
  // These hover handlers are correct and remain the same.
  const handleMouseEnter = () => {
    if (window.innerWidth > 768) {
      setIsExpanded(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setIsExpanded(false);
    }
  };

  // The old handleHivesignerLogin function is removed as it's no longer needed.

  return (
    <nav
       className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* This top section is exactly as you wanted it. */}
      <ul className="sidebar-nav">
        <li className="nav-item logo-item">
          <NavLink to="/" className="nav-link" onClick={onGoHome}>
            <img src="/images/neoxian-logo.png" alt="Logo" className="nav-icon logo-icon" />
            <span className="link-text">Neoxian Puzzler</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/" className="nav-link" onClick={onGoHome}>
            <FaHome className="nav-icon" />
            <span className="link-text">Home</span>
          </NavLink>
        </li>
        {isAdmin && (
          <li className="nav-item">
            <NavLink to="/admin" className="nav-link">
              <RiAdminFill className="nav-icon" />
              <span className="link-text">Admin Panel</span>
            </NavLink>
          </li>
        )}
        <li className="nav-item"><a href="#" className="nav-link"><FaBookOpen className="nav-icon" /><span className="link-text">Rules</span></a></li>
        <li className="nav-item"><a href="#" className="nav-link"><FaQuestionCircle className="nav-icon" /><span className="link-text">About</span></a></li>
      </ul>

      {/* 3. UPDATED FOOTER SECTION */}
      {/* We wrap everything in a UL for correct HTML structure. */}
      <ul className="sidebar-footer">
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={handleMusicToggle} title={musicMuted ? "Unmute Music" : "Mute Music"}>
            {musicMuted ? <FaVolumeMute className="nav-icon" /> : <FaVolumeUp className="nav-icon" />}
            <span className="link-text">{musicMuted ? 'Unmute Music' : 'Mute Music'}</span>
          </a>
        </li>
        
        {user ? (
          <li className="nav-item user-profile">
            <div className="nav-link" onClick={onLogout} title="Logout">
              <img src={userAvatarUrl} alt="User Avatar" className="nav-icon avatar-icon" />
              <span className="link-text">@{user}</span>
              <FaSignOutAlt className="logout-icon" />
            </div>
          </li>
        ) : (
          <>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={onLoginKeychain}>
                <FaSignInAlt className="nav-icon" />
                <span className="link-text">Login Keychain</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={onLoginHivesigner}>
                <FaSignInAlt className="nav-icon" />
                <span className="link-text">Login Hivesigner</span>
              </a>
            </li>
            <li className="nav-item">
              <a href={HIVE_ENROLL_URL} target="_blank" rel="noopener noreferrer" className="nav-link">
                <FaUserPlus className="nav-icon" />
                <span className="link-text">Enroll on Hive</span>
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Sidebar;