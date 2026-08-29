import type { PlannedWorkout } from "../../../domain/models/plannedWorkout";
import type { User } from "../../../domain/models/user";
import type { WorkoutPlan } from "../../../domain/models/workoutPlan";

export type CreatePlannedWorkoutInput = {
    userId: User["id"];
    workoutPlanId: WorkoutPlan["id"];
    plannedDate: string;
    status: PlannedWorkout["status"];
    notes?: string;
};

export type UpdatePlannedWorkoutInput = {
    id: PlannedWorkout["id"];
    workoutPlanId?: WorkoutPlan["id"];
    plannedDate: string;
    status: PlannedWorkout["status"];
    notes?: string;
};

export type ListActiveByDateInput = {
    userId: User["id"];
    plannedDate: string;
};

export type ListActiveByDateRangeInput = {
    userId: User["id"];
    startDate: string;
    endDate: string;
};

export type PlannedWorkoutRepository = {
    create(input: CreatePlannedWorkoutInput): Promise<PlannedWorkout>;
    update(input: UpdatePlannedWorkoutInput): Promise<PlannedWorkout>;
    softDelete(id: PlannedWorkout["id"]): Promise<void>;
    hardDelete(id: PlannedWorkout["id"]): Promise<void>;
    findById(id: PlannedWorkout["id"]): Promise<PlannedWorkout | null>;
    listActiveByUserId(id: User["id"]): Promise<PlannedWorkout[]>;
    listActiveByDate(input: ListActiveByDateInput): Promise<PlannedWorkout[]>;
    listActiveByDateRange(input: ListActiveByDateRangeInput): Promise<PlannedWorkout[]>;
};