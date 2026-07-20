import type { CreateWorkoutTypeInput, UpdateWorkoutTypeInput, WorkoutTypeRepository } from "./workoutTypeRepository";
import { db } from "../../db/database";

export const sqliteWorkoutTypeRepository: WorkoutTypeRepository = {
    async createOrReactivate(input) {
        throw new Error("Not Implemented");
    },
    async update(input) {
        throw new Error("Not Implemented");
    },
    async findById(id) {
        throw new Error("Not Implemented");
    },
    async listActiveForUser(userId) {
        throw new Error("Not Implemented");
    },
    async softDelete(id) {
        throw new Error("Not Implemented");
    }
};