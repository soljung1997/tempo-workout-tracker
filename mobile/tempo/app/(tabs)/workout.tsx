import { Text, View} from "react-native";
import { globalStyles as styles } from "../../constants/styles";

export default function WorkoutScreen() {
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Workout</Text>
            <Text style={styles.subtitle}>Active workout logging will happen here.</Text>
        </View>
    );
}