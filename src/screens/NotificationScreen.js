import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NotificationScreen({ route }) {
  const payload = route.params?.payload || {};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Screen</Text>
      <Text style={styles.payload}>{JSON.stringify(payload, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  payload: { fontSize: 14, color: "#333" },
});
