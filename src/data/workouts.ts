import { WorkoutPlan } from "@/types";

// ========================================
// WORKOUT PLANS
// ========================================
export const workouts: WorkoutPlan[] = [
  {
    id: "w-glutes-hams-hip",
    name: "Glutes + Hamstrings + Hip Shape",
    weekday: [1], // Monday
    durationMin: 60,
    goal: "Lifted glutes, rounder hips, smoother hip dips, toned thighs",
    sections: [
      {
        title: "Warm-up",
        description: "6–8 min",
        exercises: [
          {
            name: "Incline walk OR cycling",
            reps: "5 min",
          },
          {
            name: "Band glute activation",
            reps: "See below",
          },
          {
            name: "Side steps",
            sets: "2×12 each side",
          },
          {
            name: "Glute bridges",
            sets: "2×15",
          },
        ],
      },
      {
        title: "Main Workout",
        exercises: [
          {
            name: "Hip Thrust (barbell or machine)",
            sets: "4×8–12",
            isEssential: true,
          },
          {
            name: "Romanian Deadlift (RDL)",
            sets: "4×8–12",
            isEssential: true,
          },
          {
            name: "Bulgarian Split Squat (glute focus)",
            sets: "3×8–10 each leg",
            isEssential: true,
          },
          {
            name: "Seated / Lying Hamstring Curl",
            sets: "3×10–15",
            notes: "NEW: better leg shape + balance",
            isEssential: true,
            isNew: true,
          },
          {
            name: "Hip Abduction Machine",
            sets: "3×15–20",
            isEssential: true,
          },
        ],
      },
      {
        title: "Optional Finisher",
        exercises: [
          {
            name: "Cable Kickbacks",
            sets: "2×12–15 each leg",
          },
        ],
      },
    ],
  },
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
          },
          {
            name: "Scapular retractions",
            sets: "2×12",
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
          },
          {
            name: "Seated Row / Dumbbell Row",
            sets: "3×10–12",
            isEssential: true,
          },
          {
            name: "Face Pulls",
            sets: "3×12–15",
            notes: "Posture magic",
            isEssential: true,
          },
          {
            name: "Incline Dumbbell Press",
            sets: "3×8–12",
            isEssential: true,
          },
          {
            name: "Dumbbell Shoulder Press",
            sets: "3×8–12",
          },
          {
            name: "Lateral Raises",
            sets: "2–3×12–20",
            notes: "NEW: gives tight arm/shoulder line",
            isEssential: true,
            isNew: true,
          },
          {
            name: "Tricep Rope Pushdown",
            sets: "3×12–15",
            isEssential: true,
          },
          {
            name: "Hammer Curls",
            sets: "2×12–15",
          },
        ],
      },
    ],
  },
  {
    id: "w-pilates-waist-posture",
    name: "Snatched Waist + Posture + Long Lines",
    weekday: [3], // Wednesday
    durationMin: 45,
    goal: "Tighter waist, flatter lower belly, long toned look, back posture",
    sections: [
      {
        title: "Pilates Flow",
        description: "30–40 min (do 2–3 rounds)",
        exercises: [
          {
            name: "Dead Bug",
            reps: "10 each side",
          },
          {
            name: "Glute Bridge (slow + squeeze)",
            reps: "15 reps",
          },
          {
            name: "Side-Lying Leg Raises",
            reps: "15 each side",
          },
          {
            name: "Clamshells",
            reps: "15 each side",
          },
          {
            name: "Plank",
            reps: "30–45 sec",
          },
          {
            name: "Side Plank",
            reps: "20–30 sec each side",
          },
          {
            name: "Bird Dog",
            reps: "10 each side",
          },
          {
            name: "Wall Angels",
            reps: "10 slow reps",
          },
        ],
      },
      {
        title: "Optional",
        exercises: [
          {
            name: "Walk",
            reps: "10–20 min",
          },
        ],
      },
    ],
  },
  {
    id: "w-thigh-tightening",
    name: "Thigh Tightening + Glutes (Lower Body Sculpt)",
    weekday: [4], // Thursday
    durationMin: 60,
    goal: "Firm legs, reduce inner thigh jiggle, keep curves, smooth look",
    sections: [
      {
        title: "Warm-up",
        description: "5–6 min",
        exercises: [
          {
            name: "Treadmill walk + leg swings",
          },
        ],
      },
      {
        title: "Main Workout",
        exercises: [
          {
            name: "Leg Press",
            sets: "4×10–12",
            isEssential: true,
          },
          {
            name: "Goblet Squat OR Barbell Squat",
            sets: "3×8–12",
            isEssential: true,
          },
          {
            name: "Walking Lunges",
            sets: "3×10 each leg",
            isEssential: true,
          },
          {
            name: "Inner Thigh Machine (Adductor)",
            sets: "3×12–15",
            isEssential: true,
          },
          {
            name: "Glute Bridge or Light Hip Thrust",
            sets: "3×12–15",
            isEssential: true,
          },
          {
            name: "Cable Abductions OR Band Side Steps",
            sets: "3×15–20",
            isEssential: true,
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
          },
          {
            name: "Triceps Overhead Extension (DB/water bottle)",
            reps: "12–15",
            notes: "Safer swap for dips",
            isEssential: true,
          },
          {
            name: "Bicep Curls",
            reps: "12–15",
          },
          {
            name: "Lateral Raises (light)",
            reps: "12–15",
          },
          {
            name: "Rear Delt Fly",
            reps: "12–15",
            isEssential: true,
          },
          {
            name: "Reverse Crunch",
            reps: "12–15",
          },
          {
            name: "Heel Taps",
            reps: "20 total",
          },
          {
            name: "Donkey Kicks",
            reps: "15 each",
          },
          {
            name: "Fire Hydrants",
            reps: "15 each",
          },
          {
            name: "Vacuum Breathing",
            sets: "3×20–30 sec",
            isEssential: true,
          },
        ],
      },
      {
        title: "Optional",
        exercises: [
          {
            name: "Stretch",
            reps: "5 min",
          },
        ],
      },
    ],
  },
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
          },
          {
            name: "Stretching routine",
            reps: "10-15 min",
          },
          {
            name: "Foam rolling",
            reps: "5-10 min",
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
          },
          {
            name: "Meal prep (optional)",
            reps: "Prepare for the week ahead",
          },
        ],
      },
    ],
  },
];
