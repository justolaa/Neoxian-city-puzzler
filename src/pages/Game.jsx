// src/pages/Game.jsx (New version)
import StartScreen from '../components/StartScreen';
import GameContainer from '../components/GameContainer';

function Game({ user, selectedPuzzleId, setSelectedPuzzleId }) { // Receive state as props
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