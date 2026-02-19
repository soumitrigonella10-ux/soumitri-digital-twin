import type { Routine, TimeOfDay, Filters } from "@/types";

// ========================================
// Schedule & Time Matching
// ========================================

/** Get weekday from Date (0=Sun, 1=Mon, ..., 6=Sat) */
export function getWeekday(date: Date): number {
  return date.getDay();
}

/** Map routine type to section key */
export function getRoutineSectionKey(type: Routine["type"]): string {
  const mapping: Record<Routine["type"], string> = {
    skin: "Skincare",
    hair: "Haircare",
    body: "Bodycare",
    bodySpecific: "Body Specifics",
    wellness: "Wellness",
    workout: "Workout",
    food: "Food Plan",
  };
  return mapping[type];
}

/** Check if routine matches schedule for given weekday */
export function matchesSchedule(routine: Routine, weekday: number): boolean {
  const { schedule } = routine;

  if (schedule.weekday && schedule.weekday.includes(weekday)) {
    return true;
  }

  if (schedule.frequencyPerWeek && schedule.frequencyPerWeek > 0) {
    return true;
  }

  if (schedule.cycleDay && schedule.cycleDay.length > 0) {
    return true;
  }

  return false;
}

/** Check if routine matches time of day filter */
export function matchesTimeOfDay(routine: Routine, filter: TimeOfDay): boolean {
  if (filter === "ANY") return true;
  if (routine.timeOfDay === "ANY") return true;
  return routine.timeOfDay === filter;
}

/** Check if routine matches flag filters */
export function matchesFlags(
  routine: Routine,
  flags: Filters["flags"]
): boolean {
  const anyFlagSet = flags.office || flags.wfh || flags.travel || flags.goingOut;
  if (!anyFlagSet) return true;

  if (flags.office && routine.tags.office) return true;
  if (flags.wfh && routine.tags.wfh) return true;
  if (flags.travel && routine.tags.travel) return true;
  if (flags.goingOut && routine.tags.goingOut) return true;

  return false;
}
