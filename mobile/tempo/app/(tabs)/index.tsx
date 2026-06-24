import { Text, View } from "react-native";
import { globalStyles as styles } from "../../constants/styles";

export default function DashboardScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Today&apos;s workout summary will appear here.</Text>
    </View>
  );
}
