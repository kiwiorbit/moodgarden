import React, { useState, useEffect } from 'react';
import { getRandomJournalPrompt } from '../constants';

interface JournalActivityProps {
  onBack: () => void;
  onComplete: () => void;
  addJournalEntry: (text: string) => void;
}

export const JournalActivity: React.FC<JournalActivityProps> = ({ onBack, onComplete, addJournalEntry }) => {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const minLength = 25;

  useEffect(() => {
    setIsLoading(true);
    const fetchedPrompt = getRandomJournalPrompt();
    setPrompt(fetchedPrompt);
    setIsLoading(false);
  }, []);

  const handleComplete = () => {
    if (isComplete) {
      addJournalEntry(text);
      onComplete();
    }
  };

  const isComplete = text.trim().length >= minLength;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col p-4 animate-slide-in-from-bottom" role="dialog" aria-modal="true">
      <header className="flex justify-between items-start mb-4 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gratitude Journal</h2>
          <p className="text-gray-500 mt-1">Write down what you're grateful for.</p>
        </div>
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors text-4xl leading-none -mt-1" aria-label="Close modal">&times;</button>
      </header>
      <main className="flex-grow overflow-hidden flex flex-col">
        <div className="mb-4 min-h-[3rem] flex items-center justify-center">
            {isLoading ? (
            <p className="text-gray-500 italic animate-pulse">Finding some inspiration...</p>
            ) : (
            <p className="text-center text-gray-700 font-semibold animate-fade-in">"{prompt}"</p>
            )}
        </div>
        <textarea
            className="w-full flex-grow p-4 border border-amber-200 bg-amber-50 text-gray-800 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none transition placeholder-gray-500/70"
            placeholder="Let your thoughts flow..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Gratitude Journal Input"
            disabled={isLoading}
        />
        <div className="text-right text-sm text-gray-500 mt-1 pr-1 flex-shrink-0">
            {text.trim().length}/{minLength}
        </div>
        <button
            onClick={handleComplete}
            disabled={!isComplete}
            className="mt-4 w-full py-3 px-4 text-white font-bold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:cursor-not-allowed flex-shrink-0"
            style={{ 
            backgroundColor: isComplete ? '#22c55e' : '#9ca3af',
            boxShadow: isComplete ? '0 4px 14px 0 rgba(34, 197, 94, 0.39)' : 'none',
            }}
        >
            {isComplete ? 'Complete' : 'Write a little more...'}
        </button>
      </main>
    </div>
  );
};
