import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-full px-4 py-1 shadow-lg border border-white/50">
        <span className="text-sm font-bold text-yellow-600">Mood Score: </span>
        <span className="text-md font-extrabold text-yellow-800">{score}</span>
    </div>
  );
};