import { Text, View } from "react-native";
import { globalStyles as styles } from "../../constants/styles"

export default function SettingsScreen() {
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>App preferences will appear here.</Text>
        </View>
    );
}