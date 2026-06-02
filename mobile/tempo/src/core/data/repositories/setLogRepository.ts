import type { SessionExercise } from "../../domain/models/sessionExercise";
import type { SetLog } from "../../domain/models/setLog";

export type CreateSetLogInput = {
    sessionExerciseId: SessionExercise["id"];
    setNumber: number;
    repsCompleted?: number;
    weightUsed?: number;
    weightUnit?: "kg" | "lb";
    restSeconds?: number;
    rpe?: number;
    isCompleted: boolean;
    notes?: string;
};

export type UpdateSetLogInput = {
    id: SetLog["id"];
    setNumber?: number;
    repsCompleted?: number;
    weightUsed?: number;
    weightUnit?: "kg" | "lb";
    restSeconds?: number;
    rpe?: number;
    isCompleted?: boolean;
    notes?: string;
};

export type SetLogRepository = {
    create(input: CreateSetLogInput): Promise<SetLog>;
    update(input: UpdateSetLogInput): Promise<SetLog>;
    hardDelete(id: SetLog["id"]): Promise<void>;
    findById(id: SetLog["id"]): Promise<SetLog | null>;
    listBySessionExerciseId(id: SessionExercise["id"]): Promise<SetLog[]>;
};