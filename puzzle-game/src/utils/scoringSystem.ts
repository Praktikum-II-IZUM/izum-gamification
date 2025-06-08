export interface ScoringConfig {
  maxPoints: number;
  timeLimit: number;
  difficulty: number;
  hasUsedSolution?: boolean;
}

export interface ScoreResult {
  points: number;
  maxPoints: number;
  timeLimit: number;
  percentage: number;
  rank: 'zlata medalja' | 'srebrna medalja' | 'bronasta medalja' | 'Več sreče prihodnjič!';
  usedSolution: boolean;
  originalMaxPoints: number;
}

// izracun najvecjega stevila tock: MAX_POINTS = 100 × 2^(D - 1)
// ce je uporabil resitev lahko max 60% tock
export const calculateMaxPoints = (difficulty: number, hasUsedSolution: boolean = false): number => {
  const basePoints = 100 * Math.pow(2, difficulty - 1);
  return hasUsedSolution ? Math.floor(basePoints * 0.6) : basePoints;
};

// izracun casovne omejitve: TIME_LIMIT = 10 + (N × M - 4) × 5
export const calculateTimeLimit = (rows: number, cols: number): number => {
  const totalPieces = rows * cols;
  return 10 + (totalPieces - 4) * 5;
};

// izracun stopnje zahtevnosti glede na velikost mreze
export const calculateDifficulty = (rows: number, cols: number): number => {
  const totalPieces = rows * cols;
  if (totalPieces <= 4) return 1;  // 2×2
  if (totalPieces <= 6) return 2;  // 2×3
  if (totalPieces <= 9) return 3;  // 3×3
  if (totalPieces <= 12) return 4; // 3×4
  if (totalPieces <= 16) return 5; // 4×4
  return 6; // 4×5
};

// izracun tock glede na cas resevanja
export const calculateScore = (
  completionTime: number,
  rows: number,
  cols: number,
  hasUsedSolution: boolean = false,
  k: number = 0.05
): ScoreResult => {
  const difficulty = calculateDifficulty(rows, cols);
  const originalMaxPoints = 100 * Math.pow(2, difficulty - 1);
  const maxPoints = hasUsedSolution ? Math.floor(originalMaxPoints * 0.6) : originalMaxPoints;
  const timeLimit = calculateTimeLimit(rows, cols);
  
  let points: number;
  
  if (completionTime <= timeLimit) {
    points = maxPoints;
  } else {
    const timePenalty = completionTime - timeLimit;
    points = maxPoints * Math.exp(-k * timePenalty);
  }
  
  points = Math.floor(points);
  
  const percentage = (points / maxPoints) * 100;
  
  // rang
  let rank: 'zlata medalja' | 'srebrna medalja' | 'bronasta medalja' | 'Več sreče prihodnjič!';
  if (percentage >= 100) rank = 'zlata medalja';
  else if (percentage >= 60) rank = 'srebrna medalja';
  else if (percentage >= 30) rank = 'bronasta medalja';
  else rank = 'Več sreče prihodnjič!';
  
  return {
    points,
    maxPoints,
    originalMaxPoints,
    timeLimit,
    percentage,
    rank,
    usedSolution: hasUsedSolution
  };
};

// nastavitev tockovanja za dano stopnjo zahtevnosti
export const getScoringConfig = (rows: number, cols: number, hasUsedSolution: boolean = false): ScoringConfig => {
  const difficulty = calculateDifficulty(rows, cols);
  const maxPoints = calculateMaxPoints(difficulty, hasUsedSolution);
  const timeLimit = calculateTimeLimit(rows, cols);
  
  return {
    maxPoints,
    timeLimit,
    difficulty,
    hasUsedSolution
  };
};