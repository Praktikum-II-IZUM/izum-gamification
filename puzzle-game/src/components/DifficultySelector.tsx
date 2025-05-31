import React from 'react';
import { cn } from "@/lib/utils";

type Difficulty = {
  cols: number;
  rows: number;
  label: string;
};

interface DifficultySelectorProps {
  difficulties: Difficulty[];
  selected: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulties,
  selected,
  onChange
}) => {
  // Define colors for each difficulty level (blue to red gradient)
  const difficultyColors = [
    'from-blue-400 to-blue-500',    // Easiest
    'from-blue-300 to-blue-400',
    'from-cyan-300 to-cyan-400',
    'from-amber-300 to-amber-400',
    'from-orange-400 to-orange-500',
    'from-red-400 to-red-500'      // Hardest
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-600 mb-2">Težavnost</p>
      <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg space-x-0.5">
        {difficulties.map((difficulty, index) => {
          const isSelected = selected.label === difficulty.label;
          const bgGradient = difficultyColors[index] || 'from-gray-400 to-gray-500';
          
          return (
            <button
              key={difficulty.label}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                isSelected 
                  ? `text-white bg-gradient-to-r ${bgGradient} shadow-md rounded`
                  : "text-gray-600 hover:bg-gray-200 rounded",
                "flex-1 min-w-0" // Ensure buttons take equal width and handle text overflow
              )}
              onClick={() => onChange(difficulty)}
            >
              <span className="whitespace-nowrap">
                {difficulty.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
