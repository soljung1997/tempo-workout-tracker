import { useCallback, useState, useRef } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { globalStyles as styles, theme } from "@/constants/styles";
import { formStyles } from "@/constants/formStyles";
import { screenStyles } from "@/constants/screenStyles";
import type { Exercise } from "@/src/core/domain/models/exercise";
import { createWorkoutPlanTemplateService } from "@/src/core/domain/services/workoutPlanTemplateService";
import { sqliteWorkoutPlanRepository } from "@/src/core/data/repositories/workoutPlan/sqliteWorkoutPlanRepository";
import { sqlitePlanExerciseRepository } from "@/src/core/data/repositories/planExercise/sqlitePlanExerciseRepository";
import { sqliteExerciseRepository } from "@/src/core/data/repositories/exercise/sqliteExerciseRepository";

const MVP_USER_ID = 1;

const workoutPlanTemplateService = createWorkoutPlanTemplateService(
    sqliteWorkoutPlanRepository,
    sqlitePlanExerciseRepository
);

export default function AddExerciseToWorkoutPlanScreen() {
    const { workoutPlanId } = useLocalSearchParams<{ workoutPlanId: string }>();
    const parsedWorkoutPlanId = Number(workoutPlanId);

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<Exercise["id"] | null>(null);
    const [targetSets, setTargetSets] = useState("");
    const [targetReps, setTargetReps] = useState("");
    const [targetWeight, setTargetWeight] = useState("");
    const [targetRestSeconds, setTargetRestSeconds] = useState("");
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const targetRepsInputRef = useRef<TextInput>(null);
    const targetWeightInputRef = useRef<TextInput>(null);
    const restSecondsInputRef = useRef<TextInput>(null);
    const notesInputRef = useRef<TextInput>(null);

    const loadExercises = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const activeExercises =
                await sqliteExerciseRepository.listActiveByUserId(MVP_USER_ID);

            setExercises(activeExercises);
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to load exercises.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadExercises();
        }, [loadExercises])
    );

    async function handleSubmit() {
        if (!selectedExerciseId) {
            setErrorMessage("Select an exercise first.");
            return;
        }

        setErrorMessage(null);

        try {
            const allPlanExercises =
                await workoutPlanTemplateService.listAllPlanExercisesForWorkoutPlan(parsedWorkoutPlanId);

            const nextOrderIndex = allPlanExercises.length === 0 ? 0 : Math.max(...allPlanExercises.map((exercise) => exercise.orderIndex)) + 1;

            await workoutPlanTemplateService.addExerciseToWorkoutPlan({
                workoutPlanId: parsedWorkoutPlanId,
                exerciseId: selectedExerciseId,
                orderIndex: nextOrderIndex,
                targetSets: parseOptionalNumber(targetSets),
                targetReps: parseOptionalNumber(targetReps),
                targetWeight: parseOptionalNumber(targetWeight),
                targetRestSeconds: parseOptionalNumber(targetRestSeconds),
                notes: notes.trim() || undefined,
            });

            router.back();
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to add exercise to workout plan.");
        }
    }

    if (isLoading) {
        return (
            <View style={styles.screen}>
                <View style={screenStyles.centerState}>
                    <ActivityIndicator color={theme.colors.primary} />
                    <Text style={screenStyles.stateText}>Loading exercises...</Text>
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
                        <Text style={styles.title}>Add Exercise</Text>
                        <Text style={styles.subtitle}>
                            Choose an exercise and set target values.
                        </Text>
                    </View>
                </View>

                <View style={formStyles.form}>
                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Exercise</Text>
                        <View style={formStyles.exercisePickerContainer}>
                            <ScrollView
                                style={formStyles.exercisePickerList}
                                nestedScrollEnabled
                            >
                                {exercises.length === 0 ? (
                                    <View style={screenStyles.emptyCard}>
                                        <Text style={screenStyles.emptyTitle}>No exercises found</Text>
                                        <Text style={screenStyles.emptyText}>
                                            Add exercise library data before adding exercises to a plan.
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={formStyles.exercisePickerOptions}>
                                        {exercises.map((exercise) => (
                                    <Pressable
                                        key={exercise.id}
                                        style={[
                                            formStyles.dayChip,
                                            selectedExerciseId === exercise.id && formStyles.dayChipSelected,
                                        ]}
                                        onPress={() => setSelectedExerciseId(exercise.id)}
                                    >
                                        <Text
                                            style={[
                                                formStyles.dayChipText,
                                                selectedExerciseId === exercise.id &&
                                                    formStyles.dayChipTextSelected,
                                            ]}
                                        >
                                            {exercise.name}
                                        </Text>
                                    </Pressable>
                                        ))}
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                        
                    </View>

                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Target Sets</Text>
                        <TextInput
                            value={targetSets}
                            onChangeText={setTargetSets}
                            returnKeyType="next"
                            onSubmitEditing={() => targetRepsInputRef.current?.focus()}
                            blurOnSubmit={false}
                            placeholder="Example: 3"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="numeric"
                            style={formStyles.input}
                        />
                    </View>

                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Target Reps</Text>
                        <TextInput
                            ref={targetRepsInputRef}
                            value={targetReps}
                            onChangeText={setTargetReps}
                            returnKeyType="next"
                            onSubmitEditing={() => targetWeightInputRef.current?.focus()}
                            blurOnSubmit={false}
                            placeholder="Example: 10"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="numeric"
                            style={formStyles.input}
                        />
                    </View>

                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Target Weight</Text>
                        <TextInput
                            ref={targetWeightInputRef}
                            value={targetWeight}
                            onChangeText={setTargetWeight}
                            returnKeyType="next"
                            onSubmitEditing={() => restSecondsInputRef.current?.focus()}
                            blurOnSubmit={false}
                            placeholder="Example: 135"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="numeric"
                            style={formStyles.input}
                        />
                    </View>

                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Rest Seconds</Text>
                        <TextInput
                            ref={restSecondsInputRef}
                            value={targetRestSeconds}
                            onChangeText={setTargetRestSeconds}
                            returnKeyType="next"
                            onSubmitEditing={() => notesInputRef.current?.focus()}
                            blurOnSubmit={false}
                            placeholder="Example: 90"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="numeric"
                            style={formStyles.input}
                        />
                    </View>

                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>Notes</Text>
                        <TextInput
                            ref={notesInputRef}
                            value={notes}
                            onChangeText={setNotes}
                            returnKeyType="done"
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
                        <Text style={formStyles.submitButtonText}>Add Exercise</Text>
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
