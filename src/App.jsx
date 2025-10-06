// src/App.jsx

import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import StartScreen from './components/StartScreen';
import GameContainer from './components/GameContainer';

function App() {
  const [user, setUser] = useState(null);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);

  // --- Authentication Logic (Stays the same) ---
  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('hive_user', username);
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hive_user');
  };
  useEffect(() => {
    const savedUser = localStorage.getItem('hive_user');
    if (savedUser) {
      setUser(savedUser);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const username = params.get('username');
    if (accessToken && username) {
      handleLogin(username);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  // --- End of Auth Logic ---

  return (
    <div>
      <Auth user={user} onLogin={handleLogin} onLogout={handleLogout} />
      
      {selectedPuzzleId ? (
        // If a puzzle is selected, show the game
        <GameContainer
          puzzleId={selectedPuzzleId}
          user={user}
          onGameEnd={() => setSelectedPuzzleId(null)} // "Play Again" sets the puzzle ID to null
        />
      ) : (
        // Otherwise, show the start screen
        <StartScreen onSelectPuzzle={(id) => setSelectedPuzzleId(id)} />
      )}
    </div>
  );
}

export default App;