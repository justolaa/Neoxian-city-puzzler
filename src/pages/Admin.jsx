// src/pages/Admin.jsx (Hive Auth Version)

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';
import { useNavigate, Link } from 'react-router-dom';

// We get the admin list from our secure environment variables
const ADMIN_USERNAMES = (import.meta.env.VITE_ADMIN_USERNAMES || '').split(',');

function Admin({ user }) { // Accept the logged-in user as a prop
     const navigate = useNavigate(); // Get the navigate function
  const [isAdmin, setIsAdmin] = useState(false);

  // State for the new puzzle form
  const [title, setTitle] = useState('');
  const [gridJson, setGridJson] = useState('');
  const [wordsJson, setWordsJson] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

 const [puzzles, setPuzzles] = useState([]); // State for the puzzle list

useEffect(() => {
  if (user && ADMIN_USERNAMES.includes(user.toLowerCase())) {
    setIsAdmin(true);
    // Fetch the list of puzzles when the user is confirmed as admin
    const fetchPuzzles = async () => {
      const { data, error } = await supabase
        .from('puzzles')
        .select('id, title')
        .order('created_at', { descending: true });
      if (!error) setPuzzles(data);
    };
    fetchPuzzles();
  } else {
    setIsAdmin(false);
  }
}, [user]);

  const handleSubmitPuzzle = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const grid = JSON.parse(gridJson);
      const words = JSON.parse(wordsJson);
      const { error } = await supabase
        .from('puzzles')
        .insert([{ title, grid, words }]);
      if (error) throw error;
      alert('Puzzle added successfully!');
       navigate('/'); // <-- THE NEW LINE TO REDIRECT
      setTitle('');
      setGridJson('');
      setWordsJson('');
    } catch (error) {
      alert('Error submitting puzzle: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the user is a verified admin, show the form.
  if (isAdmin) {
    return (
      <div className="admin-container">
        <h1>Add New Puzzle</h1>
        <p>Welcome, admin @{user}!</p>
        <form onSubmit={handleSubmitPuzzle} className="admin-form">
          <input
            type="text"
            placeholder="Puzzle Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="admin-input"
          />
          <textarea
            placeholder='Grid Data (Paste valid JSON array of arrays here)'
            value={gridJson}
            onChange={(e) => setGridJson(e.target.value)}
            required
            className="admin-textarea"
            rows="10"
          />
          <textarea
            placeholder='Words Data (Paste valid JSON array of objects here)'
            value={wordsJson}
            onChange={(e) => setWordsJson(e.target.value)}
            required
            className="admin-textarea"
            rows="5"
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Add Puzzle'}
          </button>
        </form>
        <div className="puzzle-list-container">
        <h2>Edit Existing Puzzles</h2>
        {puzzles.length > 0 ? (
          <ul>
            {puzzles.map(puzzle => (
              <li key={puzzle.id} className="puzzle-list-item">
                <span>{puzzle.title}</span>
                {/* Link to the new edit page */}
                <Link to={`/admin/edit/${puzzle.id}`} className="edit-button">Edit</Link>
              </li>
            ))}
          </ul>
        ) : <p>No puzzles found.</p>}
      </div>
      </div>
    );
  }

  // Otherwise, show an "Access Denied" message.
  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      <h2>Access Denied</h2>
      <p>You must be logged in with an authorized Hive account to access this page.</p>
      <p>Please log in using the buttons in the top right corner.</p>
    </div>
  );
}

export default Admin;