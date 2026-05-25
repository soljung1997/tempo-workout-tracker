import type { User } from "../../domain/models/user";
import type { WorkoutPlan } from "../../domain/models/workoutPlan";
import type { WorkoutSession } from "../../domain/models/workoutSession";

export type CreateWorkoutSessionInput = {
    userId: User["id"];
    workoutPlanId?: WorkoutPlan["id"];
    sessionName: string;
    sessionDate: string;
    startTime: string;
    notes?: string;
};

export type UpdateWorkoutSessionInput = {
    id: WorkoutSession["id"];
    sessionName?: string;
    sessionDate?: string;
    startTime?: string;
    endTime?: string;
    durationSeconds?: number;
    energyRating?: number;
    difficultyRating?: number;
    notes?: string;
    status?: WorkoutSession["status"];
};

export type CompleteWorkoutSessionInput = {
    id: WorkoutSession["id"];
    endTime: string;
    durationSeconds: number;
    energyRating?: number;
    difficultyRating?: number;
    notes?: string;
};

export type WorkoutSessionRepository = {
    create(input: CreateWorkoutSessionInput): Promise<WorkoutSession>;
    update(input: UpdateWorkoutSessionInput): Promise<WorkoutSession>;
    complete(input: CompleteWorkoutSessionInput): Promise<WorkoutSession>;
    discard(id: WorkoutSession["id"]): Promise<void>;
    hardDelete(id: WorkoutSession["id"]): Promise<void>;
    findById(id: WorkoutSession["id"]): Promise<WorkoutSession | null>;
    findInProgressByUserId(userId: User["id"]): Promise<WorkoutSession | null>;
    listCompletedByUserId(userId: User["id"]): Promise<WorkoutSession[]>;
    listByWorkoutPlanId(workoutPlanId: WorkoutPlan["id"]): Promise<WorkoutSession[]>;
};