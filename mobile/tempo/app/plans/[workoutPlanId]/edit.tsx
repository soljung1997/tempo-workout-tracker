import { useCallback, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { 
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView, 

} from 'react-native';

import { WorkoutPlanForm } from '../../../components/workoutPlan/WorkoutPlanForm';
import type { WorkoutPlanFormValues } from '../../../components/workoutPlan/WorkoutPlanForm';
import type { WorkoutType } from '../../../src/core/domain/models/workoutType';
import type { WorkoutPlan } from '../../../src/core/domain/models/workoutPlan';
import { createWorkoutPlanTemplateService } from '../../../src/core/domain/services/workoutPlanTemplateService';
import { sqliteWorkoutPlanRepository } from '../../../src/core/data/repositories/workoutPlan/sqliteWorkoutPlanRepository';
import { sqlitePlanExerciseRepository } from '../../../src/core/data/repositories/planExercise/sqlitePlanExerciseRepository';
import { sqliteWorkoutTypeRepository } from '../../../src/core/data/repositories/workoutType/sqliteWorkoutTypeRepository';
import { formStyles } from '../../../constants/formStyles';
import { globalStyles as styles } from '../../../constants/styles';

const MVP_USER_ID = 1;

const workoutPlanTemplateService = createWorkoutPlanTemplateService(
    sqliteWorkoutPlanRepository,
    sqlitePlanExerciseRepository
);

export default function UpdateWorkoutPlanScreen() {
    const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const { workoutPlanId } = useLocalSearchParams<{ workoutPlanId: string }>();
    const parsedWorkoutPlanId = Number(workoutPlanId);

    const loadFormData = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const [activeWorkoutTypes, existingWorkoutPlan] = await Promise.all([
                sqliteWorkoutTypeRepository.listActiveForUser(MVP_USER_ID),
                workoutPlanTemplateService.getWorkoutPlanTemplateById(parsedWorkoutPlanId),
            ]);
            setWorkoutTypes(activeWorkoutTypes);
            setWorkoutPlan(existingWorkoutPlan);
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to load workout plan.");
        } finally {
            setIsLoading(false);
        }
    }, [parsedWorkoutPlanId]);

    useFocusEffect(
        useCallback(() => {
            loadFormData();
        }, [loadFormData])
    );

    async function handleSubmit(values: WorkoutPlanFormValues) {
        setErrorMessage(null);
        try {
            await workoutPlanTemplateService.updateWorkoutPlanTemplate({
                id: parsedWorkoutPlanId,
                name: values.name,
                description: values.description,
                workoutDay: values.workoutDay,
                goal: values.goal,
                workoutTypeId: values.workoutTypeId,
            });
            
            router.back();
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to update workout plan.");
        }
    }

    if (isLoading) {
        return <Text>Loading workout plan...</Text>
    }

    if (!workoutPlan) {
        return <Text style={formStyles.errorText}>Workout plan not found.</Text>
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
                <WorkoutPlanForm 
                    initialValues={{
                        name: workoutPlan.name,
                        description: workoutPlan.description,
                        workoutDay: workoutPlan.workoutDay,
                        goal: workoutPlan.goal,
                        workoutTypeId: workoutPlan.workoutTypeId,
                    }}
                    workoutTypes={workoutTypes}
                    submitLabel="Update Workout Plan"
                    onSubmit={handleSubmit} 
                />
                {errorMessage ? (
                    <Text style={formStyles.errorText}>{errorMessage}</Text>
                ) : null}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
