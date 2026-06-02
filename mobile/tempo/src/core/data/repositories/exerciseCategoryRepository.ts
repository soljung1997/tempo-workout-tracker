//create
import type { ExerciseCategory } from "../../domain/models/exerciseCategory";
import type { User } from "../../domain/models/user";

export type CreateExerciseCategoryInput = {
    userId: User["id"];
    name: string;
    normalizedName: string;
};
//update

export type UpdateExerciseCategoryInput = {
    id: ExerciseCategory["id"];
    name?: string;
    normalizedName?: string;
};


export type ExerciseCategoryRepository = {
    createOrReactivate(input: CreateExerciseCategoryInput): Promise<ExerciseCategory>;
    update(input: UpdateExerciseCategoryInput): Promise<ExerciseCategory>;
    softDelete(id: ExerciseCategory["id"]): Promise<void>;
    findById(id: ExerciseCategory["id"]): Promise<ExerciseCategory | null>;
    listActiveForUser(id: User["id"]): Promise<ExerciseCategory[]>;
};