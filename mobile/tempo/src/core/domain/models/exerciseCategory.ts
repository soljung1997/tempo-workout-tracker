//You're trying to create a data model for an exercise category. What are the entities required for you to do that?
import type { User } from "./user";

export type ExerciseCategory = {
    id: number; //identifier, duh
    userId?: User["id"];
    name: string; //name, for the user to use
    // for when the user deletes and re-adds the same category, lowercase comparison.
    normalizedName: string;
    isDefault: boolean; // user created vs default
    isActive: boolean; // soft delete
    createdAt: string;
    updatedAt: string;
};
