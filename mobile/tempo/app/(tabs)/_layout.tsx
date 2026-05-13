import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs>
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