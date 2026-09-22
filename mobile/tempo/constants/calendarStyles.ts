import { StyleSheet } from "react-native";
import { theme } from "./styles";

export const calendarStyles = StyleSheet.create({
    header: {

        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        height: theme.spacing.x3l,
    },

    monthTitle: {
        color: theme.colors.text,
        textAlign: "center",
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.lg,
    },

    navigationButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },

    navigationText: {
        textAlign: "center",
        color:theme.colors.text,
        fontSize: theme.fontSize.xxl,
    },

        /* Styles for WeekdayHeader.tsx */
    
    weekdayHeader: {
        flexDirection: "row",
        width: "100%",
    },

    weekdayCell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
    },

    weekdayText: {
        color: theme.colors.textMuted,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.sm,
        textAlign: "center",
    },

    /* Styles for MonthGrid.tsx */
    monthGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
    },

    /* Styles for CalendarDayCell.tsx */

    dayCell: {
        width: `${100 / 7}%`,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },

    dayNumberContainer: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },

    selectedDayCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.primary,
        overflow: "hidden",
    },

    dayText: {
        color: theme.colors.text,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.sm,
    },

    outsideMonthText: {
        color: theme.colors.textMuted,
        opacity: 0.4,
    },

    selectedDayText: {
        color: theme.colors.background,
        fontFamily: theme.typography.medium,
    },

    pressedDayCell: {
        opacity: 0.6,
    },

    workoutIndicators: {
        position: "absolute",
        bottom: 7,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },

    plannedWorkoutDot: {
        width: 5, 
        height: 5, 
        borderRadius: 3,
        backgroundColor: theme.colors.textMuted
    },

    selectedPlannedWorkoutDot: {
        backgroundColor: theme.colors.background,
    },

    indicatorMoreText: {
        color: theme.colors.textMuted,
        fontFamily: theme.typography.regular,
        fontSize: 8,
        lineHeight: 8,
    },

    /* Styles for SelectedDayPanel.tsx */

    selectedDayPanel: {
        height: 128,
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
    },

    selectedDayTitle: {
        color: theme.colors.text,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.md,
        marginBottom: theme.spacing.sm,
    },

    selectedDayContent: {
        flex: 1,
        justifyContent: "center",
        gap: theme.spacing.xs,
    },

    emptyDayText: {
        color: theme.colors.text,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.sm,
    },

    workoutSummary: {
        color: theme.colors.text,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.sm,
    },

    selectedDayActions: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 20,
    },

    moreText: {
        color: theme.colors.textMuted,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.xs,
    },

    scheduleText: {
        color: theme.colors.primary,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.sm,
    },

    plannedWorkoutPanel: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 20,
    },

});
