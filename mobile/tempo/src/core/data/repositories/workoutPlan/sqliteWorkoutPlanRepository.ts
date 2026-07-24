import type { CreateWorkoutPlanInput, UpdateWorkoutPlanInput, WorkoutPlanRepository } from "./workoutPlanRepository";
import { db } from "../../db/database";
import type { WorkoutPlan } from "../../../domain/models/workoutPlan";

type WorkoutPlanRow = {
    workout_plan_id: number;
    user_id: number;
    workout_type_id: number | null;
    name: string;
    description: string | null;
    workout_day: WorkoutPlan["workoutDay"] | null;
    goal: string | null;
    is_active: number;
    created_at: string;
    updated_at: string;
};

function mapWorkoutPlanRow(row: WorkoutPlanRow): WorkoutPlan {
    return {
        id: row.workout_plan_id,
        userId: row.user_id,
        workoutTypeId: row.workout_type_id ?? undefined,
        name: row.name,
        description: row.description ?? undefined,
        workoutDay: row.workout_day ?? undefined,
        goal: row.goal ?? undefined,
        isActive: row.is_active === 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export const sqliteWorkoutPlanRepository:WorkoutPlanRepository = {
    async create(input) {
        const now = new Date().toISOString();

        const result = db.runSync(
            `
                INSERT INTO workout_plan (
                    user_id,
                    workout_type_id,
                    name,
                    description,
                    workout_day,
                    goal,
                    is_active,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?);
            `,
            input.userId,
            input.workoutTypeId ?? null,
            input.name.trim(),
            input.description?.trim() ?? null,
            input.workoutDay ?? null,
            input.goal?.trim() ?? null,
            now,
            now
        );

        const createdRow = db.getFirstSync<WorkoutPlanRow>(
            `
                SELECT *
                FROM workout_plan
                WHERE workout_plan_id = ?;
            `,
            result.lastInsertRowId
        );

        if (!createdRow) {
            throw new Error("Failed to create workout plan");
        }

        return mapWorkoutPlanRow(createdRow);
    },
    async update(input) {
        const now = new Date().toISOString();

        db.runSync(
            `
                UPDATE workout_plan
                SET workout_type_id = COALESCE(?, workout_type_id),
                    name = COALESCE(?, name),
                    description = COALESCE(?, description),
                    workout_day = COALESCE(?, workout_day),
                    goal = COALESCE(?, goal),
                    updated_at = ?
                WHERE workout_plan_id = ?;  
            `,
            input.workoutTypeId ?? null,
            input.name?.trim() ?? null,
            input.description?.trim() ?? null,
            input.workoutDay ?? null,
            input.goal?.trim() ?? null,
            now,
            input.id
        ); 

        const updatedRow = db.getFirstSync<WorkoutPlanRow>(
            `
                SELECT *
                FROM workout_plan
                WHERE workout_plan_id = ?;
            `,
            input.id
        );

        if (!updatedRow) {
            throw new Error("Failed to update workout plan");
        }

        return mapWorkoutPlanRow(updatedRow);
    },
    async softDelete(id) {
        const now = new Date().toISOString();

        const result = db.runSync(
            `
                UPDATE workout_plan
                SET is_active = 0,
                    updated_at = ?
                WHERE workout_plan_id = ?;
            `,
            now,
            id,
        );

        if (result.changes === 0) {
            throw new Error("Workout plan not found");
        }
    },
    async findById(id) {
        const result = db.getFirstSync<WorkoutPlanRow>(
            `
                SELECT *
                FROM workout_plan
                WHERE workout_plan_id = ?;
            `,
            id,
        );

        if (!result) {
            return null;
        }

        return mapWorkoutPlanRow(result);
    },
    async listActiveByUserId(userId) {
        
        const results = db.getAllSync<WorkoutPlanRow>(
            `
                SELECT *
                FROM workout_plan
                WHERE user_id = ? AND is_active = 1;
                `,
                userId,
        );

        if (!results || results.length === 0) {
            return [];
        }

        return results.map(mapWorkoutPlanRow);
    },
};