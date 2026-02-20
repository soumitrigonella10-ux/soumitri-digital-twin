import type { Routine } from "@/types";

// ========================================
// WORKOUT ROUTINES
// ========================================
export const workoutRoutines: Routine[] = [
  {
    id: "r-workout",
    type: "workout",
    name: "Workout Plan",
    schedule: { weekday: [1, 3, 5] },
    timeOfDay: "ANY",
    tags: { office: true, wfh: true, travel: false, goingOut: true },
    steps: [
      {
        order: 1,
        title: "Warm-up",
        description: "Dynamic stretches, light cardio",
        durationMin: 10,
        essential: true,
      },
      {
        order: 2,
        title: "Strength Training",
        description: "Focus on compound movements",
        durationMin: 35,
        essential: true,
      },
      {
        order: 3,
        title: "Core Work",
        description: "10 min core circuit",
        durationMin: 10,
      },
      {
        order: 4,
        title: "Cooldown & Stretch",
        description: "Static stretches, foam roll",
        durationMin: 10,
        essential: true,
      },
    ],
  },
];
