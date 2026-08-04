import { useCallback, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
    ScrollView,
} from "react-native";

import { globalStyles as styles, theme } from "@/constants/styles";
import { formStyles } from "@/constants/formStyles";
import { screenStyles } from "@/constants/screenStyles";
import type { PlanExercise } from "@/src/core/domain/models/planExercise";
import type { Exercise } from "@/src/core/domain/models/exercise";
import { createWorkoutPlanTemplateService } from "@/src/core/domain/services/workoutPlanTemplateService";
import { createExerciseService } from "@/src/core/domain/services/exerciseTemplateService";
import { sqliteWorkoutPlanRepository } from "@/src/core/data/repositories/workoutPlan/sqliteWorkoutPlanRepository";
import { sqlitePlanExerciseRepository } from "@/src/core/data/repositories/planExercise/sqlitePlanExerciseRepository";
import { sqliteExerciseRepository } from "@/src/core/data/repositories/exercise/sqliteExerciseRepository";

const workoutPlanTemplateService = createWorkoutPlanTemplateService(
    sqliteWorkoutPlanRepository,
    sqlitePlanExerciseRepository
);

const exerciseService = createExerciseService(sqliteExerciseRepository);

export default function EditPlanExerciseScreen() {
    const { workoutPlanId ,planExerciseId } = useLocalSearchParams<{
        workoutPlanId: string;
        planExerciseId: string 
    }>();
    const parsedPlanExerciseId = Number(planExerciseId);
    const parsedWorkoutPlanId = Number(workoutPlanId);

    const [planExercise, setPlanExercise] = useState<PlanExercise | null>(null);
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [targetSets, setTargetSets] = useState("");
    const [targetReps, setTargetReps] = useState("");
    const [targetWeight, setTargetWeight] = useState("");
    const [targetRestSeconds, setTargetRestSeconds] = useState("");
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadPlanExercise = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const existingPlanExercise =
                await workoutPlanTemplateService.findPlanExerciseById(parsedPlanExerciseId);

            if (!existingPlanExercise) {
                setPlanExercise(null);
                return;
            }

            const existingExercise =
                await exerciseService.findExerciseById(existingPlanExercise.exerciseId);

            setPlanExercise(existingPlanExercise);
            setExercise(existingExercise);
            setTargetSets(existingPlanExercise.targetSets?.toString() ?? "");
            setTargetReps(existingPlanExercise.targetReps?.toString() ?? "");
            setTargetWeight(existingPlanExercise.targetWeight?.toString() ?? "");
            setTargetRestSeconds(existingPlanExercise.targetRestSeconds?.toString() ?? "");
            setNotes(existingPlanExercise.notes ?? "");
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to load planned exercise.");
        } finally {
            setIsLoading(false);
        }
    }, [parsedPlanExerciseId]);

    useFocusEffect(
        useCallback(() => {
            loadPlanExercise();
        }, [loadPlanExercise])
    );

    async function handleSubmit() {
        if (!planExercise) {
            return;
        }

        setErrorMessage(null);

        try {
            await workoutPlanTemplateService.updatePlanExercise({
                id: planExercise.id,
                targetSets: parseOptionalNumber(targetSets),
                targetReps: parseOptionalNumber(targetReps),
                targetWeight: parseOptionalNumber(targetWeight),
                targetRestSeconds: parseOptionalNumber(targetRestSeconds),
                notes: notes.trim() || undefined,
            });

            router.back();
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to update planned exercise.");
        }
    }

    async function handleRemove() {
        if (!planExercise) {
            return;
        }

        setErrorMessage(null);
        
        try {
            await workoutPlanTemplateService.removeExerciseFromWorkoutPlan(
                parsedWorkoutPlanId, parsedPlanExerciseId
            );
            router.back();
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to remove planned exercise.");
        }
    }

    if (isLoading) {
        return (
            <View style={styles.screen}>
                <View style={screenStyles.centerState}>
                    <ActivityIndicator color={theme.colors.primary} />
                    <Text style={screenStyles.stateText}>Loading exercise...</Text>
                </View>
            </View>
        );
    }

    if (!planExercise) {
        return (
            <View style={styles.screen}>
                <View style={screenStyles.centerState}>
                    <Text style={screenStyles.errorText}>Planned exercise not found.</Text>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={120}
        >
            <ScrollView 
            style={styles.screen}
            contentContainerStyle={formStyles.scrollContent}
            keyboardShouldPersistTaps="handled">
                <View style={screenStyles.header}>
                    <View>
                        <Text style={styles.title}>
                            {exercise?.name ?? `Exercise #${planExercise.exerciseId}`}
                        </Text>
                        <Text style={styles.subtitle}>
                            Update targets for this workout plan.
                        </Text>
                    </View>
                </View>

                <View style={formStyles.form}>
                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Target Sets</Text>
                        <TextInput
                            value={targetSets}
                            onChangeText={setTargetSets}
                            placeholder="Example: 3"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="numeric"
                            style={formStyles.input}
                        />
                    </View>

                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Target Reps</Text>
                        <TextInput
                            value={targetReps}
                            onChangeText={setTargetReps}
                            placeholder="Example: 10"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="numeric"
                            style={formStyles.input}
                        />
                    </View>

                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Target Weight</Text>
                        <TextInput
                            value={targetWeight}
                            onChangeText={setTargetWeight}
                            placeholder="Example: 135"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="numeric"
                            style={formStyles.input}
                        />
                    </View>

                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Rest Seconds</Text>
                        <TextInput
                            value={targetRestSeconds}
                            onChangeText={setTargetRestSeconds}
                            placeholder="Example: 90"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="numeric"
                            style={formStyles.input}
                        />
                    </View>

                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Notes</Text>
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Optional notes"
                            placeholderTextColor={theme.colors.textMuted}
                            style={[formStyles.input, formStyles.multilineInput]}
                            multiline
                        />
                    </View>

                    {errorMessage ? (
                        <Text style={formStyles.errorText}>{errorMessage}</Text>
                    ) : null}

                    <Pressable style={formStyles.submitButton} onPress={handleSubmit}>
                        <Text style={formStyles.submitButtonText}>Update Exercise</Text>
                    </Pressable>

                    <Pressable style={screenStyles.secondaryButton} onPress={handleRemove}>
                        <Text style={screenStyles.secondaryButtonText}>Remove Exercise</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function parseOptionalNumber(value: string): number | undefined {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return undefined;
    }

    const parsedValue = Number(trimmedValue);

    if (Number.isNaN(parsedValue)) {
        return undefined;
    }

    return parsedValue;
}