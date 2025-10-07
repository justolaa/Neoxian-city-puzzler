// src/pages/Game.jsx
import { useState } from 'react';
import StartScreen from '../components/StartScreen';
import GameContainer from '../components/GameContainer';

function Game({ user }) { // Accept user as a prop
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);

  return (
    <>
      {selectedPuzzleId ? (
        <GameContainer
          puzzleId={selectedPuzzleId}
          user={user}
          onGameEnd={() => setSelectedPuzzleId(null)}
        />
      ) : (
        <StartScreen onSelectPuzzle={(id) => setSelectedPuzzleId(id)} />
      )}
    </>
  );
}

export default Game;