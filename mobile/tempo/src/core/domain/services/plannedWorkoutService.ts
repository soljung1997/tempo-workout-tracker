import type { PlannedWorkout } from "../models/plannedWorkout";
import type { 
    CreatePlannedWorkoutInput, 
    UpdatePlannedWorkoutInput,
    ListActiveByDateInput,
    ListActiveByDateRangeInput,
    PlannedWorkoutRepository
} from "../../data/repositories/plannedWorkout/plannedWorkoutRepository";

import type { User } from "../models/user";

export type PlannedWorkoutService = {
    scheduleWorkoutPlan(input: CreatePlannedWorkoutInput): Promise<PlannedWorkout>;
    updatePlannedWorkout(input: UpdatePlannedWorkoutInput): Promise<PlannedWorkout>;
    cancelPlannedWorkout(id: PlannedWorkout["id"]): Promise<PlannedWorkout>;
    getPlannedWorkoutById(id: PlannedWorkout["id"]): Promise<PlannedWorkout | null>;
    listPlannedWorkoutsForUser(id: User["id"]): Promise<PlannedWorkout[]>;
    listPlannedWorkoutsForDate(input: ListActiveByDateInput): Promise<PlannedWorkout[]>;
    listPlannedWorkoutsForDateRange(input: ListActiveByDateRangeInput): Promise<PlannedWorkout[]>;
};

export function createPlannedWorkoutService(
    plannedWorkoutRepository: PlannedWorkoutRepository
): PlannedWorkoutService {
    return {
        async scheduleWorkoutPlan(input) {
            return plannedWorkoutRepository.create(input);
        },

        async updatePlannedWorkout(input) {
            return plannedWorkoutRepository.update(input);
        },

        async cancelPlannedWorkout(id) {
            return plannedWorkoutRepository.update({
                id,
                status: "cancelled",
            });
        },

        async getPlannedWorkoutById(id) {
            return plannedWorkoutRepository.findById(id);
        },

        async listPlannedWorkoutsForUser(id) {
            return plannedWorkoutRepository.listActiveByUserId(id);
        },

        async listPlannedWorkoutsForDate(input) {
            return plannedWorkoutRepository.listActiveByDate(input);
        },

        async listPlannedWorkoutsForDateRange(input) {
            return plannedWorkoutRepository.listActiveByDateRange(input);
        },
    };
}