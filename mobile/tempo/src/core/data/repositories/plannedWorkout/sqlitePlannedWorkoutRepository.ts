import type { PlannedWorkoutRepository } from "./plannedWorkoutRepository";
import { db } from "../../db/database";

export const sqlitePlannedWorkoutRepository: PlannedWorkoutRepository = {
    async create(input) {
        throw new Error("Not Implemented");
    },

    async update(input) {
        throw new Error("Not Implemented");
    },

    async softDelete(id) {
        throw new Error("Not Implemented");
    },

    async hardDelete(id) {
        throw new Error("Not Implemented");
    },

    async findById(id) {
        throw new Error("Not Implemented");
    },

    async listActiveByUserId(userId) {
        throw new Error("Not Implemented");
    },

    async listActiveByDate(input) {
        throw new Error("Not Implemented");
    },
    
    async listActiveByDateRange(input) {
        throw new Error("Not Implemented");
    },
};