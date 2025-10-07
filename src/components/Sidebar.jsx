// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaCog, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'; // Import icons
import { toggleMute } from '../audioManager'; // Import our function
import './Sidebar.css';

// Import icons from the library
import { FaHome, FaPlusSquare, FaBookOpen, FaQuestionCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';

// Hive signup URL
const HIVE_ENROLL_URL = 'https://signup.hive.io/';

function Sidebar({isExpanded, setIsExpanded, user, isAdmin, onLoginKeychain, onLoginHivesigner, onLogout, onGoHome }) {
  
   const [isMuted, setIsMuted] = useState(false); // Add state for mute
  const userAvatarUrl = user ? `https://images.hive.blog/u/${user}/avatar` : '/images/default-avatar.png';


    // On desktop, we want mouse hover behavior.
  // On mobile, we want tap behavior.
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

  const handleMuteToggle = () => {
    const newMutedState = toggleMute();
    setIsMuted(newMutedState);
  };

  
  const handleHivesignerLogin = () => {
    // We'll need to re-create a small hivesigner client here for the redirect
    // Or, even better, we move login logic to App.jsx and pass it down.
    // For now, this is a placeholder. We will fix this.
    alert("Login with Hivesigner clicked. We'll wire this up in App.jsx.");
  };

  return (
    <nav
       className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul className="sidebar-nav">
        {/* Logo/Home Link */}
        <li className="nav-item logo-item">
          <NavLink to="/" className="nav-link" onClick={onGoHome}>
            <img src="/images/neoxian-logo.png" alt="Logo" className="nav-icon logo-icon" />
            <span className="link-text">Neoxian Puzzler</span>
          </NavLink>
        </li>

        {/* Main Navigation */}
        <li className="nav-item">
          <NavLink to="/" className="nav-link" onClick={onGoHome}>
            <FaHome className="nav-icon" />
            <span className="link-text">Home</span>
          </NavLink>
        </li>
        
        {/* If user is an admin, show the Admin Panel link */}
        {isAdmin && (
          <li className="nav-item">
            <NavLink to="/admin" className="nav-link">
              <RiAdminFill className="nav-icon" />
              <span className="link-text">Admin Panel</span>
            </NavLink>
          </li>
        )}
        
        {/* Placeholder for future links */}
        <li className="nav-item"><a href="#" className="nav-link"><FaBookOpen className="nav-icon" /><span className="link-text">Rules</span></a></li>
        <li className="nav-item"><a href="#" className="nav-link"><FaQuestionCircle className="nav-icon" /><span className="link-text">About</span></a></li>
      </ul>

      {/* Bottom section: User Profile or Login/Enroll */}
      <div className="sidebar-footer">

         {/* Add the mute button here */}
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={handleMuteToggle}>
            {isMuted ? <FaVolumeMute className="nav-icon" /> : <FaVolumeUp className="nav-icon" />}
            <span className="link-text">{isMuted ? 'Unmute' : 'Mute'}</span>
          </a>
        </li>
        {user ? (
          // Logged-in view
          <div className="nav-item user-profile">
            <div className="nav-link" onClick={onLogout} title="Logout">
              <img src={userAvatarUrl} alt="User Avatar" className="nav-icon avatar-icon" />
              <span className="link-text">@{user}</span>
              <FaSignOutAlt className="logout-icon" />
            </div>
          </div>
        ) : (
          // Logged-out view
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
      </div>
    </nav>
  );
}

export default Sidebar;