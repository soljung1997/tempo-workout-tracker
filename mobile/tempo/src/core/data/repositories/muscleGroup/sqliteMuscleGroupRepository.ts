import type { CreateMuscleGroupInput, UpdateMuscleGroupInput, MuscleGroupRepository } from "./muscleGroupRepository";
import { db } from "../../db/database";

export const sqliteMuscleGroupRepository:MuscleGroupRepository = {
    async createOrReactivate(input) {
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
    async listActiveForUser(id) {
        throw new Error("Not Implemented");
    },
};