import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import messaging from "@react-native-firebase/messaging";

export default function App() {
  useEffect(() => {
    // Background / Quit state
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("Opened by notification:", remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) console.log("Launched from quit state:", remoteMessage);
    });
  }, []);
  

  return <AppNavigator />;
}
