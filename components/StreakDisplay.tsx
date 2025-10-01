import React from 'react';

interface StreakDisplayProps {
  streak: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak }) => {
  if (streak === 0) {
    return null;
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-full px-4 py-1 shadow-lg border border-white/50 flex items-center gap-2">
        <span className="text-xl" role="img" aria-label="Streak flame">🔥</span>
        <span className="text-md font-extrabold text-orange-600">{streak}</span>
        <span className="text-sm font-bold text-orange-500 -ml-1"> Day{streak > 1 ? 's' : ''}</span>
    </div>
  );
};