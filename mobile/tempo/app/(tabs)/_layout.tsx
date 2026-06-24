import { Tabs } from "expo-router";
import { globalStyles as styles, theme } from "../../constants/styles";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerStyle: styles.header,
                headerTitleStyle: styles.headerTitle,
                headerTintColor: theme.colors.text,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                }}
            />

            <Tabs.Screen
                name="plans"
                options={{
                    title: "Plans",
                }}
            />

            <Tabs.Screen
                name="workout"
                options={{
                    title: "Workout",
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                }}
            />

        </Tabs>
        );
    }