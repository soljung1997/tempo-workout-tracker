//create
import type { ExerciseCategory } from "../../domain/models/exerciseCategory";
import type { User } from "../../domain/models/user";

export type CreateExerciseCategoryInput = {
    name: string;
};
//update

export type UpdateExerciseCategoryInput = {
    exerciseCategoryId: ExerciseCategory["id"];
    name?: string;
};


export type ExerciseCategoryRepository = {
    createOrReactivate(input: CreateExerciseCategoryInput): Promise<ExerciseCategory>;
    update(input: UpdateExerciseCategoryInput): Promise<ExerciseCategory>;
    softDelete(id: ExerciseCategory["id"]): Promise<void>;
    findById(id: ExerciseCategory["id"]): Promise<ExerciseCategory | null>;
    listActiveForUser(id: User["id"]): Promise<ExerciseCategory[]>;
};