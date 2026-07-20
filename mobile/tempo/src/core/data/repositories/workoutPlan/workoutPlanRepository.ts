

import type { User } from "../../../domain/models/user";
import type { WorkoutPlan } from "../../../domain/models/workoutPlan";
import type { WorkoutType } from "../../../domain/models/workoutType";

//Create a workout plan input contract
export type CreateWorkoutPlanInput = {
    userId: User["id"];
    workoutTypeId?: WorkoutType["id"];
    name: string;
    description?: string;
    workoutDay?: WorkoutPlan["workoutDay"];
    goal?: string;
};

export type UpdateWorkoutPlanInput = {
    id: WorkoutPlan["id"];
    workoutTypeId?: WorkoutType["id"];
    name?: string;
    description?: string;
    workoutDay?: WorkoutPlan["workoutDay"];
    goal?: string;
};

export type WorkoutPlanRepository = {
    create(input: CreateWorkoutPlanInput): Promise<WorkoutPlan>;
    update(input: UpdateWorkoutPlanInput): Promise<WorkoutPlan>;
    softDelete(id: WorkoutPlan["id"]): Promise<void>;
    findById(id: WorkoutPlan["id"]): Promise<WorkoutPlan | null>;
    listActiveByUserId(userId: User["id"]): Promise<WorkoutPlan[]>;
};
