import type { Exercise } from "../../domain/models/exercise";
import type { SessionExercise } from "../../domain/models/sessionExercise";
import type { WorkoutSession } from "../../domain/models/workoutSession";

export type CreateSessionExerciseInput = {
    workoutSessionId: WorkoutSession["id"];
    exerciseId?: Exercise["id"];
    exerciseNameSnapshot: string;
    categoryNameSnapshot?: string;
    muscleGroupNameSnapshot?: string;
    orderIndex: number;
    notes?: string;
};

export type UpdateSessionExerciseInput = {
    id: SessionExercise["id"];
    exerciseNameSnapshot?: string;
    categoryNameSnapshot?: string;
    muscleGroupNameSnapshot?: string;
    orderIndex?: number;
    notes?: string;
};

export type SessionExerciseRepository = {
    create(input: CreateSessionExerciseInput): Promise<SessionExercise>;
    update(input: UpdateSessionExerciseInput): Promise<SessionExercise>;
    hardDelete(id: SessionExercise["id"]): Promise<void>;
    findById(id: SessionExercise["id"]): Promise<SessionExercise | null>;
    listByWorkoutSessionId(id: WorkoutSession["id"]): Promise<SessionExercise[]>;
};