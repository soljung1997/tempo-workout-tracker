import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../constants/styles";
import { calendarStyles } from "../../constants/calendarStyles";

type CalendarHeaderProps = {
  visibleMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarHeader({
  visibleMonth,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  const monthLabel = visibleMonth.toLocaleDateString(undefined, 
  {
      month: "long",
      year: "numeric",
    });

    return (
      <View style={calendarStyles.header} testID="calendar-header">
        <Pressable style={calendarStyles.navigationButton}
          onPress={onPreviousMonth}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.text}  
          />
        </Pressable>

        <Text style={calendarStyles.monthTitle}>{monthLabel}</Text>

        <Pressable style={calendarStyles.navigationButton}
          onPress={onNextMonth}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
                    <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.colors.text}  
          />
        </Pressable>
      </View>
    );
  }