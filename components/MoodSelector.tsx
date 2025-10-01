
import React from 'react';
import { MOODS } from '../constants';
import { Mood } from '../types';

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in-scale">
       <div className="p-8 bg-white/60 rounded-3xl shadow-xl backdrop-blur-md w-full">
         <h2 className="text-3xl font-bold text-center text-green-800 mb-6">How are you feeling today?</h2>
         <div className="flex flex-wrap justify-center gap-4">
           {MOODS.map(({ type, icon }) => (
             <button
               key={type}
               onClick={() => onMoodSelect(type)}
               className="flex flex-col items-center justify-center p-3 w-28 h-28 bg-white rounded-2xl shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
             >
               <span className="text-4xl mb-1">{icon}</span>
               <span className="font-semibold text-gray-700 text-sm">{type}</span>
             </button>
           ))}
         </div>
       </div>
        <style>{`
          @keyframes fade-in-scale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-scale { animation: fade-in-scale 0.5s ease-out forwards; }
       `}</style>
    </div>
  );
};
