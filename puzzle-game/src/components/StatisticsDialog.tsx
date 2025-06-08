import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { GameStorage } from '@/utils/gameStorage';

interface GameStats {
  level: string;
  name: string;
  games: number;
  best: number;
  average: number;
  lastPlayed: string;
}

export const StatisticsDialog: React.FC = () => {
  const [stats, setStats] = useState({
    totalPoints: 0,
    totalGames: 0,
    averageScore: 0,
    lastPlayed: ''
  });

  const [playedDifficulties, setPlayedDifficulties] = useState<GameStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      const allResults = GameStorage.getAllResults();
      const totalPoints = GameStorage.getTotalPoints();
      
      // splosna statistika
      if (allResults.length > 0) {
        const totalScores = allResults.reduce((sum, result) => sum + result.points, 0);
        
        setStats({
          totalPoints,
          totalGames: allResults.length,
          averageScore: Math.round(totalScores / allResults.length),
          lastPlayed: allResults[0]?.date 
            ? new Date(allResults[0].date).toLocaleDateString('sl-SI') 
            : ''
        });

        // pridobimo vse igrane tezavnosti
        const difficultyMap = new Map<string, {
          level: string;
          name: string;
          games: number;
          totalPoints: number;
          best: number;
          lastPlayed: string;
        }>();

        // definiramo mozne tezavnosti
        const difficulties = [
          { level: '2×2', rows: 2, cols: 2, name: 'Zelo lahko' },
          { level: '2×3', rows: 2, cols: 3, name: 'Lahko' },
          { level: '3×3', rows: 3, cols: 3, name: 'Srednje' },
          { level: '3×4', rows: 3, cols: 4, name: 'Težje' },
          { level: '4×4', rows: 4, cols: 4, name: 'Težko' },
          { level: '4×5', rows: 4, cols: 5, name: 'Zelo težko' },
        ];

        // vse rezultate zdruzimo po tezavnosti
        allResults.forEach(game => {
          const [rows, cols] = game.grid.split('x').map(Number);
          const difficulty = difficulties.find(d => d.rows === rows && d.cols === cols);
          
          if (difficulty) {
            const key = `${rows}x${cols}`;
            const existing = difficultyMap.get(key) || { 
              level: difficulty.level, 
              name: difficulty.name,
              games: 0, 
              totalPoints: 0, 
              best: 0,
              lastPlayed: ''
            };
            
            existing.games += 1;
            existing.totalPoints += game.points;
            existing.best = Math.max(existing.best, game.points);
            
            const gameDate = new Date(game.date).getTime();
            const lastDate = existing.lastPlayed ? new Date(existing.lastPlayed).getTime() : 0;
            
            if (gameDate > lastDate) {
              existing.lastPlayed = game.date;
            } else if (!existing.lastPlayed) {
              existing.lastPlayed = game.date;
            }
            
            difficultyMap.set(key, existing);
          }
        });

        // pretvorimo v seznam in uredimo po tezavnosti
        const playedStats = Array.from(difficultyMap.values())
          .map(d => ({
            level: d.level,
            name: d.name,
            games: d.games,
            best: d.best,
            average: Math.round(d.totalPoints / d.games),
            lastPlayed: d.lastPlayed ? new Date(d.lastPlayed).toLocaleDateString('sl-SI') : ''
          }))
          .sort((a, b) => {
            // uredimo po tezavnosti (vrstice, stolpci)
            const aLevel = a.level.split('×').map(Number);
            const bLevel = b.level.split('×').map(Number);
            return aLevel[0] - bLevel[0] || aLevel[1] - bLevel[1];
          });

        setPlayedDifficulties(playedStats);
      }
      
      setIsLoading(false);
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700 p-5 h-16 w-16 flex items-center justify-center rounded-full">
        <BarChart3 className="h-6 w-6" style={{ minWidth: '24px', minHeight: '24px' }} />
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white hover:bg-gray-700 p-5 h-16 w-16 flex items-center justify-center rounded-full"
          aria-label="Prikaži statistiko"
        >
          <BarChart3 
            className="h-6 w-6" 
            style={{ minWidth: '24px', minHeight: '24px' }} 
          />
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-2 border-gray-700 shadow-xl text-gray-100
        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-500
        [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-600
        [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:hover:bg-gray-500"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6 text-gray-100">
            Statistika
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 px-1">
          {/* splosna statistika */}
          <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-bold text-gray-100 mb-4">
              Splošna statistika
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <p className="text-gray-400 text-sm">Skupaj točk</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalPoints.toLocaleString('sl-SI')}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <p className="text-gray-400 text-sm">Število iger</p>
                <p className="text-3xl font-bold text-green-400">{stats.totalGames}</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <p className="text-gray-400 text-sm">Povprečje točk na igro</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {stats.totalGames > 0 ? stats.averageScore : '0'}
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                <p className="text-gray-400 text-sm">Zadnja igra</p>
                <p className="text-xl font-medium text-gray-200">
                  {stats.lastPlayed || 'Še ni iger'}
                </p>
              </div>
            </div>
          </div>

          {/* statistika po tezavnosti */}
          {playedDifficulties.length > 0 && (
            <div className="bg-gray-700/50 rounded-xl p-6 border border-amber-500/30">
              <h3 className="text-xl font-bold text-amber-400 mb-4">
                Statistika po težavnosti
              </h3>
              <div className="space-y-4">
                {playedDifficulties.map(({ level, name, games, best, average, lastPlayed }) => (
                  <div key={level} className="bg-gray-800/50 p-4 rounded-lg border border-amber-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-200">{level} - {name}</h4>
                        <p className="text-xs text-gray-400">Zadnja igra: {lastPlayed}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300">
                        Odigranih iger: {games}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div>
                        <p className="text-gray-400">Najboljši rezultat</p>
                        <p className="font-medium text-yellow-400">{best} točk</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Povprečje</p>
                        <p className="font-medium">{average} točk</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
