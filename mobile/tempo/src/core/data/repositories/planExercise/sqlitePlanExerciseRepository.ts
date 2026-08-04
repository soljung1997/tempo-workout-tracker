import type { PlanExerciseRepository } from "./planExerciseRepository";
import type { PlanExercise } from "../../../domain/models/planExercise";
import { db } from "../../db/database";

type PlanExerciseRow = {
    plan_exercise_id: number;
    workout_plan_id: number;
    exercise_id: number;
    order_index: number;
    target_sets: number | null;
    target_reps: number | null;
    target_weight: number | null;
    target_rest_seconds: number | null;
    notes: string | null;
    is_active: number;
    created_at: string;
    updated_at: string;
};

function mapPlanExerciseRow(row: PlanExerciseRow): PlanExercise {
    return {
        id: row.plan_exercise_id,
        workoutPlanId: row.workout_plan_id,
        exerciseId: row.exercise_id,
        orderIndex: row.order_index,
        targetSets: row.target_sets ?? undefined,
        targetReps: row.target_reps ?? undefined,
        targetWeight: row.target_weight ?? undefined,
        targetRestSeconds: row.target_rest_seconds ?? undefined,
        notes: row.notes ?? undefined,
        isActive: row.is_active === 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export const sqlitePlanExerciseRepository: PlanExerciseRepository = {
    async create(input) {
        const now = new Date().toISOString();

        const result = db.runSync(
            `
                INSERT INTO plan_exercise (
                    workout_plan_id,
                    exercise_id,
                    order_index,
                    target_sets,
                    target_reps,
                    target_weight,
                    target_rest_seconds,
                    notes,
                    is_active,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?);
            `,
            input.workoutPlanId,
            input.exerciseId,
            input.orderIndex,
            input.targetSets ?? null,
            input.targetReps ?? null,
            input.targetWeight ?? null,
            input.targetRestSeconds ?? null,
            input.notes?.trim() ?? null,
            now,
            now
        );

        const createdRow = db.getFirstSync<PlanExerciseRow>(
            `
                SELECT *
                FROM plan_exercise
                WHERE plan_exercise_id = ?;
            `,
            result.lastInsertRowId
        );

        if (!createdRow) {
            throw new Error("Failed to create plan exercise");
        }

        return mapPlanExerciseRow(createdRow);
    },
    async update(input) {
        const now = new Date().toISOString();

        db.runSync(
            `
                UPDATE plan_exercise
                SET
                    order_index = COALESCE(?, order_index), 
                    target_sets = COALESCE(?, target_sets),
                    target_reps = COALESCE(?, target_reps),
                    target_weight = COALESCE(?, target_weight),
                    target_rest_seconds = COALESCE(?, target_rest_seconds),
                    notes = COALESCE(?, notes),
                    updated_at = ?
                WHERE plan_exercise_id = ?;
            `,
            input.orderIndex ?? null,
            input.targetSets ?? null,
            input.targetReps ?? null,
            input.targetWeight ?? null,
            input.targetRestSeconds ?? null,
            input.notes?.trim() ?? null,
            now,
            input.id
        );

        const updatedRow = db.getFirstSync<PlanExerciseRow>(
            `
                SELECT *
                FROM plan_exercise
                WHERE plan_exercise_id = ?;
            `,
            input.id
        );

        if (!updatedRow) {
            throw new Error("Failed to update plan exercise");
        }

        return mapPlanExerciseRow(updatedRow);
        
    },
    async softDelete(id) {
        const now = new Date().toISOString();

        const result = db.runSync(
            `
                UPDATE plan_exercise
                SET is_active = 0,
                    updated_at = ?
                WHERE plan_exercise_id = ?;
            `,
            now,
            id,
        );

        if (result.changes === 0) {
            throw new Error("Failed to soft delete plan exercise");
        }
    },
    async hardDelete(id) {
        const result = db.runSync(
            `
                DELETE FROM plan_exercise
                WHERE plan_exercise_id = ?;
            `,
            id
        );

        if(result.changes === 0) {
            throw new Error("Plan Exercise not found");
        }
    },
    async findById(id) {
        const result = db.getFirstSync<PlanExerciseRow>(
            `
                SELECT *
                FROM plan_exercise
                WHERE plan_exercise_id = ?;
            `,
            id
        );

        if (!result) {
            return null;
        }

        return mapPlanExerciseRow(result);
    },
    async listActiveByWorkoutPlanId(id) {
        const results = db.getAllSync<PlanExerciseRow>(
            `
                SELECT *
                FROM plan_exercise
                WHERE workout_plan_id = ? AND is_active = 1
                ORDER BY order_index ASC;
            `,
            id
        );

        if (!results || results.length === 0) {
            return [];
        }

        return results.map(mapPlanExerciseRow);
    },
    async listAllByWorkoutPlanId(id) {
        const results = db.getAllSync<PlanExerciseRow>(
            `
                SELECT *
                FROM plan_exercise
                WHERE workout_plan_id = ?
                ORDER BY order_index ASC;
            `,
            id
        );

        if (!results || results.length === 0) {
            return [];
        }

        return results.map(mapPlanExerciseRow);
    }
};