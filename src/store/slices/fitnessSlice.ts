import type { StateCreator } from "zustand";
import { workouts as seedWorkouts } from "@/data/index";
import { WorkoutPlan } from "@/types";
import { mergeById } from "./productSlice";

export interface FitnessSlice {
  data: {
    workoutPlans: WorkoutPlan[];
  };
  upsertWorkout: (w: WorkoutPlan) => void;
  refreshWorkoutData: () => void;
}

export const createFitnessSlice: StateCreator<FitnessSlice & Record<string, unknown>, [], [], FitnessSlice> = (set) => ({
  data: {
    workoutPlans: seedWorkouts,
  },
  upsertWorkout: (w) =>
    set((state) => ({
      data: { ...state.data, workoutPlans: mergeById(state.data.workoutPlans, [w]) },
    })),
  refreshWorkoutData: () =>
    set((state) => ({
      data: { ...state.data, workoutPlans: seedWorkouts },
    })),
});
