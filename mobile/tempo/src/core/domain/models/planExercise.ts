//data model containing all of the entities required to add the exercise to a workout plan, and use for actual workouts.

import type { WorkoutPlan } from "./workoutPlan";
import type { Exercise } from "./exercise";

export type PlanExercise = {
    id: number;
    workoutPlanId: WorkoutPlan["id"];
    exerciseId: Exercise["id"];
    orderIndex: number;
    targetSets?: number;
    targetReps?: number;
    targetWeight?: number;
    targetRestSeconds?: number;
    notes?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};