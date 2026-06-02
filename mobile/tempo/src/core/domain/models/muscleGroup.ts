//Extremely similar to category, an Id, name

import type { User } from "./user";

export type MuscleGroup = {
    id: number;
    userId?: User["id"];
    name: string;
    normalizedName: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};