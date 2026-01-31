import { WorkoutPlan } from "@/types";

// ========================================
// WORKOUT PLANS
// ========================================
export const workouts: WorkoutPlan[] = [
  {
    id: "w-strength-mwf",
    name: "Strength Training (MWF)",
    weekday: [1, 3, 5],
    durationMin: 65,
  },
  {
    id: "w-yoga-sunday",
    name: "Yoga & Stretch (Sunday)",
    weekday: [0],
    durationMin: 45,
  },
];
