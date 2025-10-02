import { Activity, ActivityType, Mood } from './types';

export const MOODS: { type: Mood, icon: string }[] = [
    { type: Mood.Happy, icon: '😊' },
    { type: Mood.Calm, icon: '😌' },
    { type: Mood.Stressed, icon: '😫' },
    { type: Mood.Sad, icon: '😢' },
    { type: Mood.Excited, icon: '🤩' },
];

export const POSITIVE_WORDS: string[] = [
    'CALM', 'JOY', 'LOVE', 'HOPE', 'PEACE', 'GROW',
    'SHINE', 'SMILE', 'HAPPY', 'KIND', 'BRAVE', 'DREAM'
];

export const ACTIVITIES: Activity[] = [
  {
    type: ActivityType.Gratitude,
    name: 'Journal',
    description: 'Write down three things you are grateful for today.',
    icon: '✍️',
    points: 15,
  },
  {
    type: ActivityType.Breathing,
    name: 'Breathe',
    description: 'Follow the guide to breathe deeply for one minute.',
    icon: '🧘',
    points: 10,
  },
   {
    type: ActivityType.Drawing,
    name: 'Doodle',
    description: 'Draw anything that makes you happy for a few moments.',
    icon: '🎨',
    points: 20,
  },
  {
    type: ActivityType.WordSearch,
    name: 'Word Find',
    description: 'Find the hidden positive words.',
    icon: '🔍',
    points: 20,
  },
  {
    type: ActivityType.ZenGarden,
    name: 'Zen Garden',
    description: 'Relax and create patterns in the sand.',
    icon: '🎋',
    points: 15,
  },
];

export const AFFIRMATIONS: string[] = [
    "You are capable of amazing things.",
    "Today is a new day, full of possibilities.",
    "Believe in yourself and all that you are.",
    "Your positive attitude is your greatest strength.",
    "Every small step you take is progress.",
    "You are resilient, strong, and brave.",
    "Embrace the journey and trust the process.",
    "Your potential is limitless.",
];

export const JOURNAL_PROMPTS: string[] = [
    "What is one small thing that brought you joy today?",
    "Describe a person you're grateful for and why.",
    "What is a recent accomplishment, big or small, that you're proud of?",
    "Think about a beautiful place you've been. What did you love about it?",
    "What is a simple pleasure you have enjoyed recently?",
    "Describe a challenge you overcame and what you learned from it.",
];

export const getRandomAffirmation = (): string => {
    return AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
};

export const getRandomJournalPrompt = (): string => {
    return JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
};
