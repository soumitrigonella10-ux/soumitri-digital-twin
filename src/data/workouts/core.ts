import type { WorkoutPlan } from "@/types";

// ========================================
// CORE & FLEXIBILITY — Wednesday (Pilates)
// ========================================
export const coreWorkouts: WorkoutPlan[] = [
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
];
