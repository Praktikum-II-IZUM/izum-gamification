import React, { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/Timer';
import { getScoringConfig, calculateScore, ScoreResult } from '@/utils/scoringSystem';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
import { GameStorage } from '@/utils/gameStorage';

interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  rotation: number;
  isCorrect: boolean;
  xA: number;
  yA: number;
  xB: number;
  yB: number;
  xC: number;
  yC: number;
  xD: number;
  yD: number;
}

interface Axis {
  id: number;
  angle: number;
  offSet: number;
}


interface PuzzleGameProps {
  imageSrc: string;
  rows: number;
  cols: number;
  onComplete: (scoreResult: ScoreResult, completionTime: number) => void;
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
  const [showSolution, setShowSolution] = useState(false);
  const [hasShownSolution, setHasShownSolution] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [gameTimer, setGameTimer] = useState(false);
  const [reducedMaxPoints, setReducedMaxPoints] = useState<number | null>(null);
  const scoringConfig = getScoringConfig(rows, cols);
  const effectiveMaxPoints = reducedMaxPoints || scoringConfig.maxPoints;

  // uporaba useCallback za preprecevanje nepotrebnih ponovnih upodobitev
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);
  
  const [axes] = useState(() => {
    let xaxes: Axis[] = [];
    let yaxes: Axis[] = [];
    xaxes.push({
      id: 0,
      angle: 0,
      offSet: 0
    });
    for (let i = 1; i < rows; i++) {
      xaxes.push({
        id: i,
        angle: (Math.PI/6), //Math.asin(1 / (0.8 * 2 * rows)),
        offSet: 0
      });
    }
    xaxes.push({
      id: rows,
      angle: 0,
      offSet: 0
    });

    return {
      x: xaxes,
      y: yaxes
    }
  });

  // zvocna animacija
  const playSuccessSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const now = audioCtx.currentTime;
  
      const bufferSize = audioCtx.sampleRate * 0.04;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
  
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3.0);
      }
  
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
  
      const snapFilter = audioCtx.createBiquadFilter();
      snapFilter.type = "bandpass";
      snapFilter.frequency.setValueAtTime(800, now);
      snapFilter.Q.setValueAtTime(7, now);
  
      const snapGain = audioCtx.createGain();
      snapGain.gain.setValueAtTime(0.8, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  
      noise.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(audioCtx.destination);
  
      const thumpOsc = audioCtx.createOscillator();
      const thumpGain = audioCtx.createGain();
      thumpOsc.type = "sine";
      thumpOsc.frequency.setValueAtTime(120, now);
      thumpGain.gain.setValueAtTime(0.5, now);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  
      thumpOsc.connect(thumpGain);
      thumpGain.connect(audioCtx.destination);
  
      noise.start(now);
      thumpOsc.start(now);
      thumpOsc.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio playback failed:", e);
    }
  };

  // zazeni timer ob inicializaciji igre
  useEffect(() => {
    if (pieces.length > 0 && !gameStartTime) {
      setGameStartTime(Date.now());
      setGameTimer(true);
    }
  }, [pieces, gameStartTime]);

  // ali se je spremenilo stevilo pravilno postavljenih kosov
  useEffect(() => {
    const currentlyCorrect = new Set(
      pieces.filter(p => p.isCorrect).map(p => p.id)
    );
    
    // ce je novih pravilnih kosov vec kot prej, predvajaj zvok
    if (currentlyCorrect.size > correctPieces.size) {
      playSuccessSound();
    }
    
    setCorrectPieces(currentlyCorrect);
    
    // preveri, ali je puzzle koncan
    if (pieces.length > 0 && pieces.every(piece => piece.isCorrect) && !isComplete) {
      setIsComplete(true);
      setGameTimer(false);
      
      const scoreResult = calculateScore(currentTime, rows, cols, hasShownSolution);
      GameStorage.saveResult(
        rows, 
        cols, 
        currentTime, 
        scoreResult.points, 
        scoreResult.originalMaxPoints, 
        scoreResult.rank
      );
      onComplete(scoreResult, currentTime);
    }
  }, [pieces, currentTime, rows, cols, isComplete, correctPieces.size, onComplete, hasShownSolution]);

  // nalaganje slike za pridobitev njenih originalnih dimenzij
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageAspectRatio(img.width / img.height);
      setImageLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // posodobitev dimenzij kontejnerja glede na velikost okna in razmerje slike
  useEffect(() => {
    if (!imageAspectRatio) return;
    
    const updateSize = () => {
      if (!containerRef.current) return;
      
      const maxWidth = Math.min(window.innerWidth * 0.9, 1200);
      const maxHeight = window.innerHeight * 0.7;
      
      let width = maxWidth;
      let height = width / imageAspectRatio;
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * imageAspectRatio;
      }
      
      setContainerDimensions({ width, height });
      setContainerSize({ width, height });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [imageAspectRatio]);

  // inicializacija igre, ko so nastavljene dimenzije kontejnerja in je slika nalozena
  useEffect(() => {
    if (containerSize.width > 0 && imageLoaded) {
      initGame();
    }
  }, [containerSize, imageLoaded, rows, cols]);

  // inicializacija zacetek igre
  const initGame = useCallback(() => {
    if (!containerRef.current || containerSize.width === 0) return;

    console.log(axes);
    
    const pieceWidth = containerSize.width / cols;
    const pieceHeight = pieceWidth * (1 / imageAspectRatio! * (cols / rows));
    setPieceSize({ width: pieceWidth, height: pieceHeight });
    
    const newPieces: PuzzlePiece[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = row * cols + col;
        const correctX = col * pieceWidth;
        const correctY = row * pieceHeight;

        console.log(containerSize.width, pieceWidth, containerSize.width - pieceWidth);
        console.log(containerSize.height, pieceHeight, containerSize.height - pieceHeight);
        console.log("heyy");
        
        newPieces.push({
          id,
          // x: Math.random() * (containerSize.width - pieceWidth),
          // y: Math.random() * (containerSize.height - pieceHeight),
          x: 0,
          y: 0,
          correctX,
          correctY,
          // rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)],
          rotation: 0,
          isCorrect: false,
          xA: correctX,
          yA: correctY + Math.sin(axes.x[row].angle)* (correctX - axes.x[row].offSet),
          xB: correctX + pieceWidth,
          yB: correctY + Math.sin(axes.x[row].angle)* (correctX + pieceWidth - axes.x[row].offSet),
          xC: correctX + pieceWidth,
          yC: correctY + pieceHeight + Math.sin(axes.x[row+1].angle)* (correctX + pieceWidth - axes.x[row+1].offSet),
          xD: correctX,
          yD: correctY + pieceHeight + Math.sin(axes.x[row+1].angle)* (correctX - axes.x[row+1].offSet)
        });
      }
    }
    
    console.log(newPieces);

    setPieces(newPieces);
    setIsComplete(false);
  }, [containerSize, cols, rows, imageAspectRatio, containerRef]);

  useEffect(() => {
    if (containerSize.width > 0 && imageLoaded) {
      initGame();
    }
  }, [containerSize, imageLoaded, initGame]);

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

    /*offset je pomemben zato, ker:
    - Drzi relativno pozicijo miske glede na container.
    - Poskrbi, da container ostane pod misko tudi, ko ga premikamo.
    - Poskrbi za gladko premikanje brez skakanja container. */
    
    setDraggingPiece(id);
    // Premaknemo kos na vrh (konec seznama)
    setPieces(prev => [...prev.filter(p => p.id !== id), piece]);
  };

  // premik z misko
  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (draggingPiece === null) return; // preverimo, ali sploh premikamo kateri koli kos
    
    // preprečimo privzeto vedenje (npr. izbiro besedila ali premikanje strani)
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
      return; // ce ni veljavnih koordinat, ne naredimo nic
    }

    const x = clientX - containerRect.left - dragOffset.x;
    const y = clientY - containerRect.top - dragOffset.y;

    // posodobimo le tisti kos, ki ga premikamo
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
      // preverimo, ali je kos na pravi poziciji
      setPieces(prev => prev.map(piece => {
        if (piece.id === draggingPiece) {
          const isCloseX = Math.abs(piece.x - piece.correctX) < pieceSize.width * 0.15;
          const isCloseY = Math.abs(piece.y - piece.correctY) < pieceSize.height * 0.15;
          const isCorrectRotation = piece.rotation % 360 === 0;
          
          // ce je kos dovolj blizu in pravilno obrnjen, ga poravnamo
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
        return { ...piece, rotation: piece.rotation + 90, isCorrect: false };
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

  const getVerticees = (piece: PuzzlePiece) => {
    // console.log("\n Piece", piece.id);
    // console.log(`polygon(${piece.xA} ${piece.yA}, ${piece.xB} ${piece.yB}, ${piece.xC} ${piece.yC}, ${piece.xD} ${piece.yD})`);
    // console.log(`polygon(${piece.xA / containerSize.width*100}% ${piece.yA / containerSize.height*100}%, ${piece.xB / containerSize.width*100}% ${piece.yB / containerSize.height*100}%, ${piece.xC / containerSize.width*100}% ${piece.yC / containerSize.height*100}%, ${piece.xD / containerSize.width*100}% ${piece.yD / containerSize.height*100}%)`);
    // return `polygon(${piece.xA} ${piece.yA}, ${piece.xB} ${piece.yB}, ${piece.xC} ${piece.yC}, ${piece.xD} ${piece.yD})`;
    return `polygon(${piece.xA/containerSize.width*100}% ${piece.yA/containerSize.height*100}%, ${piece.xB/containerSize.width*100}% ${piece.yB/containerSize.height*100}%, ${piece.xC/containerSize.width*100}% ${piece.yC/containerSize.height*100}%, ${piece.xD/containerSize.width*100}% ${piece.yD/containerSize.height*100}%)`;
    
  }
  

  // preklopi prikaz resitve
  const toggleSolution = () => {
    const willShowSolution = !showSolution;
    const usedSolution = willShowSolution && !hasShownSolution;
    
    if (usedSolution) {
      setHasShownSolution(true);
      // posodobi scoring ce uporabnik prikaze resitev
      const newScoringConfig = getScoringConfig(rows, cols, true);
      setReducedMaxPoints(newScoringConfig.maxPoints);
    }
    
    setShowSolution(willShowSolution);
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      {/* stoparica in tockovanje */}
      <div className="flex flex-row gap-2 sm:gap-4 items-stretch justify-center w-full max-w-md">
        <Timer
          isRunning={gameTimer}
          onTimeUpdate={handleTimeUpdate}
          timeLimit={scoringConfig.timeLimit}
          className="flex-1 min-w-0"
        />
        <div className="text-center p-2 sm:p-3 rounded-lg bg-green-100 text-green-700 font-semibold flex-1 min-w-0 flex flex-col justify-center">
          <div className="text-xs sm:text-sm text-gray-600">Maksimalno</div>
          <div className="text-lg sm:text-xl font-bold">{effectiveMaxPoints}</div>
          <div className="text-[10px] sm:text-xs text-gray-500">točk</div>
        </div>
      </div>

      {/* gumb za prikaz/skrivanje resitve */}
      <Button 
        variant="outline" 
        onClick={toggleSolution}
        className="mb-2 hover:scale-105 transition-all duration-300 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:border-gray-300"
      >
        {showSolution ? 'Skrij rešitev' : 'Prikaži rešitev'}
      </Button>
      
      <div className="relative" style={{
        width: `${containerDimensions.width}px`,
        height: `${containerDimensions.height}px`,
        maxWidth: '90vw',
        maxHeight: '70vh'
      }}>
        {/* ozadje s prikazom resitve */}
        {showSolution && (
          <div 
            className="absolute inset-0 z-0 rounded-md overflow-hidden"
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100%',
            }}
          />
        )}
        
        {/* kontejner za sestavljanje */}
        <div 
          ref={containerRef}
          className={cn(
            "relative w-full h-full rounded-md shadow-inner overflow-hidden touch-none",
            showSolution ? 'bg-white/30' : 'bg-gray-800/50',
            !imageLoaded && 'invisible'
          )}
          onMouseMove={(e) => handleDragMove(e)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={(e) => handleDragMove(e)}
          onTouchEnd={handleDragEnd}
        >
          {/* mreza */}
          <div 
            className={cn(
              "absolute inset-0 grid pointer-events-none",
              showSolution ? 'rounded-md overflow-hidden' : ''
            )} 
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`
            }}
          >
            {Array.from({ length: rows * cols }).map((_, i) => (
              <div 
                key={`grid-${i}`} 
                className={cn(
                  "border border-dashed",
                  showSolution ? 'border-white/50' : 'border-gray-400/50'
                )} 
              />
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
                // width: `${pieceSize.width}px`,
                // height: `${pieceSize.height}px`,
                width: `${containerSize.width}px`,
                height: `${containerSize.height}px`,
                // left: `${piece.x}px`,
                // top: `${piece.y}px`,
                left: '0px',
                top: '0px',
                zIndex: draggingPiece === piece.id ? 10 : 1,
                transform: `rotate(${piece.rotation}deg)`,
                // clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)',
                clipPath: getVerticees(piece),
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
                  // backgroundSize: `${cols * 100}% ${rows * 100}%`,
                  backgroundSize: `${100}% ${100}%`,
                  backgroundPosition: `${-piece.correctX / pieceSize.width * 100}% ${-piece.correctY / pieceSize.height * 100}%`,
                  boxShadow: piece.isCorrect ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};