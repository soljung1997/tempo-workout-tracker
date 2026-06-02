//Workout plan template data model
import type { User } from "./user";

export type WorkoutPlan = {
    id: number;
    userId: User["id"];
    name: string;
    description?: string;
    workoutDay?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    goal?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};