import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { 
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
 } from 'react-native';

import { WorkoutPlanForm } from '../../components/workoutPlan/WorkoutPlanForm';
import type { WorkoutPlanFormValues } from '../../components/workoutPlan/WorkoutPlanForm';
import type { WorkoutType } from '../../src/core/domain/models/workoutType';
import { createWorkoutPlanTemplateService } from '../../src/core/domain/services/workoutPlanTemplateService';
import { sqliteWorkoutPlanRepository } from '../../src/core/data/repositories/workoutPlan/sqliteWorkoutPlanRepository';
import { sqlitePlanExerciseRepository } from '../../src/core/data/repositories/planExercise/sqlitePlanExerciseRepository';
import { sqliteWorkoutTypeRepository } from '../../src/core/data/repositories/workoutType/sqliteWorkoutTypeRepository';
import { formStyles } from '../../constants/formStyles';
import { globalStyles as styles } from '../../constants/styles';

const MVP_USER_ID = 1;

const workoutPlanTemplateService = createWorkoutPlanTemplateService(
    sqliteWorkoutPlanRepository,
    sqlitePlanExerciseRepository
);

export default function CreateWorkoutPlanScreen() {
    const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadWorkoutTypes = useCallback(async () => {
        const activeWorkoutTypes = 
            await sqliteWorkoutTypeRepository.listActiveForUser(MVP_USER_ID);

        setWorkoutTypes(activeWorkoutTypes);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadWorkoutTypes();
        }, [loadWorkoutTypes])
    );

    async function handleSubmit(values: WorkoutPlanFormValues) {
        setErrorMessage(null);

        try {
            await workoutPlanTemplateService.createWorkoutPlanTemplate({
                userId: MVP_USER_ID,
                name: values.name,
                description: values.description,
                workoutDay: values.workoutDay,
                goal: values.goal,
                workoutTypeId: values.workoutTypeId,
            });
            
            router.back();
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to create workout plan.");
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={120}
        >
            <ScrollView style={styles.screen}>
                <WorkoutPlanForm 
                    initialValues={{}}
                    workoutTypes={workoutTypes}
                    submitLabel="Create Workout Plan"
                    onSubmit={handleSubmit} 
                />
                {errorMessage ? (
                    <Text style={formStyles.errorText}>{errorMessage}</Text>
                ) : null}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
