import type { PlanExercise } from "../../../domain/models/planExercise";
import type { WorkoutPlan } from "../../../domain/models/workoutPlan";
import type { Exercise } from "../../../domain/models/exercise";

export type CreatePlanExerciseInput = {
    workoutPlanId: WorkoutPlan["id"];
    exerciseId: Exercise["id"];
    orderIndex: number;
    targetSets?: number;
    targetReps?: number;
    targetWeight?: number;
    targetRestSeconds?: number;
    notes?: string;
};

export type UpdatePlanExerciseInput = {
    id: PlanExercise["id"];
    orderIndex?: number;
    targetSets?: number;
    targetReps?: number;
    targetWeight?: number;
    targetRestSeconds?: number;
    notes?: string;
};

export type PlanExerciseRepository = {
    create(input: CreatePlanExerciseInput): Promise<PlanExercise>;
    update(input: UpdatePlanExerciseInput): Promise<PlanExercise>;
    softDelete(id: PlanExercise["id"]): Promise<void>;
    hardDelete(id: PlanExercise["id"]): Promise<void>;
    findById(id: PlanExercise["id"]): Promise<PlanExercise | null>;
    listActiveByWorkoutPlanId(id: WorkoutPlan["id"]): Promise<PlanExercise[]>;
};