import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  isCorrect: boolean;
}

interface PuzzleGameProps {
  imageSrc: string;
  rows: number;
  cols: number;
  onComplete: () => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ 
  imageSrc, 
  rows, 
  cols, 
  onComplete 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [pieceSize, setPieceSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isComplete, setIsComplete] = useState(false);


  return (
    <div className="flex justify-center">
      <div 
        ref={containerRef}
        className="relative w-full aspect-[3/4] max-w-lg bg-gray-100 rounded-md shadow-inner overflow-hidden touch-none"
        onMouseMove={(e) => handleDragMove(e)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={(e) => handleDragMove(e)}
        onTouchEnd={handleDragEnd}
      >
        <div 
          className="absolute inset-0 grid" 
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`
          }}
        >
          {Array.from({ length: rows * cols }).map((_, i) => (
            <div key={`grid-${i}`} className="border border-dashed border-gray-300" />
          ))}
        </div>
        
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className={cn(
              "absolute cursor-grab active:cursor-grabbing",
              "transition-transform duration-300"
            )}
            style={{
              width: `${pieceSize.width}px`,
              height: `${pieceSize.height}px`,
              left: `${piece.x}px`,
              top: `${piece.y}px`,
              zIndex: draggingPiece === piece.id ? 10 : 1,
              touchAction: "none"
            }}
            onMouseDown={(e) => handleDragStart(e, piece.id)}
            onTouchStart={(e) => handleDragStart(e, piece.id)}
          >
            {/* ce uspesno puzzle na pravi lokaciji zelen rob */}
            <div 
              className={cn(
                "w-full h-full bg-white border-2 overflow-hidden",
                piece.isCorrect ? "border-green-500" : "border-gray-400",
                "transition-all duration-200"
              )}
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${-piece.correctX / pieceSize.width * 100}% ${-piece.correctY / pieceSize.height * 100}%`,
                boxShadow: piece.isCorrect ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};