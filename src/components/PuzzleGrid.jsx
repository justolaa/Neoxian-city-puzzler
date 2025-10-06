// src/components/PuzzleGrid.jsx
import React from 'react';
import './PuzzleGrid.css'; // Import the new CSS file

function PuzzleGrid({ grid, selection, onMouseDownCell, onMouseMoveCell }) {
  if (!grid) {
    return <div>Loading Grid...</div>;
  }

  const isSelected = (row, col) => {
    return selection.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div className="puzzle-grid">
      {grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const cellIsSelected = isSelected(rowIndex, colIndex);
          // Conditionally apply the 'selected' class
          const cellClassName = `grid-cell ${cellIsSelected ? 'selected' : ''}`;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cellClassName} // Use className
              onMouseDown={() => onMouseDownCell(rowIndex, colIndex)}
              onMouseMove={() => onMouseMoveCell(rowIndex, colIndex)}
            >
              {letter}
            </div>
          );
        })
      )}
    </div>
  );
}

export default PuzzleGrid;