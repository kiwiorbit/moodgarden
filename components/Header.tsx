import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full text-center p-2 flex-shrink-0">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900 tracking-tight drop-shadow-md">
        Mood Garden
      </h1>
      <p className="text-sm text-green-800/80 drop-shadow-sm">Nurture your mind, grow your happiness.</p>
    </header>
  );
};