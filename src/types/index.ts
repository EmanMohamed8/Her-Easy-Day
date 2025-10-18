export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface Mood {
  id: string;
  date: string;
  moods: ('happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'calm')[];
  notes?: string;
}

export interface PeriodEntry {
  id: string;
  date: string;
  type: 'period' | 'ovulation' | 'pms';
  flow?: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  notes?: string;
}

export interface PregnancyEntry {
  id: string;
  date: string;
  week: number;
  symptoms?: string[];
  notes?: string;
  weight?: number;
}

export interface SleepEntry {
  id: string;
  date: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
  hoursSlept?: number;
  bedTime?: string;
  wakeTime?: string;
  notes?: string;
}

export interface PhysicalHealthEntry {
  id: string;
  date: string;
  energyLevel: 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
  exerciseType?: string;
  exerciseDuration?: number;
  waterIntake?: number;
  symptoms?: string[];
  notes?: string;
}

export interface ObstacleEntry {
  id: string;
  date: string;
  type: 'visitor' | 'emergency' | 'unexpected-event' | 'work-interruption' | 'health-issue' | 'other';
  description: string;
  impact: 'low' | 'medium' | 'high';
  timeAffected?: number;
  notes?: string;
}

export interface TimeEntry {
  id: string;
  date: string;
  availableHours: number;
  plannedHours: number;
  actualProductiveHours?: number;
  timeBlocks?: {
    start: string;
    end: string;
    activity: string;
    completed: boolean;
  }[];
  notes?: string;
}

export interface DayData {
  date: string;
  tasks: Task[];
  mood?: Mood;
  periodEntry?: PeriodEntry;
  pregnancyEntry?: PregnancyEntry;
  sleepEntry?: SleepEntry;
  physicalHealthEntry?: PhysicalHealthEntry;
  obstacles?: ObstacleEntry[];
  timeEntry?: TimeEntry;
}