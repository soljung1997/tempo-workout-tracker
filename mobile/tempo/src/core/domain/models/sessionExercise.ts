import type { WorkoutSession } from "./workoutSession";
import type { Exercise } from "./exercise";

export type SessionExercise = {
    id: number;
    workoutSessionId: WorkoutSession["id"];
    exerciseId?: Exercise["id"];
    exerciseNameSnapshot: string;
    categoryNameSnapshot?: string;
    muscleGroupNameSnapshot?: string;
    orderIndex: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
};