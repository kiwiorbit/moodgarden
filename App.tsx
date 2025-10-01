import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Garden } from './components/Garden';
import { ScoreDisplay } from './components/ScoreDisplay';
import { StreakDisplay } from './components/StreakDisplay';
import { ActivityModal } from './components/ActivityModal';
import { DailyAffirmation } from './components/DailyAffirmation';
import { useGameState } from './hooks/useGameState';
import { Activity, Mood } from './types';
import { ACTIVITIES } from './constants';
import { LoadingScreen } from './components/LoadingScreen';
import { MoodSelector } from './components/MoodSelector';
import { JournalHistory } from './components/JournalHistory';

function App() {
  const { score, gardenLevel, streak, completeActivity, isMoodSelectedToday, selectMood, journalEntries, addJournalEntry, deleteJournalEntry } = useGameState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJournalHistoryOpen, setIsJournalHistoryOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500); // Loading screen duration
    return () => clearTimeout(timer);
  }, []);

  const handleStartActivity = (activity: Activity) => {
    setCurrentActivity(activity);
    setIsModalOpen(true);
  };

  const handleCompleteActivity = (points: number) => {
    completeActivity(points);
    setIsModalOpen(false);
    setCurrentActivity(null);
  };
  
  const handleMoodSelect = (mood: Mood) => {
      const { bonusPoints } = selectMood(mood);
      if (bonusPoints > 0) {
          setRewardMessage(`+${bonusPoints} Bonus Points!`);
          setTimeout(() => {
              setRewardMessage(null);
          }, 3500);
      }
  };

  const renderMainContent = () => {
    if (!isMoodSelectedToday) {
      return (
        <div className="flex-grow flex items-center justify-center w-full">
          <MoodSelector onMoodSelect={handleMoodSelect} />
        </div>
      );
    }

    return (
       <>
        <Header />
        <div className="flex items-center gap-3 flex-shrink-0 mb-2">
            <ScoreDisplay score={score} />
            <StreakDisplay streak={streak} />
        </div>
        <main className="w-full flex-grow flex items-center justify-center transition-all duration-500">
          <Garden level={gardenLevel} />
        </main>
        <div className="w-full max-w-md p-4 bg-white/40 rounded-t-3xl shadow-lg backdrop-blur-lg border-t border-white/50 flex-shrink-0">
          <DailyAffirmation />
          <div className="my-3 h-px bg-white/50"></div>
          <div className="flex justify-between items-center mb-3">
             <h2 className="text-lg font-bold text-green-900 tracking-wide">Mood Boosters</h2>
             <button
                onClick={() => setIsJournalHistoryOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
             >
                <span className="text-xl">📖</span>
                <span className="text-sm font-semibold text-purple-800">My Journal</span>
             </button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {ACTIVITIES.map((activity) => (
              <button
                key={activity.type}
                onClick={() => handleStartActivity(activity)}
                className="flex flex-col items-center justify-center p-2 bg-white/70 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                aria-label={activity.name}
              >
                <span className="text-3xl sm:text-4xl">{activity.icon}</span>
                <span className="text-xs font-semibold text-gray-700 mt-1 tracking-tight">{activity.name}</span>
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-sky-200 via-teal-200 to-blue-300 font-['Nunito',_sans-serif] text-gray-800 selection:bg-green-400/30 animate-gradient-bg">
       {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="flex flex-col items-center w-full h-full relative">
          {renderMainContent()}
          {isModalOpen && currentActivity && (
            <ActivityModal
              activity={currentActivity}
              onClose={() => setIsModalOpen(false)}
              onComplete={handleCompleteActivity}
              addJournalEntry={addJournalEntry}
            />
          )}
          {isJournalHistoryOpen && (
            <JournalHistory 
              entries={journalEntries}
              onClose={() => setIsJournalHistoryOpen(false)}
              onDelete={deleteJournalEntry}
            />
          )}
           {rewardMessage && (
            <div key={rewardMessage} className="absolute top-1/4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-celebrate">
              <span className="text-6xl mb-2" role="img" aria-label="Party popper">🎉</span>
              <div className="bg-yellow-300 text-yellow-900 font-bold text-2xl px-6 py-3 rounded-full shadow-2xl border-4 border-white">
                Streak Reward! <span className="font-extrabold">{rewardMessage}</span>
              </div>
            </div>
          )}
        </div>
      )}
      <style>{`
          @keyframes gradient-bg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-bg {
            background-size: 200% 200%;
            animation: gradient-bg 15s ease infinite;
          }
          @keyframes celebrate {
            0% { transform: translate(-50%, -100px) scale(0.5); opacity: 0; }
            20% { transform: translate(-50%, 0) scale(1.1); opacity: 1; }
            80% { transform: translate(-50%, 0) scale(1); opacity: 1; }
            100% { transform: translate(-50%, 50px) scale(0.8); opacity: 0; }
          }
          .animate-celebrate {
            animation: celebrate 3.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
       `}</style>
    </div>
  );
}

export default App;