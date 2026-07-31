import { StyleSheet } from "react-native";
import { theme } from "./styles";

export const formStyles = StyleSheet.create({

    form: {
        gap: theme.spacing.md,
    },

    field: {
        gap: theme.spacing.xs,
    },

    label: {
        color: theme.colors.text,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.sm,
    },

    input: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 12, 
        color: theme.colors.text,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },

    multilineInput: {
        minHeight: 96,
        textAlignVertical: "top",
    },

    dayOptions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: theme.spacing.sm,
    },

    dayChip: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1, 
        borderRadius: 999,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },

    dayChipSelected: {
        backgroundColor: theme.colors.primaryMuted,
        borderColor: theme.colors.primary,
    },

    dayChipText: {
        color: theme.colors.textMuted,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.sm,
        textTransform: "capitalize",
    },

    dayChipTextSelected: {
        color: theme.colors.text,
        fontFamily: theme.typography.medium,
    },

    submitButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        alignItems: "center",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },

    submitButtonText: {
        color: theme.colors.background,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.md,
    },

    errorText: {
        color: theme.colors.danger,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.sm,
        marginTop: theme.spacing.sm,
        textAlign: "center",
    },
    
    exercisePickerContainer: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: theme.spacing.sm,
    },

    exercisePickerList: {
        maxHeight: 240,
    },

    exercisePickerOptions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: theme.spacing.sm,
    },

    scrollContent: {
        paddingBottom: theme.spacing.xxxl ?? 64,
    },
});
