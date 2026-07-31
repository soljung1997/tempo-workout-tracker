import { StyleSheet } from "react-native";
import { theme } from "./styles";

export const screenStyles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },

    createButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: 12,
        alignSelf: "flex-start",
    },

    createButtonText: {
        color: theme.colors.background,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.sm,
    },

    centerState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing.sm,
    },

    stateText: {
        color: theme.colors.textMuted,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.md,
    },

    errorText: {
        color: theme.colors.danger,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.md,
        textAlign: "center",
    },

    secondaryButton: {
        borderColor: theme.colors.border,
        borderWidth: 1,
        alignItems: "center",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        borderRadius: 12,
    },

    secondaryButtonText: {
        color: theme.colors.text,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.sm,
    },

    emptyCard: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: theme.spacing.lg,
        gap: theme.spacing.sm,
    },

    emptyTitle: {
        color: theme.colors.text,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.lg,
    },

    emptyText: {
        color: theme.colors.textMuted,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.md,
        lineHeight: 22,
    },

    emptyButton: {
        alignSelf: "flex-start",
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: 12,
        marginTop: theme.spacing.sm,
    },

    listContent: {
        gap: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
    },

    planCard: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
    },

    planCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: theme.spacing.md,
    },

    planName: {
        color: theme.colors.text,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.lg,
        flex: 1,
    },

    openText: {
        color: theme.colors.primary,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.sm,
    },

    planDescription: {
        color: theme.colors.textMuted,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.sm,
        lineHeight: 20,
    },

    metadataRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: theme.spacing.sm,
    },

    metadataPill: {
        backgroundColor: theme.colors.surfaceMuted,
        borderRadius: 999,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },

    metadataText: {
        color: theme.colors.textMuted,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.xs,
        textTransform: "capitalize",
    },

    detailContent: {
        flex: 1,
        gap: theme.spacing.lg,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: theme.spacing.md,
    },

    sectionTitle: {
        color: theme.colors.text,
        fontFamily: theme.typography.medium,
        fontSize: theme.fontSize.lg,
    },

    sectionSubtitle: {
        color: theme.colors.textMuted,
        fontFamily: theme.typography.regular,
        fontSize: theme.fontSize.sm,
    },
});
