import React from 'react';
import { cn } from '@/lib/utils';
import { ScoreResult } from '@/utils/scoringSystem';
import { GameStorage } from '@/utils/gameStorage';

interface ScoreDisplayProps {
  scoreResult: ScoreResult;
  completionTime: number;
  rows: number;
  cols: number;
  className?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  scoreResult,
  completionTime,
  rows,
  cols,
  className
}) => {
  const statistics = GameStorage.getStatistics(rows, cols);
  const totalPoints = GameStorage.getTotalPoints();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'zlata medalja': return 'text-yellow-600 bg-yellow-50';
      case 'srebrna medalja': return 'text-gray-600 bg-gray-50';
      case 'bronasta medalja': return 'text-amber-700 bg-amber-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getRankEmoji = (rank: string) => {
    switch (rank) {
      case 'zlata medalja': return '🥇';
      case 'srebrna medalja': return '🥈';
      case 'bronasta medalja': return '🥉';
      default: return '📊';
    }
  };

  const isNewBest = scoreResult.points > statistics.best;

  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-lg border", className)}>
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Tvoj rezultat
        </h3>
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {scoreResult.points} točk
          {isNewBest && <span className="text-xl text-green-500 ml-2">🎉 Nov rekord!</span>}
        </div>
        <div className="text-sm text-gray-600">
          od {scoreResult.maxPoints} možnih
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
  <div className="text-center">
    <div className="text-sm text-gray-600">Čas rešitve</div>
    <div className="text-lg font-bold text-gray-900">{formatTime(completionTime)}</div>
  </div>
  <div className="text-center">
    <div className="text-sm text-gray-600">Časovna meja</div>
    <div className="text-lg font-bold text-gray-900">{formatTime(scoreResult.timeLimit)}</div>
  </div>
</div>

      <div className="text-center mb-4">
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold",
          getRankColor(scoreResult.rank)
        )}>
          <span className="text-2xl">{getRankEmoji(scoreResult.rank)}</span>
          <span>{scoreResult.rank}</span>
          <span className="text-sm">({Math.round(scoreResult.percentage)}%)</span>
        </div>
      </div>

{/* statistike */}
<div className="bg-white rounded-lg p-4 mt-4 border border-black shadow-sm">
  <h4 className="text-lg font-bold text-black mb-3 text-center">
    Statistike za {rows}×{cols}
  </h4>
  <div className="grid grid-cols-2 gap-4 text-sm">
    <div className="text-center">
      <div className="text-sm text-gray-600">Najboljši</div>
      <div className="font-bold text-gray-900">{statistics.best} točk</div>
    </div>
    <div className="text-center">
      <div className="text-sm text-gray-600">Povprečje</div>
      <div className="font-bold text-gray-900">{statistics.average} točk</div>
    </div>
    <div className="text-center">
      <div className="text-sm text-gray-600">Odigrane igre</div>
      <div className="font-bold text-gray-900">{statistics.totalGames}</div>
    </div>
    <div className="text-center">
      <div className="text-sm text-gray-600">Skupaj točk</div>
      <div className="font-bold text-gray-900">{totalPoints}</div>
    </div>
  </div>
</div>

    {completionTime > scoreResult.timeLimit && (
    <div className="text-center text-sm font-medium text-white bg-orange-600 p-2 rounded mt-4">
        ⚠️ Čas je bil presežen za {completionTime - scoreResult.timeLimit}s
    </div>
    )}
    </div>
  );
};