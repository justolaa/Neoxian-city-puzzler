// src/components/StartScreen.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  puzzleButton: {
    width: '100%',
    maxWidth: '400px',
  }
};

function StartScreen({ onSelectPuzzle }) {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPuzzles() {
      setLoading(true);
      // We only need the id and title for the list
      const { data, error } = await supabase
        .from('puzzles')
        .select('id, title')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching puzzle list:', error);
      } else {
        setPuzzles(data);
      }
      setLoading(false);
    }
    fetchPuzzles();
  }, []);

  if (loading) {
    return <h2>Loading puzzles...</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>Select a Puzzle</h2>
      {puzzles.map((puzzle) => (
        <button
          key={puzzle.id}
          onClick={() => onSelectPuzzle(puzzle.id)}
          style={styles.puzzleButton}
        >
          {puzzle.title}
        </button>
      ))}
    </div>
  );
}

export default StartScreen;