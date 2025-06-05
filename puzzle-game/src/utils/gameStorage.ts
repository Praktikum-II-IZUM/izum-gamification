import { ScoreResult } from './scoringSystem';

export interface GameResult {
    grid: string;
    time: number;
    points: number;
    maxPoints: number;
    rank: ScoreResult['rank'];
    date: string;
  }
  
  export interface GameStatistics {
    best: number;
    average: number;
    totalGames: number;
    totalPoints: number;
  }
  
  export class GameStorage {
    // shrani rezultat igre
    static saveResult(rows: number, cols: number, time: number, points: number, maxPoints: number, rank: ScoreResult['rank']): void {
      const result: GameResult = {
        grid: `${rows}x${cols}`,
        time,
        points,
        maxPoints,
        rank,
        date: new Date().toISOString()
      };
  
      // shrani med rezultate za to velikost mreze
      const key = `results_${rows}x${cols}`;
      const results = this.getResults(rows, cols);
      results.push(result);
      localStorage.setItem(key, JSON.stringify(results));
  
      // posodobi skupno stevilo tock
      let totalPoints = parseInt(localStorage.getItem('totalPoints') || '0');
      totalPoints += points;
      localStorage.setItem('totalPoints', totalPoints.toString());
    }
  
    // pridobi rezultate za doloceno velikost mreze
    static getResults(rows: number, cols: number): GameResult[] {
      const key = `results_${rows}x${cols}`;
      const results = localStorage.getItem(key);
      return results ? JSON.parse(results) : [];
    }
  
    // pridobi statistiko za doloceno velikost mreze
    static getStatistics(rows: number, cols: number): GameStatistics {
      const results = this.getResults(rows, cols);
      
      if (results.length === 0) {
        return {
          best: 0,
          average: 0,
          totalGames: 0,
          totalPoints: 0
        };
      }
  
      const best = Math.max(...results.map(r => r.points));
      const average = Math.floor(results.reduce((sum, r) => sum + r.points, 0) / results.length);
      const totalPoints = parseInt(localStorage.getItem('totalPoints') || '0');
  
      return {
        best,
        average,
        totalGames: results.length,
        totalPoints
      };
    }
  
    // pridobi skupno stevilo tock vseh iger
    static getTotalPoints(): number {
      return parseInt(localStorage.getItem('totalPoints') || '0');
    }
  
    // pridobi vse rezultate vseh velikosti mreze
    static getAllResults(): GameResult[] {
      const allResults: GameResult[] = [];
      
      // preveri pogoste velikosti mreze
      const gridSizes = [
        [2, 2], [2, 3], [3, 3], [3, 4], [4, 4], [4, 5]
      ];
  
      gridSizes.forEach(([rows, cols]) => {
        const results = this.getResults(rows, cols);
        allResults.push(...results);
      });
  
      return allResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }