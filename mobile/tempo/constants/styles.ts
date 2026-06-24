import { StyleSheet } from "react-native";

export const theme = {
    colors: {
        background: "#09090B",
        surface: "#18181B",
        surfaceMuted: "#27272A",
        border: "#3F3F46",

        text: "#FAFAFA",
        textMuted: "#A1A1AA",

        primary: "#22C55E",
        primaryMuted: "#14532D",

        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        screenPadding: 24,
    },

    typography: {
        regular: "Ubuntu",
        light: "UbuntuLight",
        medium: "UbuntuMedium",
        bold: "UbuntuBold",
    },

    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
        xxl: 28,
    },
};

export const globalStyles = StyleSheet.create({
    screen: {
        flex: 1, 
        padding: theme.spacing.screenPadding, 
        backgroundColor: theme.colors.background,
    },

    title: {
        color: theme.colors.text,
        fontFamily: theme.typography.light,
        fontSize: theme.fontSize.xl,
    },

    subtitle: {
        color: theme.colors.text,
        fontFamily: theme.typography.light,
        fontSize: theme.fontSize.md,
        marginTop: theme.spacing.sm,
    },

    tabBar: {
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.border,
    },

    header: {
        backgroundColor: theme.colors.background,
    },

    headerTitle: {
        fontFamily: theme.typography.light,
        color: theme.colors.text,
        fontSize: theme.fontSize.xl,
    },
});
