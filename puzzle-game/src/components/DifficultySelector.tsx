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
  className?: string;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulties,
  selected,
  onChange,
  className
}) => {
  // vedno razdelimo na dve vrstici s po 3 elemente
  const firstRow = difficulties.slice(0, 3);
  const secondRow = difficulties.slice(3);

  // definiraj barvne nivoje (gradient)
  const difficultyColors = [
    'from-blue-400 to-blue-500',    // najlazji
    'from-blue-300 to-blue-400',
    'from-cyan-300 to-cyan-400',
    'from-amber-300 to-amber-400',
    'from-orange-400 to-orange-500',
    'from-red-400 to-red-500'      // najteži
  ];

  const renderButtonRow = (difficulties: Difficulty[], isSecondRow = false) => (
    <div className={`flex items-center ${isSecondRow ? 'mt-3' : ''}`}>
      {difficulties.map((difficulty, index) => {
        const isSelected = selected.label === difficulty.label;
        const difficultyIndex = isSecondRow ? index + 3 : index;
        const bgGradient = difficultyColors[difficultyIndex] || 'from-gray-200 to-gray-300';
        
        return (
          <React.Fragment key={difficulty.label}>
            {index > 0 && (
              <div className="h-6 w-px bg-gray-300 mx-1.5" />
            )}
            <button
              className={cn(
                "px-4 py-4 text-base font-medium transition-all duration-150 h-14 flex-1 min-w-0",
                "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400",
                "rounded-xl whitespace-nowrap bg-[#EEEEEF]",
                isSelected 
                  ? `text-white bg-gradient-to-r ${bgGradient} shadow-md`
                  : "text-gray-600 hover:bg-gray-200"
              )}
              onClick={() => onChange(difficulty)}
            >
              {difficulty.label.split(' ')[0]}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className={cn("w-full px-5 py-4 max-w-3xl mx-auto", className)}>
      <p className="text-lg font-medium text-gray-100 dark:text-gray-100 mb-3 px-1">Težavnost:</p>
      <div className="bg-[#EEEEEF] rounded-2xl p-2 w-full">
        {renderButtonRow(firstRow)}
        {secondRow.length > 0 && renderButtonRow(secondRow, true)}
      </div>
    </div>
  );
};
