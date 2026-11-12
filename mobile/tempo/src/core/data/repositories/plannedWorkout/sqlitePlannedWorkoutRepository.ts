import type { PlannedWorkoutRepository } from "./plannedWorkoutRepository";
import type { PlannedWorkout } from "../../../domain/models/plannedWorkout";
import type { SQLiteDatabase } from "expo-sqlite";
import { db } from "../../db/database";

type PlannedWorkoutRow = {
    planned_workout_id: number;
    user_id: number;
    workout_plan_id: number;
    planned_date: string;
    status: PlannedWorkout["status"];
    notes: string | null;
    is_active: number;
    created_at: string;
    updated_at: string;
};

function mapPlannedWorkoutRow(row: PlannedWorkoutRow): PlannedWorkout {
    return{
        id: row.planned_workout_id,
        userId: row.user_id,
        workoutPlanId: row.workout_plan_id,
        plannedDate: row.planned_date,
        status: row.status,
        notes: row.notes ?? undefined,
        isActive: row.is_active === 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function createSqlitePlannedWorkoutRepository(
    connection: SQLiteDatabase,
): PlannedWorkoutRepository {
    return {
        async create(input) {
            const now = new Date().toISOString();

            const result = connection.runSync(
                /* sql */`
                    INSERT INTO planned_workout (
                        user_id,
                        workout_plan_id,
                        planned_date,
                        status,
                        notes,
                        is_active,
                        created_at,
                        updated_at
                    ) VALUES (?, ?, ?, ?, ?, 1, ?, ?);
                `,
                input.userId,
                input.workoutPlanId,
                input.plannedDate,
                input.status,
                input.notes ?? null,
                now,
                now
            );

            const createdRow = connection.getFirstSync<PlannedWorkoutRow>(
                /* sql */ `
                    SELECT * FROM planned_workout WHERE planned_workout_id = ?;
                `,
                result.lastInsertRowId
            );

            if(!createdRow) {
                throw new Error("Failed to create Planned Workout");
            }

            return mapPlannedWorkoutRow(createdRow);
        },

        async update(input) {
            const now = new Date().toISOString();

            connection.runSync(
                /* sql */ `
                    UPDATE planned_workout
                    SET workout_plan_id = COALESCE(?, workout_plan_id),
                        planned_date = COALESCE(?, planned_date),
                        status = COALESCE(?, status),
                        notes = COALESCE(?, notes),
                        updated_at = ?
                    WHERE planned_workout_id = ?;
                `,
                input.workoutPlanId ?? null,
                input.plannedDate ?? null,
                input.status ?? null,
                input.notes ?? null,
                now,
                input.id
            );

            const updatedRow = connection.getFirstSync<PlannedWorkoutRow>(
                /* sql */ `
                    SELECT *
                    FROM planned_workout
                    WHERE planned_workout_id = ?
                `,
                input.id
            )

            if(!updatedRow) {
                throw new Error("Failed to update planned workout");
            }

            return mapPlannedWorkoutRow(updatedRow);
        },

        async softDelete(id) {
            const now = new Date().toISOString();

            const result = connection.runSync(
                /* sql */ `
                    UPDATE planned_workout
                    SET is_active = 0,
                        updated_at = ?
                    WHERE planned_workout_id = ?;
                `,
                now,
                id,
            );

            if(result.changes === 0) {
                throw new Error("Planned Workout not found");
            }
        },

        async hardDelete(id) {
            const result = connection.runSync(
                /* sql */ `
                    DELETE FROM planned_workout
                    WHERE planned_workout_id = ?;
                `,
                id,
            )

            if(result.changes === 0) {
                throw new Error("Planned Workout not found. Hard delete failed. ");
            }
        },

        async findById(id) {
            const result = connection.getFirstSync<PlannedWorkoutRow>(
                /* sql */`
                    SELECT *
                    FROM planned_workout
                    WHERE planned_workout_id = ?;
                `,
                id,
            );

            if(!result) {
                return null;
            }

            return mapPlannedWorkoutRow(result);
        },

        async listActiveByUserId(userId) {
            const results = connection.getAllSync<PlannedWorkoutRow>(
                /* sql */ `
                    SELECT *
                    FROM planned_workout
                    WHERE is_active = 1
                    AND user_id = ?
                    ORDER BY planned_date ASC, planned_workout_id ASC;
                `,
                userId
            );

            if(!results || results.length === 0) {
                return [];
            }

            return results.map(mapPlannedWorkoutRow);
        },

        async listActiveByDate(input) {
            const results = connection.getAllSync<PlannedWorkoutRow>(
                /* sql */`
                    SELECT *
                    FROM planned_workout
                    WHERE is_active = 1
                    AND user_id = ?
                    AND planned_date = ?
                    ORDER BY planned_workout_id ASC;
                `,
                input.userId,
                input.plannedDate
            );

            if(!results || results.length === 0) {
                return [];
            }

            return results.map(mapPlannedWorkoutRow);
        },
        
        async listActiveByDateRange(input) {
            const results = connection.getAllSync<PlannedWorkoutRow>(
                /* sql */`
                    SELECT *
                    FROM planned_workout
                    WHERE is_active = 1
                    AND user_id = ?
                    AND planned_date >= ?
                    AND planned_date <= ?
                    ORDER BY planned_date ASC, planned_workout_id ASC;
                `,
                input.userId,
                input.startDate,
                input.endDate
            );

            if(!results || results.length === 0){
                return [];
            }

            return results.map(mapPlannedWorkoutRow);
        },
    };
}

export const sqlitePlannedWorkoutRepository = createSqlitePlannedWorkoutRepository(db);