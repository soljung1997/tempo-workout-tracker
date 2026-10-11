import type { CreateWorkoutSessionInput, UpdateWorkoutSessionInput, WorkoutSessionRepository } from "./workoutSessionRepository";
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
        throw new Error("Not Implemented");
    },
    async complete(input) {
        throw new Error("Not Implemented");
    },
    async discard(id) {
        throw new Error("Not Implemented");
    },
    async hardDelete(id) {
        throw new Error("Not Implemented");
    },
    async findById(id) {
        throw new Error("Not Implemented");
    },
    async findInProgressByUserId(userId) {
        throw new Error("Not Implemented");
    },
    async listCompletedByUserId(userId) {
        throw new Error("Not Implemented");
    },
    async listByWorkoutPlanId(workoutPlanId) {
        throw new Error("Not Implemented");
    },
};