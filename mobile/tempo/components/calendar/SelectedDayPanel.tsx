import { calendarStyles } from "../../constants/calendarStyles";
import { Pressable, Text, View } from "react-native";

type SelectedDayPanelProps = {
    dateLabel: string;
    workouts: {
        id: number;
        name: string;
        status: string;
    }[];
    onSchedulePress: () => void;
    onEditWorkoutPress: (workoutId: number) => void;
};

export function SelectedDayPanel({
    dateLabel,
    workouts,
    onSchedulePress,
    onEditWorkoutPress,
}: SelectedDayPanelProps) {
    const visibleWorkouts = workouts.slice(0, 2);
    const remainingCount = workouts.length - visibleWorkouts.length;

    return (
        <View style={calendarStyles.selectedDayPanel}>
            <Text style={calendarStyles.selectedDayTitle}>
                {dateLabel}
            </Text>

            <View style={calendarStyles.selectedDayContent}>
                {visibleWorkouts.length === 0 ? (
                    <Text style={calendarStyles.emptyDayText}>
                        No workouts scheduled
                    </Text>
                ) : (
                    visibleWorkouts.map((workout) => (
                        <View style={calendarStyles.plannedWorkoutPanel}
                            key={workout.id}
                        >
                            <Text
                                style={calendarStyles.workoutSummary}
                                numberOfLines={1}
                            >
                                {workout.name} · {workout.status}
                            </Text>
                            <Pressable
                                onPress={() => onEditWorkoutPress(workout.id)}
                                accessibilityRole="button"
                                accessibilityLabel={`Edit ${workout.name}`}
                            >
                                <Text style={calendarStyles.scheduleText}>
                                    Edit
                                </Text>
                            </Pressable>
                        </View>
                    ))
                )}
            </View>
            <View style={calendarStyles.selectedDayActions}>
                <Text style={calendarStyles.moreText}>
                    {remainingCount > 0 ? `+${remainingCount} more` : ""}
                </Text>

                <Pressable
                    onPress={onSchedulePress}
                    accessibilityRole="button"
                    accessibilityLabel={`Schedule workout for ${dateLabel}`}
                >
                    <Text style={calendarStyles.scheduleText}>
                        Schedule
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}