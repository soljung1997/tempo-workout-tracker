//data model for exercise, which is to be used as a template for other data models pertaining to logged exercise, and etc?

import type { ExerciseCategory } from "./exerciseCategory";
import type { MuscleGroup } from "./muscleGroup";

export type Exercise = {
    id: number;
    name: string;
    categoryId: ExerciseCategory["id"];
    muscleGroupId: MuscleGroup["id"];
    defaultSets?: number;
    defaultReps?: number;
    defaultWeight?: number;
    defaultRestSeconds?: number;
    notes?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};