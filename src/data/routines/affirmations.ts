// ========================================
// AFFIRMATIONS DATA
// ========================================
// Each day has Morning (Identity), Midday (Embodiment), Evening (Subconscious Imprint)
// Keep each block 3–5 minutes.

export type AffirmationType = "affirmation" | "action" | "visualization";
export type AffirmationTime = "morning" | "midday" | "evening";

export interface Affirmation {
  id: string;
  text: string;
  type: AffirmationType;
  timeOfDay: AffirmationTime;
  weekday: number; // 0=Sun, 1=Mon, ..., 6=Sat
}

export interface DayTheme {
  weekday: number;
  emoji: string;
  title: string;
  subtitle: string;
}

export const DAY_THEMES: DayTheme[] = [
  { weekday: 0, emoji: "🛡", title: "Sunday", subtitle: "Protection + Family" },
  { weekday: 1, emoji: "💰", title: "Monday", subtitle: "Wealth + Career Power" },
  { weekday: 2, emoji: "💪", title: "Tuesday", subtitle: "Body + Aura" },
  { weekday: 3, emoji: "🧠", title: "Wednesday", subtitle: "Academic Sharpness" },
  { weekday: 4, emoji: "🌟", title: "Thursday", subtitle: "Multifaceted Expansion" },
  { weekday: 5, emoji: "💼", title: "Friday", subtitle: "Aura + Presence" },
  { weekday: 6, emoji: "💪", title: "Saturday", subtitle: "Beauty + Vitality" },
];

export const affirmations: Affirmation[] = [
  // ========================================
  // MONDAY (1) — Wealth + Career Power
  // ========================================
  // Morning
  {
    id: "aff-mon-m1",
    text: "I create disproportionate value.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 1,
  },
  {
    id: "aff-mon-m2",
    text: "Money flows toward competence.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 1,
  },
  {
    id: "aff-mon-m3",
    text: "My career trajectory is upward and inevitable.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 1,
  },
  {
    id: "aff-mon-m4",
    text: "I operate strategically, not emotionally.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 1,
  },
  // Midday
  {
    id: "aff-mon-d1",
    text: "Stand straight before meetings.",
    type: "action",
    timeOfDay: "midday",
    weekday: 1,
  },
  {
    id: "aff-mon-d2",
    text: "My words carry weight.",
    type: "affirmation",
    timeOfDay: "midday",
    weekday: 1,
  },
  {
    id: "aff-mon-d3",
    text: "I think clearly and respond intelligently.",
    type: "affirmation",
    timeOfDay: "midday",
    weekday: 1,
  },
  // Evening
  {
    id: "aff-mon-e1",
    text: "Visualize your bank balance quietly growing.",
    type: "visualization",
    timeOfDay: "evening",
    weekday: 1,
  },
  {
    id: "aff-mon-e2",
    text: "Wealth feels normal in my life.",
    type: "affirmation",
    timeOfDay: "evening",
    weekday: 1,
  },
  {
    id: "aff-mon-e3",
    text: "I am building long-term security.",
    type: "affirmation",
    timeOfDay: "evening",
    weekday: 1,
  },

  // ========================================
  // TUESDAY (2) — Body + Aura
  // ========================================
  // Morning
  {
    id: "aff-tue-m1",
    text: "My body responds quickly to discipline.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 2,
  },
  {
    id: "aff-tue-m2",
    text: "My waist tightens. My glutes lift. My thighs lean.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 2,
  },
  {
    id: "aff-tue-m3",
    text: "My skin glows naturally.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 2,
  },
  {
    id: "aff-tue-m4",
    text: "My hair grows thick and strong.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 2,
  },
  // Midday
  {
    id: "aff-tue-d1",
    text: "I choose foods that sculpt me.",
    type: "action",
    timeOfDay: "midday",
    weekday: 2,
  },
  {
    id: "aff-tue-d2",
    text: "I am magnetic.",
    type: "affirmation",
    timeOfDay: "midday",
    weekday: 2,
  },
  // Evening
  {
    id: "aff-tue-e1",
    text: "Visualize gym mirror: Lean waist. Round glutes. Clear skin.",
    type: "visualization",
    timeOfDay: "evening",
    weekday: 2,
  },
  {
    id: "aff-tue-e2",
    text: "My body reshapes daily.",
    type: "affirmation",
    timeOfDay: "evening",
    weekday: 2,
  },

  // ========================================
  // WEDNESDAY (3) — Academic Sharpness
  // ========================================
  // Morning
  {
    id: "aff-wed-m1",
    text: "My focus is deep and stable.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 3,
  },
  {
    id: "aff-wed-m2",
    text: "I understand complex ideas easily.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 3,
  },
  {
    id: "aff-wed-m3",
    text: "My memory is sharp.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 3,
  },
  // Midday
  {
    id: "aff-wed-d1",
    text: "I absorb information efficiently.",
    type: "action",
    timeOfDay: "midday",
    weekday: 3,
  },
  {
    id: "aff-wed-d2",
    text: "90-minute distraction-free work.",
    type: "action",
    timeOfDay: "midday",
    weekday: 3,
  },
  // Evening
  {
    id: "aff-wed-e1",
    text: "Exams reward my preparation.",
    type: "affirmation",
    timeOfDay: "evening",
    weekday: 3,
  },
  {
    id: "aff-wed-e2",
    text: "See yourself writing structured answers calmly.",
    type: "visualization",
    timeOfDay: "evening",
    weekday: 3,
  },

  // ========================================
  // THURSDAY (4) — Multifaceted Expansion
  // ========================================
  // Morning
  {
    id: "aff-thu-m1",
    text: "I grow more diverse and powerful each year.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 4,
  },
  {
    id: "aff-thu-m2",
    text: "My life is an upward graph.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 4,
  },
  {
    id: "aff-thu-m3",
    text: "I expand without losing myself.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 4,
  },
  // Midday
  {
    id: "aff-thu-d1",
    text: "Do one creative act.",
    type: "action",
    timeOfDay: "midday",
    weekday: 4,
  },
  {
    id: "aff-thu-d2",
    text: "I build skills that compound.",
    type: "affirmation",
    timeOfDay: "midday",
    weekday: 4,
  },
  // Evening
  {
    id: "aff-thu-e1",
    text: "Visualize 2028 you. Confident. Multitalented. Stable.",
    type: "visualization",
    timeOfDay: "evening",
    weekday: 4,
  },

  // ========================================
  // FRIDAY (5) — Aura + Presence
  // ========================================
  // Morning
  {
    id: "aff-fri-m1",
    text: "My presence is felt before I speak.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 5,
  },
  {
    id: "aff-fri-m2",
    text: "I move slowly and intentionally.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 5,
  },
  {
    id: "aff-fri-m3",
    text: "People respect my energy.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 5,
  },
  // Midday
  {
    id: "aff-fri-d1",
    text: "Walk slower than usual. Make eye contact.",
    type: "action",
    timeOfDay: "midday",
    weekday: 5,
  },
  {
    id: "aff-fri-d2",
    text: "I radiate calm authority.",
    type: "affirmation",
    timeOfDay: "midday",
    weekday: 5,
  },
  // Evening
  {
    id: "aff-fri-e1",
    text: "My aura is strong, warm, magnetic.",
    type: "affirmation",
    timeOfDay: "evening",
    weekday: 5,
  },

  // ========================================
  // SATURDAY (6) — Beauty + Vitality
  // ========================================
  // Morning
  {
    id: "aff-sat-m1",
    text: "My skin is even, smooth, glowing.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 6,
  },
  {
    id: "aff-sat-m2",
    text: "My body is sculpted and feminine.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 6,
  },
  {
    id: "aff-sat-m3",
    text: "I age beautifully.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 6,
  },
  // Midday
  {
    id: "aff-sat-d1",
    text: "Skincare or hair ritual consciously.",
    type: "action",
    timeOfDay: "midday",
    weekday: 6,
  },
  {
    id: "aff-sat-d2",
    text: "I take care of what I value.",
    type: "affirmation",
    timeOfDay: "midday",
    weekday: 6,
  },
  // Evening
  {
    id: "aff-sat-e1",
    text: "My body repairs and strengthens in sleep.",
    type: "affirmation",
    timeOfDay: "evening",
    weekday: 6,
  },

  // ========================================
  // SUNDAY (0) — Protection + Family
  // ========================================
  // Morning
  {
    id: "aff-sun-m1",
    text: "My family is healthy and protected.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 0,
  },
  {
    id: "aff-sun-m2",
    text: "We live long, stable lives.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 0,
  },
  {
    id: "aff-sun-m3",
    text: "Even challenges resolve in our favor.",
    type: "affirmation",
    timeOfDay: "morning",
    weekday: 0,
  },
  // Midday
  {
    id: "aff-sun-d1",
    text: "Call or connect with someone. Feel safety.",
    type: "action",
    timeOfDay: "midday",
    weekday: 0,
  },
  // Evening
  {
    id: "aff-sun-e1",
    text: "My life moves upward in every season.",
    type: "affirmation",
    timeOfDay: "evening",
    weekday: 0,
  },
  {
    id: "aff-sun-e2",
    text: "Visualize everyone happy 10 years from now.",
    type: "visualization",
    timeOfDay: "evening",
    weekday: 0,
  },
];

// Helper: get affirmations for a specific day and time
export function getAffirmations(weekday: number, timeOfDay?: AffirmationTime): Affirmation[] {
  return affirmations.filter(
    (a) => a.weekday === weekday && (timeOfDay ? a.timeOfDay === timeOfDay : true)
  );
}

// Helper: get all affirmations grouped by time for a day
export function getAffirmationsByTime(weekday: number) {
  return {
    morning: affirmations.filter((a) => a.weekday === weekday && a.timeOfDay === "morning"),
    midday: affirmations.filter((a) => a.weekday === weekday && a.timeOfDay === "midday"),
    evening: affirmations.filter((a) => a.weekday === weekday && a.timeOfDay === "evening"),
  };
}

// Map affirmation time to dashboard TimeOfDay
export function affirmationTimeToDashboardTime(time: AffirmationTime): "AM" | "MIDDAY" | "PM" {
  switch (time) {
    case "morning":
      return "AM";
    case "midday":
      return "MIDDAY";
    case "evening":
      return "PM";
  }
}

// Map dashboard TimeOfDay to affirmation time
export function dashboardTimeToAffirmationTime(time: string): AffirmationTime | null {
  switch (time) {
    case "AM":
      return "morning";
    case "MIDDAY":
      return "midday";
    case "PM":
      return "evening";
    default:
      return null;
  }
}
