import type { User } from "../../domain/models/user";
import type { WorkoutSession } from "../../domain/models/workoutSession";
import type { SessionExercise } from "../../domain/models/sessionExercise";
import type { 
    CreateWorkoutSessionInput, 
    WorkoutSessionRepository 
} from "../../data/repositories/workoutSession/workoutSessionRepository";
import type { SessionExerciseRepository } from "../../data/repositories/sessionExercise/sessionExerciseRepository";
import type { PlannedWorkoutRepository } from "../../data/repositories/plannedWorkout/plannedWorkoutRepository";
import type { WorkoutPlanRepository } from "../../data/repositories/workoutPlan/workoutPlanRepository";
import type { PlanExerciseRepository } from "../../data/repositories/planExercise/planExerciseRepository";
import type { ExerciseRepository } from "../../data/repositories/exercise/exerciseRepository";

import type { TransactionRunner } from "../../data/db/sqliteTransactionRunner";

export type ActiveWorkout = {
    session: WorkoutSession;
    exercises: SessionExercise[];
};

export type WorkoutSessionService = {
    startWorkout(input: CreateWorkoutSessionInput): Promise<WorkoutSession>;
    resumeWorkout(userId: User["id"]): Promise<ActiveWorkout | null>;
    discardWorkout(id: WorkoutSession["id"]): Promise<void>;
};

export function createWorkoutSessionService(
    workoutSessionRepository: WorkoutSessionRepository,
    sessionExerciseRepository: SessionExerciseRepository,
    plannedWorkoutRepository: PlannedWorkoutRepository,
    transactionRunner: TransactionRunner
): WorkoutSessionService {
    return {
        async startWorkout(input) {
            return transactionRunner.run(async (repositories) => {
                const existingSession = 
                    await repositories.workoutSessions.findInProgressByUserId(
                        input.userId
                    );
                
                if (existingSession) {
                    throw new Error("An active workout session already exists");
                }

                const session = await repositories.workoutSessions.create(input);
                
                //copy the data onto the sessionExercises

                const workoutPlanId = session.workoutPlanId;
                if (workoutPlanId == undefined) {
                    throw new Error("A workout plan is required to start this workout");
                }

                const planExercises = await repositories.planExercises.listActiveByWorkoutPlanId(workoutPlanId);

                for (const planExercise of planExercises) {

                    const exercise = await repositories.exercises.findById(planExercise.exerciseId);

                    if(!exercise) {
                        throw new Error("Exercise not found");
                    }
                    
                    await repositories.sessionExercises.create({
                        workoutSessionId: session.id,
                        exerciseId: planExercise.exerciseId,
                                exerciseNameSnapshot: exercise.name,
                                targetSets: planExercise.targetSets,
                                targetReps: planExercise.targetReps,
                                targetWeight: planExercise.targetWeight,
                                targetRestSeconds: planExercise.targetRestSeconds,
                                orderIndex: planExercise.orderIndex,
                                notes: planExercise.notes,
                    });
                }

                return session;
            })
        },

        async resumeWorkout(id) {
            throw new Error("Not implemented");
        },

        async discardWorkout(id) {
            throw new Error("Not Implemented");
        }
    };
}