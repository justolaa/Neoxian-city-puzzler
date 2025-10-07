// src/components/GameSummary.jsx

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './GameSummary.css';

// Accept the new onRestart prop
function GameSummary({ time, puzzleId, user, onRestart, puzzleTitle  }) { 
  const [guestUsername, setGuestUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedUsername, setSubmittedUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameToSubmit = user || guestUsername.trim();
    if (!usernameToSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setSubmittedUsername(usernameToSubmit);

    // This is the only part that changes.
    // We are now calling the 'submit_score' function on the backend.
    const { error } = await supabase
      .rpc('submit_score', {
        p_puzzle_id: puzzleId,
        p_username: usernameToSubmit,
        p_time_taken_ms: time * 1000
      });
    // The parameter names must match what we defined in the SQL function.

    if (error) {
      alert('Error submitting score: ' + error.message);
      console.error('RPC Error:', error);
    } else {
      setIsSubmitted(true);
    }
    setIsSubmitting(false);
  };

  // 2. Add the Share handler function
  const handleShareToX = () => {
    const gameUrl = window.location.origin;
    const text = `I just solved the "${puzzleTitle}" puzzle in ${time} seconds on the Neoxian City Puzzler! 🚀\n\nCome play and test your skills!\n\n#NeoxianCity #Hive #WordPuzzle #Gaming`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(gameUrl)}`;
    window.open(shareUrl, '_blank');
  };

  if (isSubmitted) {
    return (
      <div className="game-summary">
        <h2>Score Submitted!</h2>
        <p>Thanks for playing, {submittedUsername}!</p>
        <div className="summary-actions">
          {/* 3. Add the Share button */}
          <button onClick={handleShareToX} className="share-button">Share on X</button>
          <button onClick={onRestart}>Play Again</button>
        </div>
      </div>
    );
  }

  // The rest of the component remains the same
  return (
    <div className="game-summary">
      <h2>Congratulations!</h2>
      <p>Your time: {time} seconds</p>
      
      {user ? (
        <div>
          <p>Submitting score as: <strong>@{user}</strong></p>
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Confirm & Submit Score'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p>Continue as a guest:</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={guestUsername}
            onChange={(e) => setGuestUsername(e.target.value)}
            className="summary-input"
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Score'}
          </button>
        </form>
      )}
    </div>
  );
}

export default GameSummary;