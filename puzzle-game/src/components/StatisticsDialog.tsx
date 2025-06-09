import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { GameStorage, type DifficultyStats } from '@/utils/gameStorage';
import { useIsMobile } from '@/hooks/use-mobile';

export const StatisticsDialog: React.FC = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPoints: 0,
    totalGames: 0,
    averageScore: 0,
    lastPlayed: ''
  });
  const [playedDifficulties, setPlayedDifficulties] = useState<DifficultyStats[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadStats = () => {
    try {
      setIsLoading(true);
      const statistics = GameStorage.getAllStatistics();
      
      setStats({
        totalPoints: statistics.totalPoints,
        totalGames: statistics.totalGames,
        averageScore: statistics.averageScore,
        lastPlayed: statistics.lastPlayed
      });
      
      setPlayedDifficulties(statistics.difficultyStats);
    } catch (error) {
      console.error('Napaka pri nalaganju statistik:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Poslušaj spremembe v localStorage
  useEffect(() => {
    if (!isDialogOpen) return;
    
    const handleStorageChange = () => {
      loadStats();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isDialogOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      loadStats();
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700 p-5 h-16 w-16 flex items-center justify-center rounded-full">
        <BarChart3 className="h-6 w-6" style={{ minWidth: '24px', minHeight: '24px' }} />
      </Button>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
        {isMobile ? (
          <Button 
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-gray-700 p-4 h-16 flex items-center justify-center gap-2 rounded-full"
            aria-label="Prikaži statistiko"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm">Statistika</span>
          </Button>
        ) : (
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
        )}
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-2 border-gray-700 shadow-xl text-gray-100
        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-500
        [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-600
        [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:hover:bg-gray-500"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Statistika iger
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400">Nalaganje...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Splošna statistika */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Splošna statistika</h3>
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
            
            {/* Statistika po težavnosti */}
            {playedDifficulties.length > 0 && (
              <div className="bg-gray-700/50 rounded-xl p-6 border border-amber-500/30">
                <h3 className="text-xl font-bold text-amber-400 mb-4">
                  Statistika po težavnosti
                </h3>
                <div className="space-y-4">
                  {playedDifficulties.map((diff) => (
                    <div 
                      key={diff.level}
                      className="bg-gray-800/50 p-4 rounded-lg border border-amber-500/30"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-200">
                          {diff.name} <span className="text-amber-400">({diff.level})</span>
                        </h4>
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300">
                          {diff.games} {diff.games === 1 ? 'igra' : diff.games < 5 ? 'igre' : 'iger'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Najboljši rezultat</p>
                          <p className="text-xl font-bold text-yellow-400">{diff.best} točk</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Povprečje</p>
                          <p className="text-xl font-bold">{diff.average} točk</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-400">Zadnja igra</p>
                          <p className="text-gray-200">
                            {diff.lastPlayed || 'Ni podatka'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
