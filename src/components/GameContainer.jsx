// src/components/GameContainer.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PuzzleGrid from './PuzzleGrid';
import WordList from './WordList';
import Timer from './Timer';
import GameSummary from './GameSummary';
import Leaderboard from './Leaderboard';
import Modal from './Modal';
import'./GameContainer.css'
import { 
  playHighlightSound, 
  playCorrectSound, 
  playErrorSound,
  playMusic,
  stopMusic
} from '../audioManager';

function GameContainer({ puzzleId, onGameEnd, user }) {
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [time, setTime] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isHintsOpen, setIsHintsOpen] = useState(false); // <-- Add this

  // Fetch puzzle data
  useEffect(() => {
    async function getPuzzle() {
      if (!puzzleId) return;
      try {
        setLoading(true);
        const { data, error } = await supabase.from('puzzles').select('*').eq('id', puzzleId).single();
        if (error) throw error;
        if (data) setPuzzle(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    getPuzzle();
  }, [puzzleId]);

  // Timer effect
  useEffect(() => {
    let timerInterval = null;
    if (puzzle && !isGameComplete) {
      timerInterval = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timerInterval);
  }, [puzzle, isGameComplete]);

  // Win condition effect
  useEffect(() => {
    if (puzzle && foundWords.length > 0 && foundWords.length === puzzle.words.length) {
      setIsGameComplete(true);
    }
  }, [foundWords, puzzle]);

  // src/components/GameContainer.jsx -> add this with your other useEffects

// Effect for background music
useEffect(() => {
  playMusic();

  // This is a cleanup function. It runs when the component is unmounted.
  return () => {
    stopMusic();
  };
}, []); // Empty array ensures this runs only once when the game starts

  // Event handlers
  const handleMouseDown = (row, col) => { setIsSelecting(true); setSelection([{ row, col }]); };
  const handleMouseMove = (row, col) => { if (!isSelecting) return; const start = selection[0]; 
    const newSelection = []; const dRow = Math.sign(row - start.row); const dCol = Math.sign(col - start.col); if (dRow !== 0 && dCol !== 0 && Math.abs(row - start.row) !== Math.abs(col - start.col)) return; let r = start.row; let c = start.col; while (true) { newSelection.push({ row: r, col: c }); if (r === row && c === col) break; r += dRow; c += dCol; } 
  
   if (newSelection.length > selection.length) { // Only play if a new letter was added
    playHighlightSound();
  }
    setSelection(newSelection);

};
  const handleMouseUp = () => {
  if (!isSelecting) return;
  setIsSelecting(false);
  let word = '';
  selection.forEach(({ row, col }) => {
    word += puzzle.grid[row][col];
  });
  const revWord = word.split('').reverse().join('');
  const match = puzzle.words.find(w => w.word === word || w.word === revWord);
  
  if (match && !foundWords.includes(match.word)) {
    setFoundWords([...foundWords, match.word]);
    playCorrectSound(); // <-- Play CORRECT sound
  } else if (selection.length > 1) { // Only play error sound for actual attempts
    playErrorSound(); // <-- Play ERROR sound
  }

  setSelection([]);
};
  // src/components/GameContainer.jsx -> add these functions

// Helper function to get the row and col from a touch event
const getCellFromTouch = (touchEvent) => {
  // We only care about the first finger touch
  const touch = touchEvent.touches[0];
  // Find the element directly under the finger
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  
  if (element && element.dataset.row && element.dataset.col) {
    const row = parseInt(element.dataset.row, 10);
    const col = parseInt(element.dataset.col, 10);
    return { row, col };
  }
  return null;
};

const handleTouchStart = (touchEvent) => {
  const cell = getCellFromTouch(touchEvent);
  if (cell) {
    handleMouseDown(cell.row, cell.col); // We can reuse the mouse down logic
  }
};

const handleTouchMove = (touchEvent) => {
  const cell = getCellFromTouch(touchEvent);
  if (cell) {
    handleMouseMove(cell.row, cell.col); // We can reuse the mouse move logic
  }
};

// The touch end event doesn't have coordinates, so we just call handleMouseUp
const handleTouchEnd = () => {
  handleMouseUp();
};

  if (loading) return <h1>Loading Puzzle...</h1>;
  if (error) return <h1>Error: {error}</h1>;
  if (!puzzle) return <h1>No puzzle found.</h1>;

  return (
    <div className="game-container">
      <h1>{puzzle.title}</h1>
      <Timer time={time} />
      
      {isGameComplete ? (
        <GameSummary time={time} puzzleId={puzzle.id} user={user} onRestart={onGameEnd}  puzzleTitle={puzzle.title} />
      ) : (
        <div onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <PuzzleGrid grid={puzzle.grid} selection={selection} onMouseDownCell={handleMouseDown} onMouseMoveCell={handleMouseMove}
           onTouchStartCell={handleTouchStart}
  onTouchMoveCell={handleTouchMove}
  onTouchEndCell={handleTouchEnd} />
        </div>
      )}
      

 {/* New Actions Bar for Hints & Leaderboard Buttons */}
      <div className="game-actions">
        <button onClick={() => setIsHintsOpen(true)}>Show Hints</button>
        <button onClick={() => setIsLeaderboardOpen(true)}>View Leaderboard</button>
      </div>
      
      {/* Hints are now inside a Modal */}
      <Modal isOpen={isHintsOpen} onClose={() => setIsHintsOpen(false)}>
        <WordList words={puzzle.words} foundWords={foundWords} />
      </Modal>

      {/* Leaderboard is now inside the Modal */}
      <Modal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)}>
        <Leaderboard puzzleId={puzzle.id} />
      </Modal>
    </div>
  );
}

export default GameContainer;