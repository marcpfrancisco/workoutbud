// Day offsets from today that had workouts (negative = past)
export const MOCK_WORKOUT_DAYS = [-1, -3, -4, -7, -8, -10, -11, -14, -15, -17, -21];

export const MOCK_STREAK = 12;

export interface DailyChallenge {
  id: string;
  icon: string;
  title: string;
  description: string;
  points: number;
  type: "streak" | "exercise" | "volume";
  completed?: boolean;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: "ch1",
    icon: "🔥",
    title: "Keep the streak alive",
    description: "Log a workout today to maintain your 12-day streak",
    points: 50,
    type: "streak",
  },
  {
    id: "ch2",
    icon: "💪",
    title: "20 Push-ups",
    description: "Complete 20 push-ups in a single session",
    points: 25,
    type: "exercise",
    completed: true,
  },
  {
    id: "ch3",
    icon: "🏋️",
    title: "5 working sets",
    description: "Log at least 5 sets in today's workout",
    points: 30,
    type: "volume",
  },
];

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  date?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "a1",
    icon: "🏆",
    title: "First Blood",
    description: "Log your first workout",
    unlocked: true,
    date: "Apr 2",
  },
  {
    id: "a2",
    icon: "🔥",
    title: "Week Warrior",
    description: "7-day training streak",
    unlocked: true,
    date: "Apr 18",
  },
  {
    id: "a3",
    icon: "⚡",
    title: "Iron Will",
    description: "Complete 50 workouts",
    unlocked: false,
  },
  {
    id: "a4",
    icon: "📈",
    title: "PB Hunter",
    description: "Set 10 personal bests",
    unlocked: false,
  },
  {
    id: "a5",
    icon: "💎",
    title: "Consistency",
    description: "30-day streak",
    unlocked: false,
  },
  {
    id: "a6",
    icon: "🎯",
    title: "Challenger",
    description: "Complete 30 daily challenges",
    unlocked: false,
  },
];

export interface MockLastSession {
  routineName: string;
  date: string;
  durationMinutes: number;
  sets: number;
  exercises: number;
}

export const MOCK_LAST_SESSION: MockLastSession = {
  routineName: "Push Day",
  date: "Mon, Apr 28",
  durationMinutes: 45,
  sets: 18,
  exercises: 5,
};
