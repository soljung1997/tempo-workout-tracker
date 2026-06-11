import type { CreatePlanExerciseInput, UpdatePlanExerciseInput, PlanExerciseRepository } from "./planExerciseRepository";
import { db } from "../../db/database";

export const sqlitePlanExerciseRepository:PlanExerciseRepository = {
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
    async listActiveByWorkoutPlanId(id) {
        throw new Error("Not Implemented");
    },
};