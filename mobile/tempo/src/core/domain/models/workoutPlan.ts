//Workout plan template data model
import type { User } from "./user";
import type { WorkoutType } from "./workoutType";

export type WorkoutPlan = {
    id: number;
    userId: User["id"];
    workoutTypeId?: WorkoutType["id"];
    name: string;
    description?: string;
    workoutDay?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    goal?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};