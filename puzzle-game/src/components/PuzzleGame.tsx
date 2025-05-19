import React from 'react';

interface PuzzleGameProps {
  coverUrl: string;
  cols: number;
  rows: number;
  onGameComplete: () => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ coverUrl, cols, rows, onGameComplete }) => {
  // Začasno mock implementacija za 2x2
  const pieces = [
    { id: 1, x: 0, y: 0 },
    { id: 2, x: 1, y: 0 },
    { id: 3, x: 0, y: 1 },
    { id: 4, x: 1, y: 1 }
  ];

  return (
    <div className={`grid grid-cols-${cols} gap-1`}>
      {pieces.map(piece => (
        <div 
          key={piece.id}
          className="relative aspect-square"
          style={{
            backgroundImage: `url(${coverUrl})`,
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundPosition: `-${piece.x * 100}% -${piece.y * 100}%`
          }}
        />
      ))}
    </div>
  );
};