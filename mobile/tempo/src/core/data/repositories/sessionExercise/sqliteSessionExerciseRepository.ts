import type { CreateSessionExerciseInput, UpdateSessionExerciseInput, SessionExerciseRepository } from "./sessionExerciseRepository";
import { db } from "../../db/database";

export const sqliteSessionExerciseRepository:SessionExerciseRepository = {
    async create(input) {
        throw new Error("Not Implemented");
    },
    async update(input) {
        throw new Error("Not Implemented");
    },
    async hardDelete(id) {
        throw new Error("Not Implemented");
    },
    async findById(id) {
        throw new Error("Not Implemented");
    },
    async listByWorkoutSessionId(id) {
        throw new Error("Not Implemented");
    }, 
};