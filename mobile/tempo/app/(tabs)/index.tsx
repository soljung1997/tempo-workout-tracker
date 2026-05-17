import { Text, View } from "react-native";
import { globalStyles as styles } from "../../constants/styles";
import { db } from "../../src/core/data/db/database";

export default function DashboardScreen() {
  console.log("Tempo database loaded:", db);
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Today&apos;s workout summary will appear here.</Text>
    </View>
  );
}
