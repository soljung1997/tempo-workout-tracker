import { Text, View } from "react-native";
import { globalStyles as styles } from "../../constants/styles";

export default function PlansScreen() {
  console.log("PlansScreen rendered");

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Plans</Text>
      <Text style={styles.subtitle}>Workout plans will appear here.</Text>
    </View>
  );
}