import { Text, View } from "react-native";
import { globalStyles } from "../../constants/styles";

export default function HistoryScreen() {
    return (
        <View style={globalStyles.screen}>
            <Text style={globalStyles.title}>History</Text>
            <Text style={globalStyles.subtitle}>Completed workout sessions will appear here.</Text>
        </View>
    );
}
