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