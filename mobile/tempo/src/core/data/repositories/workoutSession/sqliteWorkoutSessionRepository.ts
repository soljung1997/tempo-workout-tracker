import type { WorkoutSessionRepository } from "./workoutSessionRepository";
import type { WorkoutSession } from "../../../domain/models/workoutSession";
import { db } from "../../db/database";

type WorkoutSessionRow = {
    workout_session_id: number;
    user_id: number;
    workout_plan_id: number | null;
    planned_workout_id: number | null;
    session_name: string;
    session_date: string;
    start_time: string;
    end_time: string | null;
    duration_seconds: number | null;
    energy_rating: number | null;
    difficulty_rating: number | null;
    notes: string | null;
    status: WorkoutSession["status"];
    created_at: string;
    updated_at: string;
};

function mapWorkoutSessionRow(row: WorkoutSessionRow): WorkoutSession {
    return {
        id: row.workout_session_id,
        userId: row.user_id,
        workoutPlanId: row.workout_plan_id ?? undefined,
        plannedWorkoutId: row.planned_workout_id ?? undefined,
        sessionName: row.session_name,
        sessionDate: row.session_date,
        startTime: row.start_time,
        endTime: row.end_time ?? undefined,
        durationSeconds: row.duration_seconds ?? undefined,
        energyRating: row.energy_rating ?? undefined,
        difficultyRating: row.difficulty_rating ?? undefined,
        notes: row.notes ?? undefined,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export const sqliteWorkoutSessionRepository:WorkoutSessionRepository = {
    async create(input) {
        const now = new Date().toISOString();

        const result = db.runSync(
            `
                INSERT INTO workout_session (
                    user_id,
                    workout_plan_id,
                    planned_workout_id,
                    session_name,
                    session_date,
                    start_time,
                    notes,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            `, 
            input.userId,
            input.workoutPlanId ?? null,
            input.plannedWorkoutId ?? null,
            input.sessionName,
            input.sessionDate,
            input.startTime,
            input.notes ?? null,
            now,
            now
        );

        const createdRow = db.getFirstSync<WorkoutSessionRow>(
            `
                SELECT * FROM workout_session WHERE workout_session_id = ?;
            `,
            result.lastInsertRowId
        );

        if(!createdRow) {
            throw new Error("Failed to create workout session");
        }

        return mapWorkoutSessionRow(createdRow);
    },

    async update(input) {
        const now = new Date().toISOString();

        db.runSync(
            `
                UPDATE workout_session
                SET session_name = COALESCE(?, session_name),
                    end_time = COALESCE(?, end_time),
                    duration_seconds = COALESCE(?, duration_seconds),
                    energy_rating = COALESCE(?, energy_rating),
                    difficulty_rating = COALESCE(?, difficulty_rating),
                    notes = COALESCE(?, notes),
                    status = COALESCE(?, status),
                    updated_at = ?
                WHERE workout_session_id = ?;
            `,
            input.sessionName?.trim() ?? null,
            input.endTime?.trim() ?? null,
            input.durationSeconds ?? null,
            input.energyRating ?? null,
            input.difficultyRating ?? null,
            input.notes?.trim() ?? null,
            input.status ?? null,
            now,
            input.id
        );

        const updatedRow = db.getFirstSync<WorkoutSessionRow>(
            `
                SELECT *
                FROM workout_session
                WHERE workout_session_id = ?;
            `,
            input.id
        )

        if (!updatedRow) {
            throw new Error("Failed to update workout session");
        }

        return mapWorkoutSessionRow(updatedRow);
    },

    async complete(input) {
        throw new Error("Not Implemented");
    },
    async discard(id) {

        const now = new Date().toISOString();

        const result = db.runSync(
            `
                UPDATE workout_session
                SET status = 'discarded',
                    updated_at = ?
                WHERE workout_session_id = ?
                    AND status = 'in_progress';
            `,
            now,
            id
        );
        
        if(result.changes === 0) {
            throw new Error("No in-progress session found to discard");
        }
    },

    async hardDelete(id) {
        throw new Error("Not Implemented");
    },
    async findById(id) {
        const result = db.getFirstSync<WorkoutSessionRow>(
            `
                SELECT *
                FROM workout_session
                WHERE workout_session_id = ?;
            `,
            id
        );

        if(!result) {
            return null;
        }

        return mapWorkoutSessionRow(result);
    },
    async findInProgressByUserId(userId) {
        const result = db.getFirstSync<WorkoutSessionRow>(
            `
                SELECT *
                FROM workout_session
                WHERE user_id = ?
                    AND status = 'in_progress';
            `,
            userId
        );

        if(!result) {
            return null;
        }

        return mapWorkoutSessionRow(result);
    },
    async listCompletedByUserId(userId) {
        throw new Error("Not Implemented");
    },
    async listByWorkoutPlanId(workoutPlanId) {
        throw new Error("Not Implemented");
    },
};