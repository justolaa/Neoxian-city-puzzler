// src/components/GameContainer.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PuzzleGrid from './PuzzleGrid';
import WordList from './WordList';
import Timer from './Timer';
import GameSummary from './GameSummary';
import Leaderboard from './Leaderboard';
import Modal from './Modal';
import { playHighlightSound, playCorrectSound, playErrorSound, playMusic, stopMusic } from '../audioManager';
import './GameContainer.css';

function GameContainer({ puzzleId, onGameEnd, user }) {
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState([]);
  const [foundWordData, setFoundWordData] = useState([]); // Correct state variable
  const [time, setTime] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  // --- Data Fetching and Timers (No changes here) ---
  useEffect(() => {
    async function getPuzzle() { if (!puzzleId) return; try { setLoading(true); const { data, error } = await supabase.from('puzzles').select('*').eq('id', puzzleId).single(); if (error) throw error; if (data) setPuzzle(data); } catch (error) { setError(error.message); } finally { setLoading(false); } }
    getPuzzle();
  }, [puzzleId]);
  useEffect(() => { playMusic(); return () => stopMusic(); }, []);
  useEffect(() => { let timerInterval = null; if (puzzle && !isGameComplete) { timerInterval = setInterval(() => setTime(prev => prev + 1), 1000); } return () => clearInterval(timerInterval); }, [puzzle, isGameComplete]);

  // --- WIN CONDITION (Fixed: uses foundWordData) ---
  useEffect(() => {
    if (puzzle && foundWordData.length > 0 && foundWordData.length === puzzle.words.length) {
      setIsGameComplete(true);
    }
  }, [foundWordData, puzzle]);

  // --- Event Handlers (Fixed: handleMouseUp uses correct variables) ---
  const getCellFromTouch = (touchEvent) => { const touch = touchEvent.touches[0]; const element = document.elementFromPoint(touch.clientX, touch.clientY); if (element && element.dataset.row && element.dataset.col) { const row = parseInt(element.dataset.row, 10); const col = parseInt(element.dataset.col, 10); return { row, col }; } return null; };
  const handleMouseDown = (row, col) => { setIsSelecting(true); setSelection([{ row, col }]); };
  const handleMouseMove = (row, col) => { if (!isSelecting) return; const start = selection[0]; if (selection.length > 0 && selection[selection.length - 1].row === row && selection[selection.length - 1].col === col) return; const newSelection = []; const dRow = Math.sign(row - start.row); const dCol = Math.sign(col - start.col); if (dRow !== 0 && dCol !== 0 && Math.abs(row - start.row) !== Math.abs(col - start.col)) return; let r = start.row; let c = start.col; while (true) { newSelection.push({ row: r, col: c }); if (r === row && c === col) break; r += dRow; c += dCol; } if (newSelection.length > selection.length) { playHighlightSound(); } setSelection(newSelection); };
  
  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    let selectedWord = '';
    selection.forEach(({ row, col }) => { selectedWord += puzzle.grid[row][col]; });
    const reversedSelectedWord = selectedWord.split('').reverse().join('');
    const foundWordsList = foundWordData.map(data => data.word);
    const matchedWord = puzzle.words.find(wordObj => (wordObj.word === selectedWord || wordObj.word === reversedSelectedWord));
    if (matchedWord && !foundWordsList.includes(matchedWord.word)) {
      setFoundWordData([...foundWordData, { word: matchedWord.word, cells: selection }]);
      playCorrectSound();
    } else if (selection.length > 1) {
      playErrorSound();
    }
    setSelection([]);
  };

  const handleTouchStart = (touchEvent) => { const cell = getCellFromTouch(touchEvent); if (cell) handleMouseDown(cell.row, cell.col); };
  const handleTouchMove = (touchEvent) => { const cell = getCellFromTouch(touchEvent); if (cell) handleMouseMove(cell.row, cell.col); };
  const handleTouchEnd = () => handleMouseUp();

  if (loading) return <h1>Loading Puzzle...</h1>;
  if (error) return <h1>Error: {error}</h1>;
  if (!puzzle) return <h1>No puzzle found.</h1>;

  return (
    <div className="game-container">
      <h1>{puzzle.title}</h1>
      <Timer time={time} />
      {isGameComplete ? (
        <GameSummary time={time} puzzleId={puzzle.id} user={user} onRestart={onGameEnd} puzzleTitle={puzzle.title} />
      ) : (
        <div onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <PuzzleGrid
            grid={puzzle.grid}
            selection={selection}
            foundWordData={foundWordData}
            onMouseDownCell={handleMouseDown}
            onMouseEnter={handleMouseMove} // <-- THE FIX: Changed prop name to onMouseEnter
            onTouchStartCell={handleTouchStart}
            onTouchMoveCell={handleTouchMove}
            onTouchEndCell={handleTouchEnd}
          />
        </div>
      )}
      <div className="game-actions">
        <button onClick={() => setIsHintsOpen(true)}>Show Hints</button>
        <button onClick={() => setIsLeaderboardOpen(true)}>View Leaderboard</button>
      </div>
      <Modal isOpen={isHintsOpen} onClose={() => setIsHintsOpen(false)}>
        <WordList words={puzzle.words} foundWords={foundWordData.map(data => data.word)} />
      </Modal>
      <Modal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)}>
        <Leaderboard puzzleId={puzzle.id} />
      </Modal>
    </div>
  );
}

export default GameContainer;