// src/pages/EditPuzzle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Admin.css'; // Reuse the same styles

function EditPuzzle() {
  const { puzzleId } = useParams(); // Gets the puzzle ID from the URL
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [gridJson, setGridJson] = useState('');
  const [wordsJson, setWordsJson] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the specific puzzle data when the component loads
    const fetchPuzzleData = async () => {
      const { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .eq('id', puzzleId)
        .single();

      if (error) {
        alert('Failed to load puzzle data.');
        console.error(error);
      } else {
        setTitle(data.title);
        // JSON.stringify with pretty-printing (2 spaces) makes it readable in the textarea
        setGridJson(JSON.stringify(data.grid, null, 2)); 
        setWordsJson(JSON.stringify(data.words, null, 2));
      }
      setLoading(false);
    };
    fetchPuzzleData();
  }, [puzzleId]);

  const handleUpdatePuzzle = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const grid = JSON.parse(gridJson);
      const words = JSON.parse(wordsJson);

      const { error } = await supabase
        .from('puzzles')
        .update({ title, grid, words })
        .eq('id', puzzleId); // Make sure to update the correct puzzle

      if (error) throw error;
      alert('Puzzle updated successfully!');
      navigate('/admin'); // Go back to the admin panel
    } catch (error) {
      alert('Error updating puzzle: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="admin-container"><h1>Loading puzzle...</h1></div>;
  }

  return (
    <div className="admin-container">
      <Link to="/admin" style={{ marginBottom: '1rem', display: 'block' }}>&larr; Back to Admin Panel</Link>
      <h1>Edit Puzzle</h1>
      <form onSubmit={handleUpdatePuzzle} className="admin-form">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="admin-input" />
        <textarea value={gridJson} onChange={(e) => setGridJson(e.target.value)} required className="admin-textarea" rows="10" />
        <textarea value={wordsJson} onChange={(e) => setWordsJson(e.target.value)} required className="admin-textarea" rows="5" />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default EditPuzzle;