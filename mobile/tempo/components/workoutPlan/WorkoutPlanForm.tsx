import { useState } from 'react';
import {
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { globalStyles as styles, theme } from '../../constants/styles';
import { screenStyles } from '../../constants/screenStyles';
import { formStyles } from '../../constants/formStyles';
import type { WorkoutType } from '../../src/core/domain/models/workoutType';

export type WorkoutPlanFormValues = {
    name: string;
    description?: string;
    workoutDay?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    goal?: string;
    workoutTypeId?: WorkoutType["id"];
};

type WorkoutPlanFormProps = {
    initialValues?: Partial<WorkoutPlanFormValues>;
    workoutTypes: WorkoutType[];
    submitLabel: string;
    onSubmit: (values: WorkoutPlanFormValues) => void;
};

export function WorkoutPlanForm({ 
    initialValues,
    workoutTypes,
    submitLabel,
    onSubmit }: WorkoutPlanFormProps) {
    const [name, setName] = useState(initialValues?.name ?? "");
    const [description, setDescription] = useState(initialValues?.description ?? "");
    const workoutDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ] as const;
    const [workoutDay, setWorkoutDay] = useState<WorkoutPlanFormValues["workoutDay"] | null>(initialValues?.workoutDay ?? null);
    const [goal, setGoal] = useState(initialValues?.goal ?? "");
    const [workoutTypeId, setWorkoutTypeId] = useState<WorkoutType["id"] | null>(initialValues?.workoutTypeId ?? null);
    return (
        <View style={styles.screen}>
            <View style={screenStyles.header}>
                <View>
                    <Text style={styles.title}>Workout Plan Form</Text>
                    <Text style={styles.subtitle}>
                        Build and customize your workout plan.
                    </Text>
                </View>
            </View>
            <View style={formStyles.form}>
                <View style={formStyles.field}>
                    <Text style={formStyles.label}>Workout Plan Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Workout Plan Name"
                        style={formStyles.input}
                        placeholderTextColor={theme.colors.textMuted}
                    />
                </View>
                <View style={formStyles.field}>
                    <Text style={formStyles.label}>Workout Plan Description</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Workout Plan Description"
                        style={[formStyles.input, formStyles.multilineInput]}
                        multiline
                        placeholderTextColor={theme.colors.textMuted}
                    />
                </View>
                <View style={formStyles.field}>                    
                    <Text style={formStyles.label}>Workout Day</Text>

                    <View style={formStyles.dayOptions}>
                        {workoutDays.map((day) => (
                            <Pressable 
                                key={day} 
                                style={[
                                    formStyles.dayChip,
                                    workoutDay === day && formStyles.dayChipSelected,
                                ]}
                                onPress={() => setWorkoutDay(day)}>
                                <Text style={[
                                    formStyles.dayChipText,
                                    workoutDay === day && formStyles.dayChipTextSelected,
                                ]}>
                                    {day}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
                <View style={formStyles.field}>
                    <Text style={formStyles.label}>Workout Plan Goal</Text>
                    <TextInput
                        value={goal}
                        onChangeText={setGoal}
                        placeholder="Workout Plan Goal"
                        style={formStyles.input}
                        placeholderTextColor={theme.colors.textMuted}
                    />
                </View>
                <View style={formStyles.field}>
                    <Text style={formStyles.label}>Workout Type</Text>
                    <View style={formStyles.dayOptions}>
                        {workoutTypes.map((type) => (
                            <Pressable
                                key={type.id}
                                style={[
                                    formStyles.dayChip,
                                    workoutTypeId === type.id && formStyles.dayChipSelected,
                                ]}
                                onPress={() => setWorkoutTypeId(type.id)}
                            >   
                                <Text style={[
                                    formStyles.dayChipText,
                                    workoutTypeId === type.id && formStyles.dayChipTextSelected,
                                ]}>
                                    {type.name}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
                <View style={formStyles.field}>
                    <Pressable 
                        style={formStyles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={formStyles.submitButtonText}>{submitLabel}</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );

    function handleSubmit() {
       onSubmit({
            name: name.trim(),
            description: description.trim() || undefined,
            workoutDay: workoutDay || undefined,
            goal: goal.trim() || undefined,
            workoutTypeId: workoutTypeId ?? undefined,
       });
    }
}
