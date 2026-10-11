// A workout session while it's in motion

import type { User } from "./user";
import type { WorkoutPlan } from "./workoutPlan";
import type { PlannedWorkout } from "./plannedWorkout";

export type WorkoutSession = {
    id: number;
    userId: User["id"];
    workoutPlanId?: WorkoutPlan["id"];
    plannedWorkoutId?: PlannedWorkout["id"];
    sessionName: string;
    sessionDate: string;
    startTime: string;
    endTime?: string;
    durationSeconds?: number;
    energyRating?: number;
    difficultyRating?: number;
    notes?: string;
    status: "in_progress" | "completed" | "discarded";
    createdAt: string;
    updatedAt: string;
};