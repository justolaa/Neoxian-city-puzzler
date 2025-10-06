// src/components/WordList.jsx

import React from 'react';
import './WordList.css'; // 1. Import the CSS

function WordList({ words, foundWords }) {
  if (!words) {
    return <div>Loading Hints...</div>;
  }

  return (
    // 2. Use the 'word-list' className
    <div className="word-list">
      <h2 style={{ marginTop: 0 }}>Hints</h2> {/* h2 is already styled globally */}
      <ul>
        {words.map((wordObj) => {
          const isFound = foundWords.includes(wordObj.word);
          // 3. Conditionally apply the 'found' class
          const itemClassName = `word-list-item ${isFound ? 'found' : ''}`;

          return (
            <li key={wordObj.word} className={itemClassName}>
              {wordObj.hint}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default WordList;