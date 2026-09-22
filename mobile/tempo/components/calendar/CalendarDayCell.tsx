import { Text, Pressable, View } from "react-native";
import { calendarStyles } from "../../constants/calendarStyles";

type CalendarDayCellProps = {
    dateKey: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isSelected: boolean;
    plannedWorkoutCount: number;
    onPress: () => void;
};

export function CalendarDayCell({
    dateKey,
    dayNumber,
    isCurrentMonth,
    isSelected,
    plannedWorkoutCount,
    onPress,
}: CalendarDayCellProps) {
    return (
        <Pressable 
            style={({ pressed }) => [
                calendarStyles.dayCell,
                pressed &&
                    isCurrentMonth &&
                    calendarStyles.pressedDayCell,
            ]}
            onPress={onPress}
            disabled={!isCurrentMonth}
            accessibilityRole="button"
            accessibilityLabel={`Select ${dateKey}`}
            accessibilityState={{
                selected: isSelected,
                disabled: !isCurrentMonth,
            }}
        >
            <View
                style={[
                    calendarStyles.dayNumberContainer,
                    isSelected && calendarStyles.selectedDayCircle,
                ]}
            >
                <Text
                    style={[
                        calendarStyles.dayText, 
                        !isCurrentMonth && calendarStyles.outsideMonthText,
                        isSelected && calendarStyles.selectedDayText,
                    ]}
                >
                    {dayNumber}
                </Text>
            </View>
            {plannedWorkoutCount > 0 ? (
                <View
                    style={calendarStyles.workoutIndicators}
                    pointerEvents="none"
                >
                    {Array.from({
                        length: Math.min(plannedWorkoutCount, 3),
                    }).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                calendarStyles.plannedWorkoutDot,
                                isSelected && calendarStyles.selectedPlannedWorkoutDot,
                            ]}
                        />
                    ))}

                    {plannedWorkoutCount > 3 ? (
                        <Text style={calendarStyles.indicatorMoreText}>
                            +{plannedWorkoutCount - 3}
                        </Text>
                    ) : null}
                </View>
            ) : null}

        </Pressable>
    );
}
