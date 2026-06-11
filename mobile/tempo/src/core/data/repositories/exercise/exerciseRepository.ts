
import type { Exercise } from "../../../domain/models/exercise";
import type { ExerciseCategory } from "../../../domain/models/exerciseCategory";
import type { MuscleGroup } from "../../../domain/models/muscleGroup";
import type { User } from "../../../domain/models/user";

export type CreateExerciseInput = {
    userId: User["id"];
    name: string;
    normalizedName: string;
    categoryId: ExerciseCategory["id"];
    muscleGroupId: MuscleGroup["id"];
    defaultSets?: number;
    defaultReps?: number;
    defaultWeight?: number;
    defaultRestSeconds?: number;
    notes?: string;
};

export type UpdateExerciseInput = {
        id: Exercise["id"];
        name?: string;
        normalizedName?: string;
        categoryId?: ExerciseCategory["id"];
        muscleGroupId?: MuscleGroup["id"];
        defaultSets?: number;
        defaultReps?: number;
        defaultWeight?: number;
        defaultRestSeconds?: number;
        notes?: string;
};

export type ExerciseRepository = {
    create(input: CreateExerciseInput): Promise<Exercise>;
    update(input: UpdateExerciseInput): Promise<Exercise>;
    softDelete(id: Exercise["id"]): Promise<void>;
    hardDelete(id: Exercise["id"]): Promise<void>;
    findById(id: Exercise["id"]): Promise<Exercise | null>;
    listActiveByUserId(userId: User["id"]): Promise<Exercise[]>;
};