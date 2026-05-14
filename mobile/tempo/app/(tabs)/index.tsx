import { Text, View } from "react-native";
import { globalStyles } from "../../constants/styles";
import { db } from "../../src/core/data/db/database";

export default function DashboardScreen() {
  console.log("Tempo database loaded:", db);
  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.title}>Dashboard</Text>
      <Text style={globalStyles.subtitle}>Today&apos;s workout summary will appear here.</Text>
    </View>
  );
}
