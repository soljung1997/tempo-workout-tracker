import { useEffect, useState } from "react";

import { 
    router, 
    useLocalSearchParams,
} from "expo-router";

import { 
    ActivityIndicator,
    Pressable,
    ScrollView, 
    Text, 
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import { 
    globalStyles as styles, 
    theme, 
} from "../constants/styles";
import { screenStyles } from "../constants/screenStyles";
import { formStyles } from "../constants/formStyles";

import type { WorkoutPlan } from "../src/core/domain/models/workoutPlan";

import { createWorkoutPlanTemplateService } from "../src/core/domain/services/workoutPlanTemplateService";

import { createPlannedWorkoutService } from "../src/core/domain/services/plannedWorkoutService";

import { sqliteWorkoutPlanRepository } from "../src/core/data/repositories/workoutPlan/sqliteWorkoutPlanRepository";

import {sqlitePlanExerciseRepository } from "../src/core/data/repositories/planExercise/sqlitePlanExerciseRepository";

import { sqlitePlannedWorkoutRepository } from "../src/core/data/repositories/plannedWorkout/sqlitePlannedWorkoutRepository";

import {
    formatLocalDateKey,
    parseLocalDateKey,
} from "../src/core/utils/calendarDates";

import { CalendarHeader } from "../components/calendar/CalendarHeader";
import { WeekdayHeader } from "../components/calendar/WeekdayHeader";
import { MonthGrid } from "../components/calendar/MonthGrid";

const MVP_USER_ID = 1;

const workoutPlanTemplateService = 
    createWorkoutPlanTemplateService(
        sqliteWorkoutPlanRepository,
        sqlitePlanExerciseRepository,
    );

const plannedWorkoutService = 
    createPlannedWorkoutService(
        sqlitePlannedWorkoutRepository,
    );

export default function PlannedWorkoutScreen() {
    const { date: routeDate, plannedWorkoutId, } = useLocalSearchParams<{
        date?: string;
        plannedWorkoutId?: string;
    }>();

    const initialDate = routeDate
        ? parseLocalDateKey(routeDate)
        : new Date();

    const [selectedDate, setSelectedDate] = 
        useState(initialDate);
    
    const [visibleMonth, setVisibleMonth] = 
        useState(
            new Date(
                initialDate.getFullYear(),
                initialDate.getMonth(),
                1,
            ),
        );

    const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);

    const [notes, setNotes] = useState("");

    const [
        selectedWorkoutPlanId,
        setSelectedWorkoutPlanId,
    ] = useState<number | null>(null);

    const isEditing = Boolean(plannedWorkoutId);

    const screenTitle = isEditing 
        ? "Edit Planned Workout" :
        "Schedule Workout";

    const submitLabel = isEditing
        ? "Save Changes" :
        "Schedule Workout";

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [errorMessage, setErrorMessage] = useState<
        string | null
    >(null);

    function changeMonth(amount: number) {
        setVisibleMonth((currentMonth) => {
            return new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + amount,
                1,
            );
        });
    }

    useEffect(() => {
        async function loadWorkoutPlans() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const activePlans = await workoutPlanTemplateService.listWorkoutPlanTemplates(MVP_USER_ID);

                setWorkoutPlans(activePlans);

                if(plannedWorkoutId) {
                    const id = Number(plannedWorkoutId);

                    if (Number.isNaN(id)) {
                        setErrorMessage("Invalid planned workout.");
                        return;
                    }

                    const existingWorkout = await plannedWorkoutService.getPlannedWorkoutById(id);

                    if(!existingWorkout) {
                        setErrorMessage("Planned workout not found.");
                        return;
                    }

                    const existingDate = parseLocalDateKey(
                        existingWorkout.plannedDate,
                    );

                    setSelectedWorkoutPlanId(
                        existingWorkout.workoutPlanId
                    );

                    setSelectedDate(existingDate);

                    setNotes(existingWorkout.notes ?? "");

                    setVisibleMonth(
                        new Date(
                            existingDate.getFullYear(),
                            existingDate.getMonth(),
                            1,
                        ),
                    );
                }
            } catch (error) {
                console.error(error);
                setErrorMessage("Unable to load planned workout. ");
            } finally {
                setIsLoading(false);
            }
        }

        loadWorkoutPlans();
    }, [plannedWorkoutId]);

    async function handleScheduleWorkout() {
        const plannedDate = formatLocalDateKey(selectedDate);
        
        if (selectedWorkoutPlanId === null) {
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        try{
            if(isEditing) {
                await plannedWorkoutService.updatePlannedWorkout({
                    id: Number(plannedWorkoutId),
                    workoutPlanId: selectedWorkoutPlanId,
                    plannedDate: plannedDate,
                    notes: notes.trim(),
                });
            } else {
                await plannedWorkoutService.scheduleWorkoutPlan({
                    userId: MVP_USER_ID,
                    workoutPlanId: selectedWorkoutPlanId,
                    plannedDate: plannedDate,
                    status: "planned",
                    notes: notes.trim() || undefined, 
                });
            }

            router.back();
        } catch (error) {
            console.error(error);
            setErrorMessage(
                isEditing
                    ? "Unable to update planned workout."
                    : "Unable to schedule workout.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function handleCancelPlannedWorkout() {
        if(!plannedWorkoutId) {
            return;
        }

        const id = Number(plannedWorkoutId);

        if(Number.isNaN(id)) {
            setErrorMessage("Invalid Planned Workout.");
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        try {
            await plannedWorkoutService.cancelPlannedWorkout(id);

            router.back();
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to cancel planned workout. ");
        } finally {
            setIsSaving(false);
        }
    }

    const canSchedule = selectedWorkoutPlanId !== null && !isSaving;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={
                Platform.OS === "ios" ? "padding" : "height"
            }
            keyboardVerticalOffset={100}
        >
            <ScrollView
                style={styles.screen}
                contentContainerStyle={[
                    formStyles.form,
                    formStyles.scrollContent,
                ]}
                keyboardShouldPersistTaps="handled"
            >
                <View>
                    <Text style={styles.title}>
                        {screenTitle}
                    </Text>
                </View>

                <CalendarHeader
                    visibleMonth={visibleMonth}
                    onPreviousMonth={() => changeMonth(-1)}
                    onNextMonth={() => changeMonth(1)}
                />

                <WeekdayHeader/>

                <MonthGrid
                    visibleMonth={visibleMonth}
                    selectedDate={selectedDate}
                    plannedWorkouts={[]}
                    onSelectDate={setSelectedDate}
                />

                <Text style={styles.subtitle}>
                    Selected date:{" "}
                    {selectedDate.toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </Text>

                {isLoading ? (
                    <ActivityIndicator color={theme.colors.primary}/>
                ): errorMessage && workoutPlans.length === 0 ? (
                    <Text style={formStyles.errorText}>
                        {errorMessage}
                    </Text>
                ): workoutPlans.length === 0 ? (
                    <View style={screenStyles.emptyCard}>
                        <Text style={screenStyles.emptyTitle}>
                            No Workout Plans Yet
                        </Text>

                        <Text style={screenStyles.emptyText}>
                            Create a workout plan before scheduling a workout.
                        </Text>
                    </View>
                ): (
                    <View style={formStyles.field}>
                        <Text style={formStyles.label}>
                            Workout plan
                        </Text>

                        <View style={formStyles.dayOptions}>
                            {workoutPlans.map((plan) => {
                                const isSelected = selectedWorkoutPlanId === plan.id;

                                return(
                                    <Pressable
                                        key={plan.id}
                                        style={[
                                            formStyles.dayChip,
                                            isSelected && formStyles.dayChipSelected,
                                        ]}
                                        onPress={() => 
                                            setSelectedWorkoutPlanId(plan.id)
                                        }
                                        accessibilityRole="radio"
                                        accessibilityLabel={plan.name}
                                        accessibilityState={{
                                            selected:isSelected,
                                        }}
                                    >
                                        <Text 
                                            style={[
                                                formStyles.dayChipText,
                                                isSelected &&
                                                formStyles.dayChipTextSelected,
                                            ]}
                                        >
                                            {plan.name}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                )}

                {errorMessage && workoutPlans.length > 0 ? (
                    <Text style={formStyles.errorText}>
                        {errorMessage}
                    </Text>
                ): null}

                <View style={formStyles.field}>
                    <Text style={formStyles.label}>
                        Notes
                    </Text>

                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Add optional Notes"
                        placeholderTextColor={theme.colors.textMuted}
                        style={[
                            formStyles.input,
                            formStyles.multilineInput,
                        ]}
                        multiline
                    />
                </View>

                <Pressable
                    style={[
                        formStyles.submitButton,
                        !canSchedule && formStyles.submitButtonDisabled,
                    ]}
                    onPress={handleScheduleWorkout}
                    disabled={!canSchedule}
                    accessibilityRole="button"
                    accessibilityState={{
                        disabled: !canSchedule,
                    }}
                >
                    <Text style={formStyles.submitButtonText}>
                        {isSaving
                            ? "Saving..."
                            : submitLabel}
                    </Text>
                </Pressable>
                
                {isEditing ? (
                    <Pressable
                        style={screenStyles.deleteButton}
                        onPress={handleCancelPlannedWorkout}
                        disabled={isSaving}
                        accessibilityRole="button"
                        accessibilityLabel="Cancel planned Workout"
                    >
                            <Text style={screenStyles.deleteButtonText}>
                                Cancel Planned Workout
                            </Text>
                    </Pressable>                    
                ) : null}


                <Pressable
                    style={screenStyles.secondaryButton}
                    onPress={() => router.back()}
                    disabled={isSaving}
                >
                    <Text style={screenStyles.secondaryButtonText}>
                        Cancel
                    </Text>
                </Pressable>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}