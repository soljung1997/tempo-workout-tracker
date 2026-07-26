import type { CreateWorkoutTypeInput, UpdateWorkoutTypeInput, WorkoutTypeRepository } from "./workoutTypeRepository";
import { db } from "../../db/database";
import type { WorkoutType } from "../../../domain/models/workoutType";

type WorkoutTypeRow = {
    workout_type_id: number;
    user_id: number;
    name: string;
    normalized_name: string;
    is_default: number;
    is_active: number;
    created_at: string;
    updated_at: string;
};

function mapWorkoutTypeRow(row: WorkoutTypeRow): WorkoutType {
    return {
        id: row.workout_type_id,
        userId: row.user_id,
        name: row.name,
        normalizedName: row.normalized_name,
        isDefault: row.is_default === 1,
        isActive: row.is_active === 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export const sqliteWorkoutTypeRepository: WorkoutTypeRepository = {
    async createOrReactivate(input) {
        throw new Error("Not Implemented");
    },
    async update(input) {
        throw new Error("Not Implemented");
    },
    async findById(id) {
        
        const result = db.getFirstSync<WorkoutTypeRow>(
            `
                SELECT *
                FROM workout_type
                WHERE workout_type_id = ?;
            `,
            id,
        );

        if (!result) {
            return null;
        }

        return mapWorkoutTypeRow(result);
    },
    async listActiveForUser(userId) {
        const results = db.getAllSync<WorkoutTypeRow>(
            `
                SELECT *
                FROM workout_type
                WHERE is_active = 1
                AND (user_id IS NULL OR user_id = ?)
                ORDER BY is_default DESC, name ASC
                ;
            `,
            userId,
        );

        if (!results || results.length === 0) {
            return [];
        }
        return results.map(mapWorkoutTypeRow);
    },
    async softDelete(id) {
        throw new Error("Not Implemented");
    }
};