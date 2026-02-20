import type { WorkoutPlan } from "@/types";

// ========================================
// UPPER BODY & ARMS WORKOUTS — Tuesday & Friday
// ========================================
export const upperBodyWorkouts: WorkoutPlan[] = [
  {
    id: "w-upper-body",
    name: "Upper Body (Posture + Slim Arms + Armpit Area)",
    weekday: [2], // Tuesday
    durationMin: 60,
    goal: "Remove shoulder rounding, tight armpit-side, slender arms, strong back",
    sections: [
      {
        title: "Warm-up",
        description: "5 min",
        exercises: [
          {
            name: "Band pull-aparts",
            sets: "2×15",
            benefit: "Strengthens rear shoulders and upper back, improves posture by pulling shoulders back",
          },
          {
            name: "Scapular retractions",
            sets: "2×12",
            benefit: "Activates back muscles, improves shoulder blade control, reduces rounded shoulders",
          },
        ],
      },
      {
        title: "Main Workout",
        exercises: [
          {
            name: "Lat Pulldown (wide or neutral grip)",
            sets: "4×8–12",
            isEssential: true,
            benefit: "Builds wider back, creates V-taper, improves posture and defines upper body",
          },
          {
            name: "Seated Row / Dumbbell Row",
            sets: "3×10–12",
            isEssential: true,
            benefit: "Thickens back muscles, improves posture, helps reduce armpit fat area",
          },
          {
            name: "Face Pulls",
            sets: "3×12–15",
            notes: "Posture magic",
            isEssential: true,
            benefit: "Strengthens rear delts and rotator cuff, corrects forward head posture, opens up chest",
          },
          {
            name: "Incline Dumbbell Press",
            sets: "3×8–12",
            isEssential: true,
            benefit: "Builds upper chest, creates lifted chest appearance, tones front shoulders",
          },
          {
            name: "Dumbbell Shoulder Press",
            sets: "3×8–12",
            benefit: "Builds shoulder caps, creates defined shoulder line, improves overhead strength",
          },
          {
            name: "Lateral Raises",
            sets: "2–3×12–20",
            notes: "NEW: gives tight arm/shoulder line",
            isEssential: true,
            isNew: true,
            benefit: "Widens shoulders, creates sleeker arm-to-shoulder transition, defines upper arms",
          },
          {
            name: "Tricep Rope Pushdown",
            sets: "3×12–15",
            isEssential: true,
            benefit: "Tones back of arms, eliminates arm jiggle, creates defined triceps",
          },
          {
            name: "Hammer Curls",
            sets: "2×12–15",
            benefit: "Builds forearms and biceps, creates toned arm appearance without bulk",
          },
        ],
      },
    ],
  },
  {
    id: "w-arms-waist-glutes",
    name: "Arms + Waist + Glute Shape (No Bulk)",
    weekday: [5], // Friday
    durationMin: 45,
    goal: "Slender arms, tight waist, glute roundness, toned look",
    sections: [
      {
        title: "Flow",
        description: "30–45 min (do 3 rounds)",
        exercises: [
          {
            name: "Incline/Normal Push-ups",
            reps: "8–12",
            benefit: "Builds chest and triceps, tones arms, improves upper body strength",
          },
          {
            name: "Triceps Overhead Extension (DB/water bottle)",
            reps: "12–15",
            notes: "Safer swap for dips",
            isEssential: true,
            benefit: "Isolates triceps, eliminates arm jiggle, creates toned back of arms",
          },
          {
            name: "Bicep Curls",
            reps: "12–15",
            benefit: "Tones front of arms, creates defined arm shape, improves grip strength",
          },
          {
            name: "Lateral Raises (light)",
            reps: "12–15",
            benefit: "Sculpts shoulder caps, creates sleek arm line, improves posture",
          },
          {
            name: "Rear Delt Fly",
            reps: "12–15",
            isEssential: true,
            benefit: "Strengthens rear shoulders, improves posture, balances front-back muscle",
          },
          {
            name: "Reverse Crunch",
            reps: "12–15",
            benefit: "Targets lower abs, flattens lower belly, strengthens core",
          },
          {
            name: "Heel Taps",
            reps: "20 total",
            benefit: "Works obliques, cinches waist from sides, creates waist definition",
          },
          {
            name: "Donkey Kicks",
            reps: "15 each",
            benefit: "Isolates glutes, lifts and shapes butt, improves hip extension",
          },
          {
            name: "Fire Hydrants",
            reps: "15 each",
            benefit: "Targets outer glutes, improves hip mobility, shapes side of hips",
          },
          {
            name: "Vacuum Breathing",
            sets: "3×20–30 sec",
            isEssential: true,
            benefit: "Trains transverse abdominis, creates smaller waist, improves core control",
          },
        ],
      },
      {
        title: "Optional",
        exercises: [
          {
            name: "Stretch",
            reps: "5 min",
            benefit: "Improves flexibility, reduces muscle tension, promotes recovery",
          },
        ],
      },
    ],
  },
];
