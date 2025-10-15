import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { WebView } from "react-native-webview";
import DeviceInfoModule from "../native/DeviceInfoModule";

export default function HomeScreen({ navigation }) {
  const [token, setToken] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(null);

  useEffect(() => {
    requestUserPermission();
    getBatteryLevel();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        "New Notification",
        remoteMessage.notification?.body || "You have a new message!"
      );
    });

    return unsubscribe;
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      setToken(fcmToken);
      console.log("FCM Token:", fcmToken);
    }
  }

  async function getBatteryLevel() {
    const level = await DeviceInfoModule.getBatteryLevel();
    setBatteryLevel(level);
  }

  function sendTestNotification() {
    Alert.alert("Simulate Notification", "Notification triggered locally!");
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.header}>Welcome to Feature-Rich Notification App 🚀</Text>
      <Text>Battery Level: {batteryLevel !== null ? batteryLevel + "%" : "Loading..."}</Text>
      <Text selectable>FCM Token: {token || "Fetching..."}</Text>
      <Button title="Trigger Local Notification" onPress={sendTestNotification} />
      <Button
        title="Go to Notification Screen"
        onPress={() =>
          navigation.navigate("Notification", { payload: { test: "Manual" } })
        }
      />
      <WebView source={{ uri: "https://example.com" }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: "600", textAlign: "center", marginVertical: 10 },
});
