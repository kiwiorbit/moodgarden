import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Garden } from './components/Garden';
import { useGameState } from './hooks/useGameState';
import { Mood } from './types';
import { LoadingScreen } from './components/LoadingScreen';
import { MoodSelector } from './components/MoodSelector';
import { JournalHistory } from './components/JournalHistory';
import { MoodStats } from './components/MoodStats';
import { MainScreen } from './components/MainScreen';
import { ZenGarden } from './components/ZenGarden';
import { WordSearch } from './components/WordSearch';
import { JournalActivity } from './components/JournalActivity';
import { DoodleActivity } from './components/DoodleActivity';
import { BreathingActivity } from './components/BreathingActivity';

export type View = 'hub' | 'moodGarden' | 'zenGarden' | 'wordSearch' | 'journal' | 'doodle' | 'breathe' | 'stats' | 'journalHistory';

function App() {
  const { score, gardenLevel, streak, completeActivity, isMoodSelectedToday, selectMood, journalEntries, addJournalEntry, deleteJournalEntry, moodHistory } = useGameState();
  const [currentView, setCurrentView] = useState<View>('hub');
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
  
  const handleMoodSelect = (mood: Mood) => {
      const { bonusPoints } = selectMood(mood);
      if (bonusPoints > 0) {
          setRewardMessage(`+${bonusPoints} Bonus Points!`);
          setTimeout(() => {
              setRewardMessage(null);
          }, 3500);
      }
  };
  
  const handleNavigate = (view: View) => setCurrentView(view);
  const handleBackToHub = () => setCurrentView('hub');
  
  const handleCompleteActivity = (points: number) => {
    completeActivity(points);
    handleBackToHub();
  };

  const renderCurrentView = () => {
    switch(currentView) {
      case 'moodGarden':
        return <Garden level={gardenLevel} onBack={handleBackToHub} />;
      case 'zenGarden':
        return <ZenGarden onBack={handleBackToHub} onComplete={() => handleCompleteActivity(15)} />;
      case 'wordSearch':
        return <WordSearch onBack={handleBackToHub} onComplete={() => handleCompleteActivity(20)} />;
      case 'journal':
        return <JournalActivity onBack={handleBackToHub} onComplete={() => handleCompleteActivity(15)} addJournalEntry={addJournalEntry} />;
      case 'doodle':
        return <DoodleActivity onBack={handleBackToHub} onComplete={() => handleCompleteActivity(20)} />;
      case 'breathe':
        return <BreathingActivity onBack={handleBackToHub} onComplete={() => handleCompleteActivity(10)} />;
      case 'stats':
        return <MoodStats moodHistory={moodHistory} onBack={handleBackToHub} />;
      case 'journalHistory':
        return <JournalHistory entries={journalEntries} onBack={handleBackToHub} onDelete={deleteJournalEntry} />;
      case 'hub':
      default:
        return <MainScreen onNavigate={handleNavigate} score={score} streak={streak} />;
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
    return renderCurrentView();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-sky-200 via-teal-200 to-blue-300 font-['Nunito',_sans-serif] text-gray-800 selection:bg-green-400/30 animate-gradient-bg">
       {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="flex flex-col items-center w-full h-full relative">
          {renderMainContent()}
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
          @keyframes slide-in-from-bottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-in-from-bottom { animation: slide-in-from-bottom 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
          @keyframes fade-in {
            from { opacity: 0; } to { opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
           @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
                opacity: 0;
                animation: fade-in-up 0.5s ease-out forwards;
            }
             .animate-fade-in-fast { animation: fade-in 0.2s ease-out forwards; }
             .text-ellipsis { text-overflow: ellipsis; }
       `}</style>
    </div>
  );
}

export default App;
