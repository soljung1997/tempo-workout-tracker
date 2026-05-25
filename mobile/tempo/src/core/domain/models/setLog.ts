import type { SessionExercise } from "./sessionExercise";

export type SetLog = {
    id: number;
    sessionExerciseId: SessionExercise["id"];
    setNumber: number;
    repsCompleted: number;
    weightUsed?: number;
    weightUnit?: "kg" | "lb";
    restSeconds?: number;
    rpe?: number;
    isCompleted: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
};