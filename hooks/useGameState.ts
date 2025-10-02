import { useState, useEffect, useCallback } from 'react';
import { Mood, JournalEntry, MoodEntry } from '../types';

const getGardenLevel = (score: number): number => {
  if (score < 10) return 0; // Seed
  if (score < 30) return 1; // Sprout
  if (score < 60) return 2; // Small flower
  if (score < 100) return 3; // Blooming flower
  if (score < 150) return 4; // Butterfly appears
  if (score < 220) return 5; // Second flower
  if (score < 300) return 6; // Sun appears
  return 7; // Full garden
};

const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

const STREAK_MILESTONES: { [key: number]: number } = {
  3: 25,
  7: 50,
  14: 100,
  30: 250,
};

export const useGameState = () => {
  const [score, setScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('moodGardenScore');
      return saved ? JSON.parse(saved) : 0;
    } catch (error) {
      console.error('Error reading score from localStorage', error);
      return 0;
    }
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('moodGardenStreak');
      return saved ? JSON.parse(saved) : 0;
    } catch (error) {
      console.error('Error reading streak from localStorage', error);
      return 0;
    }
  });

  const [lastStreakUpdate, setLastStreakUpdate] = useState<string | null>(() => {
    try {
      return localStorage.getItem('moodGardenLastStreakUpdate');
    } catch (error) {
      console.error('Error reading last streak update from localStorage', error);
      return null;
    }
  });

  const [lastMoodSelectionDate, setLastMoodSelectionDate] = useState<string | null>(() => {
      try {
        return localStorage.getItem('moodGardenLastSelection');
      } catch (error) {
        console.error('Error reading last mood selection date from localStorage', error);
        return null;
      }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('moodGardenJournal');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading journal entries from localStorage', error);
      return [];
    }
  });

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem('moodGardenMoodHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading mood history from localStorage', error);
      return [];
    }
  });

  const [gardenLevel, setGardenLevel] = useState<number>(getGardenLevel(score));

  useEffect(() => {
    try {
      localStorage.setItem('moodGardenScore', JSON.stringify(score));
      setGardenLevel(getGardenLevel(score));
    } catch (error) {
      console.error('Error saving score to localStorage', error);
    }
  }, [score]);

  useEffect(() => {
    try {
      localStorage.setItem('moodGardenStreak', JSON.stringify(streak));
    } catch (error) {
      console.error('Error saving streak to localStorage', error);
    }
  }, [streak]);

  useEffect(() => {
    try {
        if (lastStreakUpdate) {
            localStorage.setItem('moodGardenLastStreakUpdate', lastStreakUpdate);
        }
    } catch (error) {
        console.error('Error saving last streak update date to localStorage', error);
    }
  }, [lastStreakUpdate]);

  useEffect(() => {
    try {
        if (lastMoodSelectionDate) {
            localStorage.setItem('moodGardenLastSelection', lastMoodSelectionDate);
        }
    } catch (error) {
        console.error('Error saving last mood selection date to localStorage', error);
    }
  }, [lastMoodSelectionDate]);
  
  useEffect(() => {
    try {
        localStorage.setItem('moodGardenJournal', JSON.stringify(journalEntries));
    } catch (error) {
        console.error('Error saving journal entries to localStorage', error);
    }
  }, [journalEntries]);

  useEffect(() => {
    try {
      localStorage.setItem('moodGardenMoodHistory', JSON.stringify(moodHistory));
    } catch (error) {
      console.error('Error saving mood history to localStorage', error);
    }
  }, [moodHistory]);

  const addJournalEntry = useCallback((text: string) => {
    const newEntry: JournalEntry = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        text: text,
    };
    setJournalEntries(prevEntries => [...prevEntries, newEntry]);
  }, []);

  const deleteJournalEntry = useCallback((id: string) => {
    setJournalEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  }, []);

  const completeActivity = useCallback((points: number) => {
    setScore(prevScore => prevScore + points);
  }, []);

  const selectMood = useCallback((mood: Mood): { bonusPoints: number } => {
    const today = getTodayDateString();
    setLastMoodSelectionDate(today);

    setMoodHistory(prevHistory => {
        if (prevHistory.some(entry => entry.date === today)) {
            return prevHistory;
        }
        return [...prevHistory, { date: today, mood }];
    });

    if (lastStreakUpdate === today) {
        return { bonusPoints: 0 };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    let newStreak = 1;
    if (lastStreakUpdate === yesterdayString) {
        newStreak = streak + 1;
    }

    const bonusPoints = STREAK_MILESTONES[newStreak] || 0;
    if (bonusPoints > 0) {
        setScore(prevScore => prevScore + bonusPoints);
    }

    setStreak(newStreak);
    setLastStreakUpdate(today);

    return { bonusPoints };
  }, [streak, lastStreakUpdate]);

  const isMoodSelectedToday = lastMoodSelectionDate === getTodayDateString();

  return { score, gardenLevel, streak, completeActivity, selectMood, isMoodSelectedToday, journalEntries, addJournalEntry, deleteJournalEntry, moodHistory };
};
