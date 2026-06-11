import type { CreateWorkoutSessionInput, UpdateWorkoutSessionInput, WorkoutSessionRepository } from "./workoutSessionRepository";
import { db } from "../../db/database";

export const sqliteWorkoutSessionRepository:WorkoutSessionRepository = {
    async create(input) {
        throw new Error("Not Implemented");
    },
    async update(input) {
        throw new Error("Not Implemented");
    },
    async complete(input) {
        throw new Error("Not Implemented");
    },
    async discard(id) {
        throw new Error("Not Implemented");
    },
    async hardDelete(id) {
        throw new Error("Not Implemented");
    },
    async findById(id) {
        throw new Error("Not Implemented");
    },
    async findInProgressByUserId(userId) {
        throw new Error("Not Implemented");
    },
    async listCompletedByUserId(userId) {
        throw new Error("Not Implemented");
    },
    async listByWorkoutPlanId(workoutPlanId) {
        throw new Error("Not Implemented");
    },
};