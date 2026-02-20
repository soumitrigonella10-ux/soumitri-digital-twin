import type { WorkoutPlan } from "@/types";

// ========================================
// RECOVERY DAYS — Saturday & Sunday
// ========================================
export const recoveryWorkouts: WorkoutPlan[] = [
  {
    id: "w-rest-saturday",
    name: "Active Recovery",
    weekday: [6], // Saturday
    durationMin: 30,
    goal: "Light movement, stretching, and recovery",
    sections: [
      {
        title: "Optional Activities",
        description: "Choose 1-2 activities",
        exercises: [
          {
            name: "Gentle walk or light yoga",
            reps: "20-30 min",
            benefit: "Promotes blood flow, reduces muscle soreness, aids in active recovery",
          },
          {
            name: "Stretching routine",
            reps: "10-15 min",
            benefit: "Improves flexibility, releases muscle tension, prevents stiffness",
          },
          {
            name: "Foam rolling",
            reps: "5-10 min",
            benefit: "Releases muscle knots, improves circulation, speeds up recovery",
          },
        ],
      },
    ],
  },
  {
    id: "w-rest-sunday",
    name: "Complete Rest",
    weekday: [0], // Sunday
    durationMin: 0,
    goal: "Full recovery and preparation for the week ahead",
    sections: [
      {
        title: "Rest & Recovery",
        description: "Focus on rest",
        exercises: [
          {
            name: "Complete rest",
            reps: "Take the day off from structured exercise",
            benefit: "Allows muscles to repair and grow, restores energy, prevents overtraining",
          },
          {
            name: "Meal prep (optional)",
            reps: "Prepare for the week ahead",
            benefit: "Sets up healthy eating for the week, reduces stress, supports fitness goals",
          },
        ],
      },
    ],
  },
];
