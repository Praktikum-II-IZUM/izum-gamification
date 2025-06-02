
import React from 'react';
import { cn } from '@/lib/utils';
import { ScoreResult } from '@/utils/scoringSystem';

interface ScoreDisplayProps {
  scoreResult: ScoreResult;
  completionTime: number;
  className?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  scoreResult,
  completionTime,
  className
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Gold': return 'text-yellow-600 bg-yellow-50';
      case 'Silver': return 'text-gray-600 bg-gray-50';
      case 'Bronze': return 'text-amber-700 bg-amber-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getRankEmoji = (rank: string) => {
    switch (rank) {
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      case 'Bronze': return '🥉';
      default: return '📊';
    }
  };

  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-lg border", className)}>
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Tvoj rezultat
        </h3>
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {scoreResult.points} točk
        </div>
        <div className="text-sm text-gray-600">
          od {scoreResult.maxPoints} možnih
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">Čas rešitve</div>
          <div className="text-lg font-semibold">{formatTime(completionTime)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Časovna meja</div>
          <div className="text-lg font-semibold">{formatTime(scoreResult.timeLimit)}</div>
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

      {completionTime > scoreResult.timeLimit && (
        <div className="text-center text-sm text-orange-600 bg-orange-50 p-2 rounded">
          ⚠️ Čas je bil presežen za {completionTime - scoreResult.timeLimit}s
        </div>
      )}
    </div>
  );
};