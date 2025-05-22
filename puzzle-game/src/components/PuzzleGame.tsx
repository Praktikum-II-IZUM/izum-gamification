import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  rotation: number;
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
  const [isRotating, setIsRotating] = useState(false);

  // velikost puzzla in listenerji
  useEffect(() => {
    const img = new Image();
    img.onload = () => initGame();  //ko se nalozi sliko se lahko starta igra
    img.src = imageSrc;
    
    // za responsive posodabljanje velikosti puzzlov ko se resiza okno
    const updateContainerSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };
    
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [imageSrc]);
  
  useEffect(() => {
    if (containerSize.width > 0) initGame();
  }, [containerSize, rows, cols]);

  useEffect(() => {
    if (pieces.length && pieces.every(piece => piece.isCorrect) && !isComplete) {
      setIsComplete(true);
      onComplete();
    }
  }, [pieces, isComplete, onComplete]);

  // inicializacija zacetek igre
  const initGame = () => {
    if (!containerRef.current || containerSize.width === 0) return;
    
    const pieceWidth = containerSize.width / cols;
    const pieceHeight = containerSize.height / rows;
    setPieceSize({ width: pieceWidth, height: pieceHeight });
    
    const newPieces: PuzzlePiece[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = row * cols + col;
        const correctX = col * pieceWidth;
        const correctY = row * pieceHeight;
        
        newPieces.push({
          id,
          x: Math.random() * (containerSize.width - pieceWidth),
          y: Math.random() * (containerSize.height - pieceHeight),
          correctX,
          correctY,
          rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)],
          isCorrect: false
        });
      }
    }
    
    setPieces(newPieces);
    setIsComplete(false);
  };

  // zacetek premik z misko
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, id: number) => {
    if (isRotating) return;

    const piece = pieces.find(p => p.id === id);
    if (piece) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      
      // upravljanje mouse eventov
      if ('clientX' in e) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      // upravljanje touch eventov
      else if ('touches' in e) {
        setDragOffset({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        });
      }

      /*Offset je pomemben zato, ker:
      - Drži relativno pozicijo miške glede na container.
      - Poskrbi, da container ostane pod miško tudi, ko ga premikamo.
      - Poskrbi za gladko premikanje brez skakanja container. */
      
      setDraggingPiece(id);
      setPieces(prev => [...prev.filter(p => p.id !== id), piece]);
    }
  };

  // premik z misko
  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (draggingPiece !== null) {
      const containerRect = containerRef.current!.getBoundingClientRect();

      // upravljanje mouse eventov
      if ('clientX' in e) {
        const x = e.clientX - containerRect.left - dragOffset.x;
        const y = e.clientY - containerRect.top - dragOffset.y;

        setPieces(prev => prev.map(piece => {
          if (piece.id === draggingPiece) {
            const boundedX = Math.min(Math.max(0, x), containerSize.width - pieceSize.width);
            const boundedY = Math.min(Math.max(0, y), containerSize.height - pieceSize.height);
            return { ...piece, x: boundedX, y: boundedY };
          }
          return piece;
        }));
      }
      // upravljanje touch eventov
      else if ('touches' in e) {
        const x = e.touches[0].clientX - containerRect.left - dragOffset.x;
        const y = e.touches[0].clientY - containerRect.top - dragOffset.y;

        setPieces(prev => prev.map(piece => {
          if (piece.id === draggingPiece) {
            const boundedX = Math.min(Math.max(0, x), containerSize.width - pieceSize.width);
            const boundedY = Math.min(Math.max(0, y), containerSize.height - pieceSize.height);
            return { ...piece, x: boundedX, y: boundedY };
          }
          return piece;
        }));
      }
    }
  };

  // konec premika miske in preverjanje ce je pozicija ok
  const handleDragEnd = () => {
    if (draggingPiece !== null) {
      setPieces(prev => prev.map(piece => {
        if (piece.id === draggingPiece) {
          const isCloseX = Math.abs(piece.x - piece.correctX) < pieceSize.width * 0.15;
          const isCloseY = Math.abs(piece.y - piece.correctY) < pieceSize.height * 0.15;
          const isCorrectRotation = piece.rotation % 360 === 0;
          
          if (isCloseX && isCloseY && isCorrectRotation) {
            return {
              ...piece,
              x: piece.correctX,
              y: piece.correctY,
              rotation: 0,
              isCorrect: true
            };
          }
          return { ...piece, isCorrect: false };
        }
        return piece;
      }));
      
      setDraggingPiece(null);
    }
  };

  // rotacija puzzla
  const rotatePiece = (id: number) => {
    setIsRotating(true);
    
    setPieces(prev => prev.map(piece => {
      if (piece.id === id) {
        return { ...piece, rotation: (piece.rotation + 90) % 360, isCorrect: false };
      }
      return piece;
    }));
    
    setTimeout(() => {
      setIsRotating(false);
      
      setPieces(prev => prev.map(piece => {
        if (piece.id === id) {
          const isCloseX = Math.abs(piece.x - piece.correctX) < pieceSize.width * 0.15;
          const isCloseY = Math.abs(piece.y - piece.correctY) < pieceSize.height * 0.15;
          const isCorrectRotation = piece.rotation % 360 === 0;
          
          if (isCloseX && isCloseY && isCorrectRotation) {
            return {
              ...piece,
              x: piece.correctX,
              y: piece.correctY,
              rotation: 0,
              isCorrect: true
            };
          }
        }
        return piece;
      }));
    }, 300);
  };

  // dvojni-tap za rotacijo
  const lastTapRef = useRef<{ id: number; time: number } | null>(null);
  const handleTap = (e: React.TouchEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();
    const now = new Date().getTime();
    
    if (lastTapRef.current && 
        lastTapRef.current.id === id && 
        now - lastTapRef.current.time < 300) {
      rotatePiece(id);
      lastTapRef.current = null;
    } else {
      lastTapRef.current = { id, time: now };
    }
  };

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
              transform: `rotate(${piece.rotation}deg)`,
              touchAction: "none"
            }}
            onMouseDown={(e) => handleDragStart(e, piece.id)}
            onTouchStart={(e) => handleDragStart(e, piece.id)}
            onDoubleClick={() => rotatePiece(piece.id)}
            onTouchEnd={(e) => handleTap(e, piece.id)}
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