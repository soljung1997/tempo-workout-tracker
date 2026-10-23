import type { WorkoutSessionRepository } from
    "../repositories/workoutSession/workoutSessionRepository";
import type { SessionExerciseRepository } from
    "../repositories/sessionExercise/sessionExerciseRepository";
import type { PlannedWorkoutRepository } from
    "../repositories/plannedWorkout/plannedWorkoutRepository";

import { createSqliteWorkoutSessionRepository } from
    "../repositories/workoutSession/sqliteWorkoutSessionRepository";
import { createSqliteSessionExerciseRepository } from
    "../repositories/sessionExercise/sqliteSessionExerciseRepository";
import { createSqlitePlannedWorkoutRepository } from
    "../repositories/plannedWorkout/sqlitePlannedWorkoutRepository";

import { db } from "./database";

type TransactionRepositories = {
    workoutSessions: WorkoutSessionRepository;
    sessionExercises: SessionExerciseRepository;
    plannedWorkouts: PlannedWorkoutRepository;
};

export type TransactionRunner = {
    run<T>(
        operation: (
            repositories: TransactionRepositories,
        ) => Promise<T>,
    ): Promise<T>;
};

export const sqliteTransactionRunner: TransactionRunner = {
    async run<T>(
        operation: (
            repositories: TransactionRepositories,
        ) => Promise<T>,
    ): Promise<T> {
        const outcome: { value: T}[] = [];

        await db.withExclusiveTransactionAsync(async (transaction) => {
            const repositories: TransactionRepositories = {
                workoutSessions: createSqliteWorkoutSessionRepository(transaction),
                sessionExercises: createSqliteSessionExerciseRepository(transaction),
                plannedWorkouts: createSqlitePlannedWorkoutRepository(transaction),
            };

            const value = await operation(repositories);

            outcome.push({ value });
        });

        const result = outcome[0];

        if (!result) {
            throw new Error("Transaction completed without a result");
        }

        return result.value;
    },
};