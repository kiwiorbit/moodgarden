import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="text-8xl animate-grow-bounce">
        🪴
      </div>
      <h1 className="text-5xl font-extrabold text-green-900 tracking-tight mt-6 animate-fade-in">
        Mood Garden
      </h1>
      <style>{`
        @keyframes grow-bounce {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          80% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-grow-bounce {
          animation: grow-bounce 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease-out 0.5s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};