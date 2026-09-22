import { Text, View } from "react-native";
import { calendarStyles } from "../../constants/calendarStyles";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekdayHeader() {
    return (
        <View style={calendarStyles.weekdayHeader}>
            {WEEKDAYS.map((weekday) => (
                <View key={weekday} style={calendarStyles.weekdayCell}>
                    <Text style={calendarStyles.weekdayText}>
                        {weekday}
                    </Text>
                </View>
            ))}
        </View>
    );
}