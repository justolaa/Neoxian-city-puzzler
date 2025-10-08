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
    // 1. This is the new outer container. It will have the blue background and padding.
    <div className="puzzle-grid-container">
      <div
        // 2. This is the inner grid. It will no longer have padding or a background.
        className="puzzle-grid"
        onTouchStart={onTouchStartCell}
        onTouchMove={onTouchMoveCell}
        onTouchEnd={onTouchEndCell}
        onMouseUp={onTouchEndCell} 
        onMouseLeave={onTouchEndCell}
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const cellIsSelected = isSelected(rowIndex, colIndex);
            const cellClassName = `grid-cell ${cellIsSelected ? 'selected' : ''}`;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cellClassName}
                onMouseDown={() => onMouseDownCell(rowIndex, colIndex)}
                onMouseEnter={() => onMouseMoveCell(rowIndex, colIndex)}
                data-row={rowIndex}
                data-col={colIndex}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PuzzleGrid;