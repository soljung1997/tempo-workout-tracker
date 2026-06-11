import type { CreateSetLogInput, UpdateSetLogInput, SetLogRepository } from "./setLogRepository";
import { db } from "../../db/database";

export const sqliteSetLogRepository:SetLogRepository = {
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
    async listBySessionExerciseId(id) {
        throw new Error("Not Implemented");
    },
};