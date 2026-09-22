import { View } from "react-native";

import { CalendarDayCell } from "./CalendarDayCell"
import { calendarStyles } from "../../constants/calendarStyles";
import { formatLocalDateKey, getCalendarDays } from "../../src/core/utils/calendarDates";
import type { PlannedWorkout } from "../../src/core/domain/models/plannedWorkout";

type MonthGridProps = {
    visibleMonth: Date;
    selectedDate: Date;
    plannedWorkouts: PlannedWorkout[];
    onSelectDate: (date: Date) => void;
};

export function MonthGrid({
    visibleMonth,
    selectedDate,
    plannedWorkouts,
    onSelectDate,
}: MonthGridProps) {
    const calendarDays = getCalendarDays(visibleMonth);
    const selectedDateKey = formatLocalDateKey(selectedDate);

    const plannedWorkoutCountByDate = new Map<string, number>();

    plannedWorkouts.forEach((plannedWorkout) => {
        const currentCount = plannedWorkoutCountByDate.get(plannedWorkout.plannedDate) ?? 0;

        plannedWorkoutCountByDate.set(plannedWorkout.plannedDate, currentCount + 1);
    });

        return (
        <View style={calendarStyles.monthGrid}>
            {calendarDays.map((day) => (
                <CalendarDayCell
                    key={day.dateKey}
                    dateKey={day.dateKey}
                    dayNumber={day.dayNumber}
                    isCurrentMonth={day.isCurrentMonth}
                    isSelected={
                        day.isCurrentMonth &&
                        day.dateKey === selectedDateKey
                    }
                    plannedWorkoutCount={
                        plannedWorkoutCountByDate.get(day.dateKey) ?? 0
                    }
                    onPress={() => onSelectDate(day.date)}
                />
            ))}
        </View>
    );
}
