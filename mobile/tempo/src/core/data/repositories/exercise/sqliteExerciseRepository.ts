import type { ExerciseRepository } from "./exerciseRepository";
import { db } from "../../db/database";
import type { Exercise } from "../../../domain/models/exercise";

type ExerciseRow = {
    exercise_id: number;
    user_id: number | null;
    name: string;
    normalized_name: string;
    category_id: number;
    muscle_group_id: number;
    default_sets: number | null;
    default_reps: number | null;
    default_weight: number | null;
    default_rest_seconds: number | null;
    notes: string | null;
    is_default: number;
    is_active: number;
    created_at: string;
    updated_at: string;
};

function mapExerciseRow(row: ExerciseRow): Exercise {
    return {
        id: row.exercise_id,
        userId: row.user_id ?? undefined,
        name: row.name,
        normalizedName: row.normalized_name,
        categoryId: row.category_id,
        muscleGroupId: row.muscle_group_id,
        defaultSets: row.default_sets ?? undefined,
        defaultReps: row.default_reps ?? undefined,
        defaultWeight: row.default_weight ?? undefined,
        defaultRestSeconds: row.default_rest_seconds ?? undefined,
        notes: row.notes ?? undefined,
        isDefault: row.is_default === 1,
        isActive: row.is_active === 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}


export const sqliteExerciseRepository:ExerciseRepository = {
    async create(input) {
        const now = new Date().toISOString();

        const result = db.runSync(
            `
                INSERT INTO exercise (
                    user_id,
                    name,
                    normalized_name,
                    category_id,
                    muscle_group_id,
                    default_sets,
                    default_reps,
                    default_weight,
                    default_rest_seconds,
                    notes,
                    is_default,
                    is_active,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?, ?);
            `,
            input.userId ?? null,
            input.name,
            input.normalizedName,
            input.categoryId,
            input.muscleGroupId,
            input.defaultSets ?? null,
            input.defaultReps ?? null,
            input.defaultWeight ?? null,
            input.defaultRestSeconds ?? null,
            input.notes ?? null,
            now,
            now
        );

        const createdRow = db.getFirstSync<ExerciseRow>(
            `
                SELECT * FROM exercise WHERE exercise_id = ?;
            `,
            result.lastInsertRowId
        );

        if(!createdRow) {
            throw new Error("Failed to create exercise");
        }

        return mapExerciseRow(createdRow);
    },

    async update(input) {
        const now = new Date().toISOString();

        db.runSync(
            `
                UPDATE exercise
                SET name = COALESCE(?, name),
                    normalized_name = COALESCE(?, normalized_name),
                    category_id = COALESCE(?, category_id),
                    muscle_group_id = COALESCE(?, muscle_group_id),
                    default_sets = COALESCE(?, default_sets),
                    default_reps = COALESCE(?, default_reps),
                    default_weight = COALESCE(?, default_weight),
                    default_rest_seconds = COALESCE(?, default_rest_seconds),
                    notes = COALESCE(?, notes),
                    updated_at = ?
                WHERE exercise_id = ?;
            `,
            input.name?.trim() ?? null,
            input.normalizedName?.trim() ?? null,
            input.categoryId ?? null,
            input.muscleGroupId ?? null,
            input.defaultSets ?? null,
            input.defaultReps ?? null,
            input.defaultWeight ?? null,
            input.defaultRestSeconds ?? null,
            input.notes?.trim() ?? null,
            now,
            input.id
        );

        const updatedRow = db.getFirstSync<ExerciseRow>(
            `
                SELECT *
                FROM exercise
                WHERE exercise_id = ?;
            `,
            input.id
        )

        if (!updatedRow) {
            throw new Error("Failed to update exercise");
        }

        return mapExerciseRow(updatedRow);
    },

    async softDelete(id) {
        const now = new Date().toISOString();

        const result = db.runSync(
            `
                UPDATE exercise
                SET is_active = 0,
                    updated_at = ?
                WHERE exercise_id = ?;
            `,
            now,
            id,
        );

        if(result.changes === 0) {
            throw new Error("Exercise not found");
        }
    },

    async hardDelete(id) {
        const result = db.runSync(
            `
                DELETE FROM exercise
                WHERE exercise_id = ?;
            `,
            id,
        )

        if(result.changes === 0) {
            throw new Error("Exercise not found. Hard delete failed.");
        }
    },

    async findById(id) {
        const result = db.getFirstSync<ExerciseRow>(
            `
                SELECT *
                FROM exercise
                WHERE exercise_id = ?;
            `,
            id,
        );

        if(!result) {
            return null;
        }

        return mapExerciseRow(result);
    }, 

    async listActiveByUserId(userId){
        const results = db.getAllSync<ExerciseRow>(
            `
                SELECT *
                FROM exercise
                WHERE is_active = 1
                AND (user_id IS NULL OR user_id = ?)
                ORDER BY name ASC;
            `,
            userId
        );

        if (!results || results.length === 0){
            return [];
        }

        return results.map(mapExerciseRow);
    },
};