import type { CreateExerciseInput, UpdateExerciseInput, ExerciseRepository } from "./exerciseRepository";
import { db } from "../../db/database";

export const sqliteExerciseRepository:ExerciseRepository = {
    async create(input) {
        throw new Error("Not implemented");
    },

    async update(input) {
        throw new Error("Not implemented");
    },

    async softDelete(id) {
        throw new Error("Not implemented");
    },

    async hardDelete(id) {
        throw new Error("Not implemented");
    },

    async findById(id) {
        throw new Error("Not implemented");
    }, 

    async listActiveByUserId(userId){
        throw new Error("Not implemented");
    },
};