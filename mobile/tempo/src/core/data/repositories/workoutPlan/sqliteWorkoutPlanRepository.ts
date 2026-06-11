import type { CreateWorkoutPlanInput, UpdateWorkoutPlanInput, WorkoutPlanRepository } from "./workoutPlanRepository";
import { db } from "../../db/database";

export const sqliteWorkoutPlanRepository:WorkoutPlanRepository = {
    async create(input) {
        throw new Error("Not Implemented");
    },
    async update(input) {
        throw new Error("Not Implemented");
    },
    async softDelete(id) {
        throw new Error("Not Implemented");
    },
    async findById(id) {
        throw new Error("Not Implemented");
    },
    async listActiveByUserId(userId) {
        throw new Error("Not Implemented");
    },
};