// src/components/PuzzleGrid.jsx
import React from 'react';
import './PuzzleGrid.css';

// THE FIX: Component now correctly accepts 'onMouseEnter' as a prop
function PuzzleGrid({ grid, selection, foundWordData, onMouseDownCell, onMouseEnter, onTouchStartCell, onTouchMoveCell, onTouchEndCell }) {
  if (!grid || grid.length === 0) {
    return <div>Loading Grid...</div>;
  }

  const isSelected = (row, col) => {
    return selection.some(cell => cell.row === row && cell.col === col);
  };

  const isFound = (row, col) => {
    return foundWordData.some(wordData => 
      wordData.cells.some(cell => cell.row === row && cell.col === col)
    );
  };

  return (
    <div className="puzzle-grid-container">
      <div
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
            const cellIsFound = isFound(rowIndex, colIndex);
            const cellClassName = `grid-cell ${cellIsSelected ? 'selected' : ''} ${cellIsFound ? 'found' : ''}`;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cellClassName}
                onMouseDown={() => onMouseDownCell(rowIndex, colIndex)}
                onMouseEnter={() => onMouseEnter(rowIndex, colIndex)} // THE FIX: It now correctly calls the onMouseEnter prop
                data-row={rowIndex}
                data-col={colIndex}
              >
                <span className="letter">{letter}</span>
                <span className="strikethrough-line"></span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PuzzleGrid;