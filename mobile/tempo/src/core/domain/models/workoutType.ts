import type { User } from "./user";

export type WorkoutType = {
    id: number;
    userId?: User["id"];
    name: string;
    normalizedName: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};