import React, { useState } from 'react';
import { getRandomAffirmation } from '../constants';

export const DailyAffirmation: React.FC = () => {
  const [affirmation, setAffirmation] = useState<string | null>(null);

  const handleFetchAffirmation = () => {
    setAffirmation(getRandomAffirmation());
  };

  return (
    <div className="w-full text-center min-h-[4rem] flex flex-col justify-center items-center">
      {affirmation ? (
        <p className="text-md text-purple-800 italic animate-fade-in">"{affirmation}"</p>
      ) : (
        <div className="animate-fade-in">
          <h2 className="text-lg font-bold text-purple-800 mb-2 tracking-wide">Daily Positivity</h2>
          <button
            onClick={handleFetchAffirmation}
            className="px-5 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Get an Affirmation
          </button>
        </div>
      )}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};