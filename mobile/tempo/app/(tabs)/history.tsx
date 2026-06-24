import { Text, View } from "react-native";
import { globalStyles as styles } from "../../constants/styles";

export default function HistoryScreen() {
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>History</Text>
            <Text style={styles.subtitle}>Completed workout sessions will appear here.</Text>
        </View>
    );
}
