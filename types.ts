export enum Mood {
    Happy = 'Happy',
    Calm = 'Calm',
    Stressed = 'Stressed',
    Sad = 'Sad',
    Excited = 'Excited',
}

export enum ActivityType {
  Gratitude = 'GRATITUDE',
  Breathing = 'BREATHING',
  Drawing = 'DRAWING',
  WordSearch = 'WORD_SEARCH',
  ZenGarden = 'ZEN_GARDEN',
}

export interface Activity {
  type: ActivityType;
  name: string;
  description: string;
  icon: string;
  points: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
}

export interface MoodEntry {
  date: string;
  mood: Mood;
}
