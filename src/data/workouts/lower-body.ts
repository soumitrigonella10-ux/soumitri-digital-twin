import type { WorkoutPlan } from "@/types";

// ========================================
// LOWER BODY WORKOUTS — Monday & Thursday
// ========================================
export const lowerBodyWorkouts: WorkoutPlan[] = [
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
            benefit: "Increases blood flow to muscles, raises heart rate, and prepares joints for heavier movements",
          },
          {
            name: "Band glute activation",
            reps: "See below",
            benefit: "Wakes up gluteal muscles, improves mind-muscle connection, and prevents hip dominance during lifts",
          },
          {
            name: "Side steps",
            sets: "2×12 each side",
            benefit: "Activates gluteus medius, improves hip stability, and helps reduce hip dips over time",
          },
          {
            name: "Glute bridges",
            sets: "2×15",
            benefit: "Engages glutes and hamstrings, strengthens lower back, and improves hip extension",
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
            benefit: "Best exercise for glute growth, lifts and shapes the butt, strengthens hip extensors",
          },
          {
            name: "Romanian Deadlift (RDL)",
            sets: "4×8–12",
            isEssential: true,
            benefit: "Builds hamstrings and glutes, improves posture, strengthens lower back",
          },
          {
            name: "Bulgarian Split Squat (glute focus)",
            sets: "3×8–10 each leg",
            isEssential: true,
            benefit: "Targets each glute individually, improves balance, sculpts legs and butt",
          },
          {
            name: "Seated / Lying Hamstring Curl",
            sets: "3×10–15",
            notes: "NEW: better leg shape + balance",
            isEssential: true,
            isNew: true,
            benefit: "Isolates hamstrings, creates defined leg shape, prevents muscle imbalances",
          },
          {
            name: "Hip Abduction Machine",
            sets: "3×15–20",
            isEssential: true,
            benefit: "Builds outer glutes and hip muscles, fills in hip dips, creates rounder hip shape",
          },
        ],
      },
      {
        title: "Optional Finisher",
        exercises: [
          {
            name: "Cable Kickbacks",
            sets: "2×12–15 each leg",
            benefit: "Isolates glutes for maximum contraction, adds definition and lift to the butt",
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
            benefit: "Warms up hip joints, increases leg flexibility, prepares muscles for heavy lifting",
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
            benefit: "Builds overall leg strength, tones quads and glutes, shapes thighs",
          },
          {
            name: "Goblet Squat OR Barbell Squat",
            sets: "3×8–12",
            isEssential: true,
            benefit: "Full leg development, strengthens core, builds firm glutes and thighs",
          },
          {
            name: "Walking Lunges",
            sets: "3×10 each leg",
            isEssential: true,
            benefit: "Tones legs and glutes, improves balance, creates lean muscle definition",
          },
          {
            name: "Inner Thigh Machine (Adductor)",
            sets: "3×12–15",
            isEssential: true,
            benefit: "Targets inner thighs, reduces jiggle, creates toned inner leg line",
          },
          {
            name: "Glute Bridge or Light Hip Thrust",
            sets: "3×12–15",
            isEssential: true,
            benefit: "Maintains glute activation, lifts and shapes butt, supports hip strength",
          },
          {
            name: "Cable Abductions OR Band Side Steps",
            sets: "3×15–20",
            isEssential: true,
            benefit: "Builds outer hip muscles, reduces hip dips, creates smooth hip contour",
          },
        ],
      },
    ],
  },
];
