import type { WorkoutPlan } from "../models/workoutPlan";
import type { PlanExercise } from "../models/planExercise";
import type {
    CreateWorkoutPlanInput,
    UpdateWorkoutPlanInput,
    WorkoutPlanRepository,
} from "../../data/repositories/workoutPlan/workoutPlanRepository";
import type {
    CreatePlanExerciseInput,
    UpdatePlanExerciseInput,
    PlanExerciseRepository,
} from "../../data/repositories/planExercise/planExerciseRepository";

export type WorkoutPlanTemplateService = {
    createWorkoutPlanTemplate(input: CreateWorkoutPlanInput): Promise<WorkoutPlan>;
    updateWorkoutPlanTemplate(input: UpdateWorkoutPlanInput): Promise<WorkoutPlan>;
    deleteWorkoutPlanTemplate(id: WorkoutPlan["id"]): Promise<void>;
    getWorkoutPlanTemplateById(id: WorkoutPlan["id"]): Promise<WorkoutPlan | null>;
    listWorkoutPlanTemplates(userId: WorkoutPlan["userId"]): Promise<WorkoutPlan[]>;
    listAllPlanExercisesForWorkoutPlan(workoutPlanId: WorkoutPlan["id"]): Promise<PlanExercise[]>;
    addExerciseToWorkoutPlan(input: CreatePlanExerciseInput): Promise<PlanExercise>;
    updatePlanExercise(input: UpdatePlanExerciseInput): Promise<PlanExercise>;
    findPlanExerciseById(id: PlanExercise["id"]): Promise<PlanExercise | null>;
    listPlanExercisesForWorkoutPlan(workoutPlanId: WorkoutPlan["id"]): Promise<PlanExercise[]>;
    removeExerciseFromWorkoutPlan(workoutPlanId: WorkoutPlan["id"], id: PlanExercise["id"]): Promise<void>;
    reorderPlanExercises(
        workoutPlanId: WorkoutPlan["id"],
        orderedPlanExerciseIds: PlanExercise["id"][]
    ): Promise<PlanExercise[]>;
};

export function createWorkoutPlanTemplateService(
    workoutPlanRepository: WorkoutPlanRepository,
    planExerciseRepository: PlanExerciseRepository
): WorkoutPlanTemplateService {
    return {
        async createWorkoutPlanTemplate(input) {
            return workoutPlanRepository.create(input);
        },

        async updateWorkoutPlanTemplate(input) {
            return workoutPlanRepository.update(input);
        },

        async deleteWorkoutPlanTemplate(id) {
            return workoutPlanRepository.softDelete(id);
        },

        async getWorkoutPlanTemplateById(id) {
            return workoutPlanRepository.findById(id);
        },

        async listWorkoutPlanTemplates(userId) {
            return workoutPlanRepository.listActiveByUserId(userId);
        },

        async addExerciseToWorkoutPlan(input) {
            return planExerciseRepository.create(input);
        },

        async updatePlanExercise(input) {
            return planExerciseRepository.update(input);
        },

        async findPlanExerciseById(id) {
            return planExerciseRepository.findById(id);
        },

        async listPlanExercisesForWorkoutPlan(workoutPlanId) {
            return planExerciseRepository.listActiveByWorkoutPlanId(workoutPlanId);
        },

        async listAllPlanExercisesForWorkoutPlan(workoutPlanId) {
            return planExerciseRepository.listAllByWorkoutPlanId(workoutPlanId);
        },

        async removeExerciseFromWorkoutPlan(workoutPlanId, id) {
            await planExerciseRepository.softDelete(id);

            const activePlanExercises = await planExerciseRepository.listActiveByWorkoutPlanId(workoutPlanId);

            for (let index = 0; index < activePlanExercises.length; index++) {
                await planExerciseRepository.update({
                    id: activePlanExercises[index].id,
                    orderIndex: index,
                });
            }
        },

        async reorderPlanExercises(workoutPlanId, orderedPlanExerciseIds) {
            const existingPlanExercises = await planExerciseRepository.listActiveByWorkoutPlanId(workoutPlanId);

            const existingIds = new Set(existingPlanExercises.map((planExercise) => planExercise.id));

            const allIdsBelongToWorkoutPlan = orderedPlanExerciseIds.every((id) => {
                return existingIds.has(id);
            });

            if (!allIdsBelongToWorkoutPlan) {
                throw new Error("Cannot reorder exercises that do not belong to this workout plan");
            }

            const allActiveIdsWereIncluded = orderedPlanExerciseIds.length === existingPlanExercises.length;

            if (!allActiveIdsWereIncluded) {
                throw new Error("Cannot reorder with missing active exercises");
            }

            for (let index = 0; index < orderedPlanExerciseIds.length; index++) {
                await planExerciseRepository.update({
                    id: orderedPlanExerciseIds[index],
                    orderIndex: -(index + 1),
                });
            }

            const updatedPlanExercises = [];

            for (let index = 0; index < orderedPlanExerciseIds.length; index++) {
                const updatedPlanExercise = await planExerciseRepository.update({
                    id: orderedPlanExerciseIds[index],
                    orderIndex: index,
                });

                updatedPlanExercises.push(updatedPlanExercise);
            }

            return updatedPlanExercises;
        },
    };
}
