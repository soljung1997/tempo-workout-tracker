
import { User } from './user';
import { WorkoutPlan } from './workoutPlan';

export type PlannedWorkout = {
    id: number;
    userId: User["id"];
    workoutPlanId: WorkoutPlan["id"];
    plannedDate: string;
    status: "planned" | "in_progress" | "completed" | "missed" | "cancelled";
    notes?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};