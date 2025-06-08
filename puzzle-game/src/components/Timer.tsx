import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate: (time: number) => void;
  timeLimit: number;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  isRunning,
  onTimeUpdate,
  timeLimit,
  className
}) => {
  const [time, setTime] = useState(0);

  // uporaba useCallback za memorizacijo funkcije in preprecevanje nepotrebnih posodobitev
  const handleTimeUpdate = useCallback((newTime: number) => {
    onTimeUpdate(newTime);
  }, [onTimeUpdate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          setTimeout(() => handleTimeUpdate(newTime), 0);
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
}, [isRunning, handleTimeUpdate]);

  useEffect(() => {
    if (!isRunning) {
      setTime(0);
    }
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOverLimit = time > timeLimit;
  const warningZone = time > timeLimit * 0.8;

  return (
    <div className={cn(
      "text-center p-2 sm:p-3 rounded-lg font-mono font-semibold transition-all duration-300 flex flex-col justify-center h-full",
      isOverLimit ? "bg-red-100 text-red-700 animate-pulse" : 
      warningZone ? "bg-yellow-100 text-yellow-700" : 
      "bg-blue-100 text-blue-700",
      className
    )}>
      <div className="text-xs sm:text-sm text-gray-600">Čas</div>
      <div className="text-lg sm:text-xl font-bold">{formatTime(time)}</div>
      <div className="text-[10px] sm:text-xs text-gray-500">
        Meja: {formatTime(timeLimit)}
      </div>
    </div>
  );
};