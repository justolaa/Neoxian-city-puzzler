// src/components/StartScreen.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const styles = {
  buttonContainer: {
    display: 'flex',
    flexWrap: 'wrap', // Allows buttons to wrap to the next line
    justifyContent: 'center', // Center the buttons
    gap: '1rem', // Space between buttons
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
    <div>
      <h2>Select a Puzzle</h2>
      {/* Use the new styled container */}
      <div style={styles.buttonContainer}>
        {puzzles.map((puzzle) => (
          <button
            key={puzzle.id}
            onClick={() => onSelectPuzzle(puzzle.id)}
            className="button-list-item"
          >
            {puzzle.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StartScreen;