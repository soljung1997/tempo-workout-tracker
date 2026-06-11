import type { ExerciseCategoryRepository, CreateExerciseCategoryInput, UpdateExerciseCategoryInput } from "./exerciseCategoryRepository";
import { db } from "../../db/database";

export const sqliteExerciseCategoryRepository: ExerciseCategoryRepository = {
    async createOrReactivate(input) {
        throw new Error("Not implemented");
    },

    async update(input){
        throw new Error("Not implemented");
    },

    async softDelete(id) {
        throw new Error("Not implemented");
    },

    async findById(id) {
        
        throw new Error("Not implemented");
    },

    async listActiveForUser(userId) {
        throw new Error("Not implemented");
    },
};