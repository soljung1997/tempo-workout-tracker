import type { MuscleGroup } from "../../domain/models/muscleGroup";
import type { User } from "../../domain/models/user";

export type CreateMuscleGroupInput = {
    userId?: User["id"];
    name: string;
};

export type UpdateMuscleGroupInput = {
    id: MuscleGroup["id"];
    name?: string;
};

export type MuscleGroupRepository = {
    createOrReactivate(input: CreateMuscleGroupInput): Promise<MuscleGroup>;
    update(input: UpdateMuscleGroupInput): Promise<MuscleGroup>;
    softDelete(id: MuscleGroup["id"]): Promise<void>;
    findById(id: MuscleGroup["id"]): Promise<MuscleGroup | null>;
    listActiveForUser(userId: User["id"]): Promise<MuscleGroup[]>;
};
