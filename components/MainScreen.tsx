import React from 'react';
import { View } from '../App';
import { Header } from './Header';
import { ScoreDisplay } from './ScoreDisplay';
import { StreakDisplay } from './StreakDisplay';
import { DailyAffirmation } from './DailyAffirmation';

interface MainScreenProps {
  score: number;
  streak: number;
  onNavigate: (view: View) => void;
}

const NAV_ITEMS: { view: View, icon: string, title: string, color: string }[] = [
    { view: 'moodGarden', icon: '🪴', title: 'Mood Garden', color: 'bg-green-200' },
    { view: 'zenGarden', icon: '🎋', title: 'Zen Garden', color: 'bg-teal-200' },
    { view: 'wordSearch', icon: '🔍', title: 'Word Find', color: 'bg-sky-200' },
    { view: 'journal', icon: '✍️', title: 'Journal', color: 'bg-amber-200' },
    { view: 'doodle', icon: '🎨', title: 'Doodle', color: 'bg-red-200' },
    { view: 'breathe', icon: '🧘', title: 'Breathe', color: 'bg-blue-200' },
    { view: 'stats', icon: '📊', title: 'My Stats', color: 'bg-indigo-200' },
    { view: 'journalHistory', icon: '📖', title: 'My Journal', color: 'bg-purple-200' },
];

export const MainScreen: React.FC<MainScreenProps> = ({ score, streak, onNavigate }) => {
  return (
    <>
      <Header />
      <div className="flex items-center gap-3 flex-shrink-0 mb-2">
          <ScoreDisplay score={score} />
          <StreakDisplay streak={streak} />
      </div>
      <main className="w-full flex-grow flex items-center justify-center transition-all duration-500 overflow-y-auto p-4">
        <div className="w-full max-w-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {NAV_ITEMS.map((item, index) => (
                    <button
                        key={item.view}
                        onClick={() => onNavigate(item.view)}
                        className={`p-4 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 animate-fade-in-up ${item.color}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        aria-label={`Go to ${item.title}`}
                    >
                        <span className="text-5xl">{item.icon}</span>
                        <span className="block text-sm font-bold text-gray-800 mt-2 tracking-tight">{item.title}</span>
                    </button>
                ))}
            </div>
             <div className="mt-6 w-full p-4 bg-white/40 rounded-2xl shadow-lg backdrop-blur-lg border-t border-white/50 animate-fade-in-up" style={{ animationDelay: `${NAV_ITEMS.length * 50}ms` }}>
                <DailyAffirmation />
            </div>
        </div>
      </main>
    </>
  );
};
