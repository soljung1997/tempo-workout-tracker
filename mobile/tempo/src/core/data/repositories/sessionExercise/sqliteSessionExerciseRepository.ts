import type { SessionExercise } from "../../../domain/models/sessionExercise";
import type { SessionExerciseRepository } from "./sessionExerciseRepository";
import type { SQLiteDatabase } from "expo-sqlite";
import { db } from "../../db/database";

type SessionExerciseRow = {
    session_exercise_id: number;
    workout_session_id: number;
    exercise_id: number | null;
    exercise_name_snapshot: string;
    category_name_snapshot: string | null;
    muscle_group_name_snapshot: string | null;
    target_sets: number | null;
    target_reps: number | null;
    target_weight: number | null;
    target_rest_seconds: number | null;
    order_index: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

function mapSessionExerciseRow(row: SessionExerciseRow): SessionExercise {
    return {
        id: row.session_exercise_id,
        workoutSessionId: row.workout_session_id,
        exerciseId: row.exercise_id ?? undefined,
        exerciseNameSnapshot: row.exercise_name_snapshot,
        categoryNameSnapshot: row.category_name_snapshot ?? undefined,
        muscleGroupNameSnapshot: row.muscle_group_name_snapshot ?? undefined,
        targetSets: row.target_sets ?? undefined,
        targetReps: row.target_reps ?? undefined,
        targetWeight: row.target_weight ?? undefined,
        targetRestSeconds: row.target_rest_seconds ?? undefined,
        orderIndex: row.order_index,
        notes: row.notes ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export function createSqliteSessionExerciseRepository(
    connection: SQLiteDatabase,
): SessionExerciseRepository {
    return {
        async create(input) {
            const now = new Date().toISOString();

            const result = connection.runSync(
                `
                    INSERT INTO session_exercise (
                        workout_session_id,
                        exercise_id,
                        exercise_name_snapshot,
                        category_name_snapshot,
                        muscle_group_name_snapshot,
                        target_sets,
                        target_reps,
                        target_weight,
                        target_rest_seconds,
                        order_index,
                        notes,
                        created_at,
                        updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                `,
                input.workoutSessionId,
                input.exerciseId ?? null,
                input.exerciseNameSnapshot,
                input.categoryNameSnapshot ?? null,
                input.muscleGroupNameSnapshot ?? null,
                input.targetSets ?? null,
                input.targetReps ?? null,
                input.targetWeight ?? null,
                input.targetRestSeconds ?? null,
                input.orderIndex,
                input.notes ?? null,
                now,
                now
            );

            const createdRow = connection.getFirstSync<SessionExerciseRow>(
                `
                    SELECT * FROM session_exercise
                    WHERE session_exercise_id = ?;
                `,
                result.lastInsertRowId
            );

            if(!createdRow) {
                throw new Error("Failed to create session exercise");
            }
            
            return mapSessionExerciseRow(createdRow);
        },
        async update(input) {
            const now = new Date().toISOString();

            connection.runSync(
                `
                    UPDATE session_exercise
                    SET exercise_name_snapshot = COALESCE(?, exercise_name_snapshot),
                        category_name_snapshot = COALESCE(?, category_name_snapshot),
                        muscle_group_name_snapshot = COALESCE(?, muscle_group_name_snapshot),
                        target_sets = COALESCE(?, target_sets),
                        target_reps = COALESCE(?, target_reps),
                        target_weight = COALESCE(?, target_weight),
                        target_rest_seconds = COALESCE(?, target_rest_seconds),
                        order_index = COALESCE(?, order_index),
                        notes = COALESCE(?, notes),
                        updated_at = ?
                    WHERE session_exercise_id = ?;
                `,
                input.exerciseNameSnapshot?.trim() ?? null,
                input.categoryNameSnapshot?.trim() ?? null,
                input.muscleGroupNameSnapshot?.trim() ?? null,
                input.targetSets ?? null,
                input.targetReps ?? null,
                input.targetWeight ?? null,
                input.targetRestSeconds ?? null,
                input.orderIndex ?? null,
                input.notes?.trim() ?? null,
                now,
                input.id
            );

            const updatedRow = connection.getFirstSync<SessionExerciseRow>(
                `
                    SELECT *
                    FROM session_exercise
                    WHERE session_exercise_id = ?;
                `,
                input.id
            )

            if (!updatedRow) {
                throw new Error("Failed to update session exercise");
            }

            return mapSessionExerciseRow(updatedRow);
        },
        async hardDelete(id) {
            throw new Error("Not Implemented");
        },
        async findById(id) {
            const result = connection.getFirstSync<SessionExerciseRow>(
                `
                    SELECT *
                    FROM session_exercise
                    WHERE session_exercise_id = ?;
                `,
                id
            );

            if(!result) {
                return null;
            }
            
            return mapSessionExerciseRow(result);
        },
        async listByWorkoutSessionId(id) {
            const results = connection.getAllSync<SessionExerciseRow>(
                `
                    SELECT *
                    FROM session_exercise
                    WHERE workout_session_id = ?
                    ORDER BY order_index ASC;
                `,
                id
            );

            if(!results || results.length === 0){
                return [];
            }

            return results.map(mapSessionExerciseRow);
        }, 
    };
}

export const sqliteSessionExerciseRepository = createSqliteSessionExerciseRepository(db);