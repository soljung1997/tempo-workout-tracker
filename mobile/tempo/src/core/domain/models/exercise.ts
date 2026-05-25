//data model for exercise, which is to be used as a template for other data models pertaining to logged exercise, and etc?

import type { ExerciseCategory } from "./exerciseCategory";
import type { MuscleGroup } from "./muscleGroup";
import type { User } from "./user";

export type Exercise = {
    id: number;
    userId?: User["id"];
    name: string;
    categoryId: ExerciseCategory["id"];
    muscleGroupId: MuscleGroup["id"];
    defaultSets?: number;
    defaultReps?: number;
    defaultWeight?: number;
    defaultRestSeconds?: number;
    notes?: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};