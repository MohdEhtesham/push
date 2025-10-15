import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

// Create Android Notification Channel
export async function createChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

// Display local notification from FCM payload
export async function displayNotification(remoteMessage) {
  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'New Notification',
    body: remoteMessage.notification?.body || 'You have a new message!',
    android: { channelId: 'default', smallIcon: 'ic_launcher' },
  });
}

// Listen for FCM messages
export function setupNotificationListener(navigation) {
  // Foreground messages
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground FCM message:', remoteMessage);
    await displayNotification(remoteMessage);
  });

  // Background / tapped notification
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app open:', remoteMessage);
    navigation?.navigate('Notification', { payload: remoteMessage });
  });

  // App opened from quit state
  messaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log('Launched from notification:', remoteMessage);
      navigation?.navigate('Notification', { payload: remoteMessage });
    }
  });
}

// Request permission & get FCM token
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } else {
    console.log('Notification permission denied');
    return null;
  }
}
