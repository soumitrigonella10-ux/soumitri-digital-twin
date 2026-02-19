// ========================================
// Fitness Domain Types
// ========================================

// ========================================
// Workout Exercise
// ========================================
export interface Exercise {
  name: string;
  sets?: string;
  reps?: string;
  notes?: string;
  benefit?: string;
  isNew?: boolean;
  isEssential?: boolean;
}

// ========================================
// Workout Section (warm-up, main, finisher, etc.)
// ========================================
export interface WorkoutSection {
  title: string;
  description?: string;
  exercises: Exercise[];
}

// ========================================
// Workout Plan
// ========================================
export interface WorkoutPlan {
  id: string;
  name: string;
  weekday: number[];
  durationMin: number;
  goal?: string;
  sections: WorkoutSection[];
}
