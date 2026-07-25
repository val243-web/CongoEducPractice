export type SkillLevel = 'debutant' | 'intermediaire' | 'avance';

export interface IntakeQuestion {
  id: string;
  questionText: string;
  options: string[];
  selectedOption?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: 'Indispensable' | 'Recommandé' | 'Optionnel';
  estimatedCost: string;
  description: string;
  isAcquired?: boolean;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  type?: 'mcq' | 'code' | 'practical';
  initialCode?: string;
  expectedCodeKeywords?: string[];
  codeInstructions?: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  outputDeliverable: string;
  isCompleted?: boolean;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  durationWeeks: number;
  objective: string;
  steps: RoadmapStep[];
  quiz: QuizQuestion[];
  isUnlocked?: boolean;
  isCompleted?: boolean;
}

export interface ScheduleDay {
  id: string;
  dayName: string; // e.g. "Lundi", "Jour 1"
  timeSlot: string; // e.g. "45 min" or "19h00 - 20h00"
  topic: string;
  activityDescription: string;
  youtubeQuery: string;
  keyChannelIdeas: string[];
  isDone?: boolean;
}

export interface ScheduleWeek {
  weekNumber: number;
  theme: string;
  days: ScheduleDay[];
}

export interface YouTubeResource {
  id: string;
  topicTitle: string;
  searchQuery: string;
  recommendedDuration: string;
  targetContentDescription: string;
  suggestedKeywords: string[];
}

export interface LearningPlan {
  id: string;
  skillName: string;
  summary: string;
  skillLevel: SkillLevel;
  totalEstimatedWeeks: number;
  totalHoursPerWeek: number;
  createdAt: string;
  imageUrl?: string;
  category?: string;
  materials: MaterialItem[];
  phases: RoadmapPhase[];
  weeklySchedule: ScheduleWeek[];
  youtubeResources: YouTubeResource[];
  userAvailabilityNote?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  imageUrl?: string;
}

