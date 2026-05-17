// A workout session while it's in motion

import type { User } from "./user";
import type { WorkoutPlan } from "./workoutPlan";

export type WorkoutSession = {
    id: number;
    userId: User["id"];
    workoutPlanId?: WorkoutPlan["id"];
    sessionName: string;
    sessionDate: string;
    startTime: string;
    endTime?: string;
    durationSeconds?: number;
    energyRating?: number;
    difficultyRating?: number;
    notes?: string;
    status: "inProgress" | "completed" | "discarded";
    createdAt: string;
    updatedAt: string;
};