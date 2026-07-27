import {
    ActivityIndicator,
    View,
    Text,
    Pressable,
    FlatList,
} from "react-native";
import { globalStyles as styles, theme } from "../../constants/styles";
import type { WorkoutPlan } from "@/src/core/domain/models/workoutPlan";
import type { PlanExercise } from "@/src/core/domain/models/planExercise";
import type { Exercise } from "@/src/core/domain/models/exercise";
import { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams, Stack } from "expo-router";
import { createWorkoutPlanTemplateService } from "@/src/core/domain/services/workoutPlanTemplateService";
import { sqlitePlanExerciseRepository } from "@/src/core/data/repositories/planExercise/sqlitePlanExerciseRepository";
import { sqliteWorkoutPlanRepository } from "@/src/core/data/repositories/workoutPlan/sqliteWorkoutPlanRepository";
import { sqliteExerciseRepository } from "@/src/core/data/repositories/exercise/sqliteExerciseRepository";
import { screenStyles } from "@/constants/screenStyles";
import { createExerciseService } from "@/src/core/domain/services/exerciseTemplateService";

const workoutPlanTemplateService = createWorkoutPlanTemplateService(
    sqliteWorkoutPlanRepository,
    sqlitePlanExerciseRepository
);

const exerciseService = createExerciseService(sqliteExerciseRepository);

export default function WorkoutPlanDetailsScreen() {
    const { workoutPlanId } = useLocalSearchParams<{ workoutPlanId: string }>();

    const parsedWorkoutPlanId = Number(workoutPlanId);

    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [planExercises, setPlanExercises] = useState<PlanExercise[]>([]);
    const [exercisesById, setExercisesById] = useState<Record<number, Exercise>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadWorkoutPlan = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const workoutPlan = await workoutPlanTemplateService.getWorkoutPlanTemplateById(parsedWorkoutPlanId);
            const planExercises = await workoutPlanTemplateService.listPlanExercisesForWorkoutPlan(parsedWorkoutPlanId);
            
            const exercises = await Promise.all(
                planExercises.map((planExercise) => {
                    return exerciseService.findExerciseById(planExercise.exerciseId);
                })
            );

            const nextExerciseByid: Record<number, Exercise> = {};
            exercises.forEach((exercise) => {
                if (exercise) {
                    nextExerciseByid[exercise.id] = exercise;
                }
            });
            setExercisesById(nextExerciseByid);
            setWorkoutPlan(workoutPlan);
            setPlanExercises(planExercises);
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to load workout plan.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadWorkoutPlan();
        }, [loadWorkoutPlan])
    );
  return (
    <>
        <Stack.Screen options={{ title: workoutPlan?.name ?? "Workout Plan" }} />
        <View style={styles.screen}>
            <View style={screenStyles.header}>
                <View>
                    <Text style={styles.title}>{workoutPlan?.name ?? "Workout Plan"}</Text>
                    <Text style={styles.subtitle}>Review this template before editing exercises.</Text>
                </View>
            </View>
        

        {isLoading ? (
            <View style={screenStyles.centerState}>
                <ActivityIndicator color={theme.colors.primary}/>
                <Text style={screenStyles.stateText}>Loading plan...</Text>
            </View>
        ) : errorMessage ? (
            <View style={screenStyles.centerState}>
                <Text style={screenStyles.errorText}>{errorMessage}</Text>
                <Pressable style={screenStyles.secondaryButton} onPress={loadWorkoutPlan}>
                    <Text style={screenStyles.secondaryButtonText}>Retry</Text>
                </Pressable>
            </View>
        ) : (
            <View style={screenStyles.detailContent}>
                <View style={screenStyles.emptyCard}>
                    <Text style={screenStyles.emptyTitle}>{workoutPlan?.name}</Text>
                    <Text style={screenStyles.emptyText}>
                        {workoutPlan?.description ?? "No description added yet."}
                    </Text>
                    <View style={screenStyles.metadataRow}>
                        <MetadataPill label={workoutPlan?.workoutDay ?? "No day"} />
                        <MetadataPill label={workoutPlan?.goal ?? "No goal"} />
                    </View>
                </View>

                <View style={screenStyles.sectionHeader}>
                    <Text style={screenStyles.sectionTitle}>Exercises</Text>
                    <Text style={screenStyles.sectionSubtitle}>
                        {planExercises.length} planned
                    </Text>
                </View>

                <FlatList
                    data={planExercises}
                    keyExtractor={(exercise) => exercise.id.toString()}
                    contentContainerStyle={screenStyles.listContent}
                    renderItem={({ item }) => (
                        <PlanExerciseCard 
                            planExercise={item}
                            exercise={exercisesById[item.exerciseId]} 
                        />
                    )}
                    ListEmptyComponent={
                        <View style={screenStyles.emptyCard}>
                            <Text style={screenStyles.emptyTitle}>No exercises yet</Text>
                            <Text style={screenStyles.emptyText}>
                                Add exercises to this plan in the next step.
                            </Text>
                        </View>
                    }
                />
            </View>
        )}
        </View>
    </>
  );
}

function PlanExerciseCard({
    planExercise,
    exercise,
}: {
    planExercise: PlanExercise;
    exercise: Exercise | undefined;
}) {
    return (
        <Pressable style={screenStyles.planCard}>
            <View style={screenStyles.planCardHeader}>
                <Text style={screenStyles.planName}>
                    {exercise?.name?? `Exercise #${planExercise.exerciseId}`}
                </Text>
                <Text style={screenStyles.openText}>Edit</Text>
            </View>

            <View style={screenStyles.metadataRow}>
                <MetadataPill label={`${planExercise.targetSets ?? "-"} sets`} />
                <MetadataPill label={`${planExercise.targetReps ?? "-"} reps`} />
                <MetadataPill label={`${planExercise.targetRestSeconds ?? "-"} sec rest`} />
            </View>
        </Pressable>
    );
}

function MetadataPill({ label }: { label: string }) {
    return (
        <View style={screenStyles.metadataPill}>
            <Text style={screenStyles.metadataText}>{label}</Text>
        </View>
    );
}
