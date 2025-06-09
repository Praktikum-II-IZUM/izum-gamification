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

export interface DifficultyStats {
  level: string;
  name: string;
  games: number;
  best: number;
  average: number;
  lastPlayed: string;
}

export interface AllStatistics {
  totalPoints: number;
  totalGames: number;
  averageScore: number;
  lastPlayed: string;
  difficultyStats: DifficultyStats[];
}

export class GameStorage {
  // Pomozna funkcija za normalizacijo oblike mreze (manjša dimenzija prva)
  private static normalizeGrid(rows: number, cols: number): [number, number] {
    return rows <= cols ? [rows, cols] : [cols, rows];
  }

  // Pomozna funkcija za pridobivanje normaliziranega kljuca
  private static getNormalizedKey(rows: number, cols: number): string {
    const [r, c] = this.normalizeGrid(rows, cols);
    return `results_${r}x${c}`;
  }
  
  // Pomozna funkcija za normalizacijo grid niza
  private static normalizeGridString(grid: string): string {
    const [r, c] = grid.split('x').map(Number);
    const [rows, cols] = this.normalizeGrid(r, c);
    return `${rows}x${cols}`;
  }
    // shrani rezultat igre
    static saveResult(rows: number, cols: number, time: number, points: number, maxPoints: number, rank: ScoreResult['rank']): void {
      // Normaliziramo dimenzije mreže (manjša številka prva)
      const [normalizedRows, normalizedCols] = this.normalizeGrid(rows, cols);
      
      const result: GameResult = {
        grid: `${normalizedRows}x${normalizedCols}`,
        time,
        points,
        maxPoints,
        rank,
        date: new Date().toISOString()
      };
  
      // Shranimo rezultat pod normaliziranim ključem
      const key = this.getNormalizedKey(rows, cols);
      const results = this.getResults(rows, cols);
      results.push(result);
      localStorage.setItem(key, JSON.stringify(results));
  
      // posodobi skupno število točk
      let totalPoints = parseInt(localStorage.getItem('totalPoints') || '0');
      totalPoints += points;
      localStorage.setItem('totalPoints', totalPoints.toString());
    }
  
    // pridobi rezultate za doloceno velikost mreze
  static getResults(rows: number, cols: number): GameResult[] {
    // Uporabimo normaliziran ključ za pridobivanje rezultatov
    const key = this.getNormalizedKey(rows, cols);
    const results = localStorage.getItem(key);
    
    if (!results) return [];
    
    // Vrnemo rezultate, uredjene po datumu (najnovejši najprej)
    return JSON.parse(results).sort((a: GameResult, b: GameResult) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
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

  // Pridobi vse rezultate iz vseh mrež
  static getAllResults(): GameResult[] {
    const results: GameResult[] = [];
    const processedGrids = new Set<string>();
    
    // Preverimo vse ključe v localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('results_')) {
        try {
          // Normaliziramo grid iz ključa
          const grid = key.replace('results_', '');
          const normalizedGrid = this.normalizeGridString(grid);
          
          // Preverimo, če smo to mrežo že obdelali
          if (!processedGrids.has(normalizedGrid)) {
            processedGrids.add(normalizedGrid);
            const gridResults = JSON.parse(localStorage.getItem(key) || '[]');
            results.push(...gridResults);
          }
        } catch (e) {
          console.error(`Error parsing results from ${key}:`, e);
        }
      }
    }
    
    // Uredimo po datumu (najnovejši najprej)
    return results.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // Pridobi statistiko za vse igre
  static getAllStatistics(): AllStatistics {
    const allResults = this.getAllResults();
    const totalPoints = allResults.reduce((sum, result) => sum + result.points, 0);
    const totalGames = allResults.length;
    const averageScore = totalGames > 0 ? Math.round(totalPoints / totalGames) : 0;
    const lastPlayed = allResults[0]?.date || '';
    
    // Definiramo vse možne težavnosti v pravilnem vrstnem redu
    // Opomba: V grid formatu je prva številka število vrstic, druga število stolpcev (rows x cols)
    const difficulties = [
      { level: '2×2', rows: 2, cols: 2, name: 'Zelo lahko' },
      { level: '2×3', rows: 2, cols: 3, name: 'Lahko' },
      { level: '3×3', rows: 3, cols: 3, name: 'Srednje' },
      { level: '3×4', rows: 3, cols: 4, name: 'Težje' },
      { level: '4×4', rows: 4, cols: 4, name: 'Težko' },
      { level: '4×5', rows: 4, cols: 5, name: 'Zelo težko' },
    ];
    
    // Ustvarimo statistiko samo za igrane težavnosti
    const difficultyStats: DifficultyStats[] = [];
    
    // Poiščemo vse igrane kombinacije
    const playedGrids = new Set<string>();
    allResults.forEach(result => {
      // Normaliziramo grid, da zagotovimo konsistentnost
      const normalizedGrid = this.normalizeGridString(result.grid);
      playedGrids.add(normalizedGrid);
    });
    
    // Za vsako igrano kombinacijo najdemo ustrezen nivo težavnosti
    playedGrids.forEach(grid => {
      const [rows, cols] = grid.split('x').map(Number);
      
      // Najdemo ustrezen nivo težavnosti
      const diff = difficulties.find(d => 
        d.rows === rows && d.cols === cols
      );
      
      if (diff) {
        // Pridobimo vse rezultate za to težavnost
        const results = allResults.filter(r => {
          const [rRows, rCols] = this.normalizeGridString(r.grid).split('x').map(Number);
          return rRows === diff.rows && rCols === diff.cols;
        });
        
        if (results.length > 0) {
          const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
          const best = Math.max(...results.map(r => r.points));
          const average = Math.round(totalPoints / results.length);
          
          difficultyStats.push({
            level: diff.level,
            name: diff.name,
            games: results.length,
            best,
            average,
            lastPlayed: results[0]?.date ? new Date(results[0].date).toLocaleDateString('sl-SI') : 'Še ni iger'
          });
        }
      }
    });
    
    // Razvrstimo težavnosti po težavnosti (od najlažje do najtežje)
    difficultyStats.sort((a, b) => {
      const [aRows, aCols] = a.level.split('×').map(Number);
      const [bRows, bCols] = b.level.split('×').map(Number);
      const aTotal = aRows * aCols;
      const bTotal = bRows * bCols;
      return aTotal - bTotal || aRows - bRows;
    });
    
    return {
      totalPoints,
      totalGames,
      averageScore,
      lastPlayed: lastPlayed ? new Date(lastPlayed).toLocaleDateString('sl-SI') : 'Še ni iger',
      difficultyStats
    };
  }
  }