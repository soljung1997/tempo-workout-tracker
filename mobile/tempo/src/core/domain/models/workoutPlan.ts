//Workout plan template data model
import type { User } from "./user";

export type WorkoutPlan = {
    id: number;
    userId: User["id"];
    name: string;
    description?: string;
    workoutDay?: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    goal?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};