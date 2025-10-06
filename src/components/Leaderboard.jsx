// src/components/Leaderboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import './Leaderboard.css';

const PAGE_SIZE = 10; // Show 10 scores per page

function Leaderboard({ puzzleId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
const [currentPage, setCurrentPage] = useState(0); // Page numbers are 0-indexed
  const [totalScores, setTotalScores] = useState(0); // To know when to disable the 'Next' button
  // We are moving the fetch logic into a useCallback hook so we can reuse it
  // without causing re-renders. This is a good practice.
  const fetchScores = useCallback(async (page = 0) => {
    if (!puzzleId) return;

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    setLoading(true);
    const { data, error, count } = await supabase
      .from('scores')
      .select('username, time_taken_ms', { count: 'exact' }) // Ask for the total count
      .eq('puzzle_id', puzzleId)
      .order('time_taken_ms', { ascending: true })
      .range(from, to); // Fetch only the scores for the current page

    if (error) {
      console.error('Error fetching scores:', error);
    } else {
      setScores(data);
      setTotalScores(count); // Store the total number of scores
    }
    setLoading(false);
  }, [puzzleId]);


  // Effect for fetching data when the page changes
  useEffect(() => {
    fetchScores(currentPage);
  }, [fetchScores, currentPage]);

  // Effect for the REAL-TIME subscription
  useEffect(() => {
    if (!puzzleId) return;

    const channel = supabase
      .channel(`scores-for-puzzle-${puzzleId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scores', filter: `puzzle_id=eq.${puzzleId}` },
        (payload) => {
          console.log('New score received!', payload);
          // When a new score comes in, go back to the first page to see the new ranking
          if (currentPage === 0) {
            fetchScores(0);
          } else {
            setCurrentPage(0);
          }
        }
      )
      .subscribe();

    // This is a cleanup function that runs when the component unmounts.
    // It's very important to remove the subscription to prevent memory leaks.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [puzzleId, fetchScores, currentPage]);

const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => prev - 1);
  };

  const maxPage = Math.ceil(totalScores / PAGE_SIZE) - 1;


  if (loading) {
    return <div className="leaderboard"><h2>Loading Leaderboard...</h2></div>;
  }

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      {scores.length === 0 ? (
        <p>No scores yet. Be the first!</p>
      ) : (
        <>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  {/* Calculate the true rank based on the page */}
                  <td>#{currentPage * PAGE_SIZE + index + 1}</td>
                  <td>{score.username}</td>
                  <td>{(score.time_taken_ms / 1000).toFixed(2)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* --- PAGINATION CONTROLS --- */}
          <div className="pagination-controls" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={handlePrevPage} disabled={currentPage === 0}>
              Previous
            </button>
            <span>
              Page {currentPage + 1} of {maxPage + 1}
            </span>
            <button onClick={handleNextPage} disabled={currentPage >= maxPage}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Leaderboard;