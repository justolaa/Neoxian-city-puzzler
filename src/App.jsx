// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import hivesigner from 'hivesigner';

// Components & Pages
import Sidebar from './components/Sidebar';
import Game from './pages/Game';
import Admin from './pages/Admin';
import EditPuzzle from './pages/EditPuzzle';
import SidebarToggle from './components/SidebarToggle'
import SplashScreen from './components/SplashScreen';

const ADMIN_USERNAMES = (import.meta.env.VITE_ADMIN_USERNAMES || '').split(',');
const hivesignerClient = new hivesigner.Client({
  app: 'neoxian-puzzler',
  callbackURL: window.location.origin,
  scope: ['login'],
});

function App() {
  const [isLoading, setIsLoading] = useState(true); // New state
  const [user, setUser] = useState(null);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Add state back
  // --- Centralized Auth Handlers ---
  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('hive_user', username);
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hive_user');
  };
  const handleKeychainLogin = () => {
    if (!window.hive_keychain) return alert('Hive Keychain not installed!');
    window.hive_keychain.requestSignBuffer(undefined, `Login to Neoxian Puzzler - ${Date.now()}`, 'Posting', (res) => {
      if (res.success) handleLogin(res.data.username);
    });
  };
  const handleHivesignerLogin = () => {
    window.location.href = hivesignerClient.getLoginURL();
  };
  // --- End of Auth Handlers ---

   const handleGoHome = () => {
    setSelectedPuzzleId(null);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('hive_user');
    if (savedUser) { setUser(savedUser); return; }
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const username = params.get('username');
    if (accessToken && username) {
      handleLogin(username);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const isAdmin = useMemo(() => user && ADMIN_USERNAMES.includes(user.toLowerCase()), [user]);

  // We need to slightly update Sidebar's props to pass login handlers.
  // We'll update Sidebar.jsx one last time.

    if (isLoading) {
    return <SplashScreen onAnimationEnd={() => setIsLoading(false)} />;
  }

  return (
    <div className="app-container">
        <div 
      className={`mobile-overlay ${isSidebarExpanded ? 'visible' : ''}`}
      onClick={() => setIsSidebarExpanded(false)} // Click overlay to close menu
    ></div>
      <Sidebar
      isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        user={user}
        isAdmin={isAdmin}
        onLoginKeychain={handleKeychainLogin}
        onLoginHivesigner={handleHivesignerLogin}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
      />

      <SidebarToggle 
        isExpanded={isSidebarExpanded}
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Game user={user} selectedPuzzleId={selectedPuzzleId} setSelectedPuzzleId={setSelectedPuzzleId} />} />
          <Route path="/admin" element={<Admin user={user} />} />
          <Route path="/admin/edit/:puzzleId" element={<EditPuzzle />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;