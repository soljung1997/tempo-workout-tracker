import type { User } from "../../../domain/models/user";
import type { WorkoutType } from "../../../domain/models/workoutType";
export type CreateWorkoutTypeInput = {
    userId?: User["id"];
    name: string;
    normalizedName: string;
};

export type UpdateWorkoutTypeInput = {
    id: WorkoutType["id"];
    name?: string;
    normalizedName?: string;
};

export type WorkoutTypeRepository = {
    createOrReactivate(input: CreateWorkoutTypeInput): Promise<WorkoutType>;
    update(input: UpdateWorkoutTypeInput): Promise<WorkoutType>;
    findById(id: WorkoutType["id"]): Promise<WorkoutType | null>;
    listActiveForUser(userId: User["id"]): Promise<WorkoutType[]>;
    softDelete(id: WorkoutType["id"]): Promise<void>;
};