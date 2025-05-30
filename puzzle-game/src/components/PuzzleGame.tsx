import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [correctPieces, setCorrectPieces] = useState<Set<number>>(new Set());
  const isMobile = useIsMobile();
  
   // Zvočna animacija
   const playSuccessSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const now = audioCtx.currentTime;
  
      // === White Noise Click ===
      const bufferSize = audioCtx.sampleRate * 0.04; // 40ms
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
  
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3.0); // fast decay
      }
  
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
  
      const snapFilter = audioCtx.createBiquadFilter();
      snapFilter.type = "bandpass";
      snapFilter.frequency.setValueAtTime(800, now);
      snapFilter.Q.setValueAtTime(7, now); // narrow, snappy
  
      const snapGain = audioCtx.createGain();
      snapGain.gain.setValueAtTime(0.8, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  
      noise.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(audioCtx.destination);
  
      // === Low "Thump" Oscillator ===
      const thumpOsc = audioCtx.createOscillator();
      const thumpGain = audioCtx.createGain();
      thumpOsc.type = "sine";
      thumpOsc.frequency.setValueAtTime(120, now); // Low thump
      thumpGain.gain.setValueAtTime(0.5, now);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  
      thumpOsc.connect(thumpGain);
      thumpGain.connect(audioCtx.destination);
  
      // Start both
      noise.start(now);
      thumpOsc.start(now);
      thumpOsc.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio playback failed:", e);
    }
  };

  // Preveri, ali se je spremenilo število pravilno postavljenih kosov
  useEffect(() => {
    const currentlyCorrect = new Set(
      pieces.filter(p => p.isCorrect).map(p => p.id)
    );
    
    // Če je novih pravilnih kosov več kot prej, predvajaj zvok
    if (currentlyCorrect.size > correctPieces.size) {
      playSuccessSound();
    }
    
    setCorrectPieces(currentlyCorrect);
    
    // Preveri, ali je uganka rešena
    if (pieces.length > 0 && pieces.every(piece => piece.isCorrect) && !isComplete) {
      setIsComplete(true);
      onComplete();
    }
  }, [pieces]);

  // velikost puzzla in listenerji
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      initGame(); //ko se nalozi sliko se lahko starta igra
    }  
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
    if (containerSize.width > 0 && imageLoaded) {
      initGame();
    }
  }, [containerSize, imageLoaded, rows, cols]);

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
  e.preventDefault(); // Dodano: preprečimo privzeto vedenje
  if (isRotating) return;

  const piece = pieces.find(p => p.id === id);
  if (!piece) return;

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
  // Premaknemo kos na vrh (konec seznama)
  setPieces(prev => [...prev.filter(p => p.id !== id), piece]);
};

// premik z misko
const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
  if (draggingPiece === null) return; // Preverimo, ali sploh vlečemo kateri koli kos
  
  // Preprečimo privzeto vedenje (npr. izbiro besedila ali premikanje strani)
  e.preventDefault();
  
  const containerRect = containerRef.current!.getBoundingClientRect();
  let clientX: number, clientY: number;

  // upravljanje mouse eventov
  if ('clientX' in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  } 
  // upravljanje touch eventov
  else if ('touches' in e) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    return; // Če ni veljavnih koordinat, ne naredimo nič
  }

  const x = clientX - containerRect.left - dragOffset.x;
  const y = clientY - containerRect.top - dragOffset.y;

  // Posodobimo le tisti kos, ki ga premikamo
  setPieces(prev => prev.map(piece => {
    if (piece.id === draggingPiece) {
      const boundedX = Math.min(Math.max(0, x), containerSize.width - pieceSize.width);
      const boundedY = Math.min(Math.max(0, y), containerSize.height - pieceSize.height);
      return { ...piece, x: boundedX, y: boundedY, isCorrect: false };
    }
    return piece;
  }));
};

// konec premika miske in preverjanje ce je pozicija ok
const handleDragEnd = () => {
  if (draggingPiece !== null) {
    // Preverimo, ali je kos na pravi poziciji
    setPieces(prev => prev.map(piece => {
      if (piece.id === draggingPiece) {
        const isCloseX = Math.abs(piece.x - piece.correctX) < pieceSize.width * 0.15;
        const isCloseY = Math.abs(piece.y - piece.correctY) < pieceSize.height * 0.15;
        const isCorrectRotation = piece.rotation % 360 === 0;
        
        // Če je kos dovolj blizu in pravilno obrnjen, ga poravnamo
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
    <div className="flex justify-center w-full">
      <div 
        ref={containerRef}
        className={cn(
          "relative w-full bg-gray-100 rounded-md shadow-inner overflow-hidden touch-none",
          "h-[70vh] min-h-[400px] max-h-[800px]",
          "w-auto", 
          "mx-auto" 
        )}
        style={{
          aspectRatio: `${cols}/${rows}`, 
          maxWidth: '90vw', 
        }}
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
            onTouchEnd={(e) => isMobile && handleTap(e, piece.id)}
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