// src/components/PuzzleGrid.jsx
import React from 'react';
import './PuzzleGrid.css';

function PuzzleGrid({ grid, selection, onMouseDownCell, onMouseMoveCell, onTouchStartCell, onTouchMoveCell, onTouchEndCell }) {
  if (!grid) {
    return <div>Loading Grid...</div>;
  }

  const isSelected = (row, col) => {
    return selection.some(cell => cell.row === row && cell.col === col);
  };

  // We attach the main touch handlers to the container
  return (
    <div
      className="puzzle-grid"
      onTouchStart={onTouchStartCell}
      onTouchMove={onTouchMoveCell}
      onTouchEnd={onTouchEndCell}
    >
      {grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const cellIsSelected = isSelected(rowIndex, colIndex);
          const cellClassName = `grid-cell ${cellIsSelected ? 'selected' : ''}`;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cellClassName}
              // We still need mouse events for desktop
              onMouseDown={() => onMouseDownCell(rowIndex, colIndex)}
              onMouseEnter={() => onMouseMoveCell(rowIndex, colIndex)} // onMouseEnter works better with mouse than onMouseMove
              // Add data attributes for our touch helper function
              data-row={rowIndex}
              data-col={colIndex}
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