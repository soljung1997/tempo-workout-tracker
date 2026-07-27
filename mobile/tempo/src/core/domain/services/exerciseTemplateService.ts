import type { Exercise } from "../models/exercise";
import type { ExerciseRepository } from "../../data/repositories/exercise/exerciseRepository";

export type ExerciseService = {
    findExerciseById(id: Exercise["id"]): Promise<Exercise | null>;
};

export function createExerciseService(
    exerciseRepository: ExerciseRepository
): ExerciseService {
    return {
        async findExerciseById(id) {
            return exerciseRepository.findById(id);
        },
    };
}