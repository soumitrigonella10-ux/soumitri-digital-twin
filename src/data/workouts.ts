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
            benefit: "Strengthens deep core, protects lower back, flattens lower belly",
          },
          {
            name: "Glute Bridge (slow + squeeze)",
            reps: "15 reps",
            benefit: "Activates glutes, strengthens hip extensors, improves pelvic alignment",
          },
          {
            name: "Side-Lying Leg Raises",
            reps: "15 each side",
            benefit: "Tones outer thighs and hips, reduces hip dips, creates long leg line",
          },
          {
            name: "Clamshells",
            reps: "15 each side",
            benefit: "Strengthens hip rotators, improves hip stability, shapes outer glutes",
          },
          {
            name: "Plank",
            reps: "30–45 sec",
            benefit: "Builds total core strength, tightens waist, improves posture and stability",
          },
          {
            name: "Side Plank",
            reps: "20–30 sec each side",
            benefit: "Cinches waist, strengthens obliques, creates defined waistline",
          },
          {
            name: "Bird Dog",
            reps: "10 each side",
            benefit: "Improves balance and coordination, strengthens back and core, enhances posture",
          },
          {
            name: "Wall Angels",
            reps: "10 slow reps",
            benefit: "Opens chest, corrects rounded shoulders, improves upper back mobility",
          },
        ],
      },
      {
        title: "Optional",
        exercises: [
          {
            name: "Walk",
            reps: "10–20 min",
            benefit: "Low-impact cardio, aids digestion, promotes relaxation and recovery",
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
