// src/components/GameContainer.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PuzzleGrid from './PuzzleGrid';
import WordList from './WordList';
import Timer from './Timer';
import GameSummary from './GameSummary';
import Leaderboard from './Leaderboard';
import Modal from './Modal';

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

  // Event handlers
  const handleMouseDown = (row, col) => { setIsSelecting(true); setSelection([{ row, col }]); };
  const handleMouseMove = (row, col) => { if (!isSelecting) return; const start = selection[0]; const newSelection = []; const dRow = Math.sign(row - start.row); const dCol = Math.sign(col - start.col); if (dRow !== 0 && dCol !== 0 && Math.abs(row - start.row) !== Math.abs(col - start.col)) return; let r = start.row; let c = start.col; while (true) { newSelection.push({ row: r, col: c }); if (r === row && c === col) break; r += dRow; c += dCol; } setSelection(newSelection); };
  const handleMouseUp = () => { if (!isSelecting) return; setIsSelecting(false); let word = ''; selection.forEach(({ row, col }) => { word += puzzle.grid[row][col]; }); const revWord = word.split('').reverse().join(''); const match = puzzle.words.find(w => w.word === word || w.word === revWord); if (match && !foundWords.includes(match.word)) { setFoundWords([...foundWords, match.word]); } setSelection([]); };
  
  if (loading) return <h1>Loading Puzzle...</h1>;
  if (error) return <h1>Error: {error}</h1>;
  if (!puzzle) return <h1>No puzzle found.</h1>;

  return (
    <div>
      <h1>{puzzle.title}</h1>
      <Timer time={time} />
      
      {isGameComplete ? (
        <GameSummary time={time} puzzleId={puzzle.id} user={user} onRestart={onGameEnd} />
      ) : (
        <div onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <PuzzleGrid grid={puzzle.grid} selection={selection} onMouseDownCell={handleMouseDown} onMouseMoveCell={handleMouseMove} />
        </div>
      )}
      
      <WordList words={puzzle.words} foundWords={foundWords} />

      {/* New "Show Leaderboard" Button */}
      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => setIsLeaderboardOpen(true)}>
          View Leaderboard
        </button>
      </div>

      {/* Leaderboard is now inside the Modal */}
      <Modal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)}>
        <Leaderboard puzzleId={puzzle.id} />
      </Modal>
    </div>
  );
}

export default GameContainer;