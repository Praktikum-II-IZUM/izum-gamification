
export interface ScoringConfig {
    maxPoints: number;
    timeLimit: number;
    difficulty: number;
  }
  
  export interface ScoreResult {
    points: number;
    maxPoints: number;
    timeLimit: number;
    percentage: number;
    rank: 'Gold' | 'Silver' | 'Bronze' | 'None';
  }
  
  // Calculate maximum points: MAX_POINTS = 100 × 2^(D - 1)
  export const calculateMaxPoints = (difficulty: number): number => {
    return 100 * Math.pow(2, difficulty - 1);
  };
  
  // Calculate time limit: TIME_LIMIT = 10 + (N × M - 4) × 5
  export const calculateTimeLimit = (rows: number, cols: number): number => {
    const totalPieces = rows * cols;
    return 10 + (totalPieces - 4) * 5;
  };
  
  // Calculate difficulty level based on grid size
  export const calculateDifficulty = (rows: number, cols: number): number => {
    const totalPieces = rows * cols;
    if (totalPieces <= 4) return 1;  // 2×2
    if (totalPieces <= 6) return 2;  // 2×3
    if (totalPieces <= 9) return 3;  // 3×3
    if (totalPieces <= 12) return 4; // 3×4
    if (totalPieces <= 16) return 5; // 4×4
    return 6; // 4×5 and above
  };
  
  // Calculate points based on completion time
  export const calculateScore = (
    completionTime: number,
    rows: number,
    cols: number,
    k: number = 0.05
  ): ScoreResult => {
    const difficulty = calculateDifficulty(rows, cols);
    const maxPoints = calculateMaxPoints(difficulty);
    const timeLimit = calculateTimeLimit(rows, cols);
    
    let points: number;
    
    if (completionTime <= timeLimit) {
      points = maxPoints;
    } else {
      const timePenalty = completionTime - timeLimit;
      points = maxPoints * Math.exp(-k * timePenalty);
    }
    
    // Round down to whole number
    points = Math.floor(points);
    
    const percentage = (points / maxPoints) * 100;
    
    // Determine rank
    let rank: 'Gold' | 'Silver' | 'Bronze' | 'None';
    if (percentage >= 100) rank = 'Gold';
    else if (percentage >= 60) rank = 'Silver';
    else if (percentage >= 30) rank = 'Bronze';
    else rank = 'None';
    
    return {
      points,
      maxPoints,
      timeLimit,
      percentage,
      rank
    };
  };
  
  // Get scoring configuration for a given difficulty
  export const getScoringConfig = (rows: number, cols: number): ScoringConfig => {
    const difficulty = calculateDifficulty(rows, cols);
    const maxPoints = calculateMaxPoints(difficulty);
    const timeLimit = calculateTimeLimit(rows, cols);
    
    return {
      maxPoints,
      timeLimit,
      difficulty
    };
  };