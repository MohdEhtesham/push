import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Animated,
  Easing,
  ScrollView,
  NativeModules,
  NativeEventEmitter,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Svg, Circle, Polyline } from "react-native-svg";
import Geolocation from "@react-native-community/geolocation";
import {
  isStepCountingSupported,
  parseStepData,
  startStepCounterUpdate,
  stopStepCounterUpdate,
} from "@dongminyu/react-native-step-counter";

const { StepCounterNative } = NativeModules;
const stepEventEmitter = new NativeEventEmitter(StepCounterNative);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const STEP_GOAL = 10000;
const STEP_LENGTH = 0.762;
const WEIGHT = 70;

const App = () => {
  const [pkgSteps, setPkgSteps] = useState(0);
  const [pkgCalories, setPkgCalories] = useState(0);
  const [pkgDistance, setPkgDistance] = useState(0);
  const [isPkgRunning, setIsPkgRunning] = useState(false);

  const [natSteps, setNatSteps] = useState(0);
  const [natCalories, setNatCalories] = useState(0);
  const [natDistance, setNatDistance] = useState(0);
  const [isNatRunning, setIsNatRunning] = useState(false);
  const [coords, setCoords] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const watchId = useRef(null);

  const pkgProgress = useRef(new Animated.Value(0)).current;
  const natProgress = useRef(new Animated.Value(0)).current;
  const circumference = 2 * Math.PI * 100;

  const animateProgress = (value, progressRef) => {
    Animated.timing(progressRef, {
      toValue: value / STEP_GOAL,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    requestPermissions();
    const subscription = stepEventEmitter.addListener(
      "StepCounterNativeUpdate",
      (data) => {
        const steps = Math.floor(data);
        setNatSteps(steps);
        const dist = (steps * STEP_LENGTH) / 1000;
        setNatDistance(dist.toFixed(2));
        const cal = steps * 0.04 * (WEIGHT / 70);
        setNatCalories(cal.toFixed(2));
        animateProgress(steps, natProgress);
      }
    );

    return () => {
      subscription.remove();
      stopStepCounterUpdate();
      StepCounterNative.stopCounting();
      if (watchId.current) Geolocation.clearWatch(watchId.current);
    };
  }, []);

  async function requestPermissions() {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
    }
    await isStepCountingSupported();
  }

  const startPkgCounting = () => {
    setIsPkgRunning(true);
    startStepCounterUpdate(new Date(), (data) => {
      const parsed = parseStepData(data);
      const steps = parsed.steps;
      setPkgSteps(steps);
      const dist = (steps * STEP_LENGTH) / 1000;
      setPkgDistance(dist.toFixed(2));
      const cal = steps * 0.04 * (WEIGHT / 70);
      setPkgCalories(cal.toFixed(2));
      animateProgress(steps, pkgProgress);
    });
  };

  const stopPkgCounting = () => {
    stopStepCounterUpdate();
    setIsPkgRunning(false);
  };

  const startNatCounting = () => {
    StepCounterNative.startCounting();
    setIsNatRunning(true);
  };

  const stopNatCounting = () => {
    StepCounterNative.stopCounting();
    setIsNatRunning(false);
  };

  const startTracking = () => {
    setIsTracking(true);
    setCoords([]);
    watchId.current = Geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords((prev) => [...prev, { latitude, longitude }]);
      },
      (err) => console.log(err),
      { enableHighAccuracy: true, distanceFilter: 2 }
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (watchId.current) Geolocation.clearWatch(watchId.current);
  };

  const size = 300;
  const normalize = (value, min, max) =>
    (max - min === 0 ? size / 2 : ((value - min) / (max - min)) * size);

  const pathPoints = () => {
    if (coords.length < 2) return "";
    const lats = coords.map((c) => c.latitude);
    const lngs = coords.map((c) => c.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return coords
      .map((c) => {
        const x = normalize(c.longitude, minLng, maxLng);
        const y = size - normalize(c.latitude, minLat, maxLat);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const pkgDashOffset = pkgProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const natDashOffset = natProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#00c6ff", "#0072ff"]} style={styles.section}>
        <Text style={styles.title}>Step Tracker (Package)</Text>
        <View style={styles.circleWrapper}>
          <Svg height="240" width="240" viewBox="0 0 240 240">
            <Circle
              cx="120"
              cy="120"
              r="100"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="15"
              fill="none"
            />
            <AnimatedCircle
              cx="120"
              cy="120"
              r="100"
              stroke="#fff"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={pkgDashOffset}
            />
          </Svg>
          <View style={styles.centerText}>
            <Text style={styles.stepCount}>{pkgSteps}</Text>
            <Text style={styles.stepLabel}>Steps</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <LinearGradient colors={["#43e97b", "#38f9d7"]} style={styles.statBox}>
            <Text style={styles.statValue}>{pkgCalories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </LinearGradient>

          <LinearGradient colors={["#fa709a", "#fee140"]} style={styles.statBox}>
            <Text style={styles.statValue}>{pkgDistance} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </LinearGradient>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isPkgRunning ? "#ff2600ff" : "#f9080830" },
          ]}
          onPress={isPkgRunning ? stopPkgCounting : startPkgCounting}
        >
          <Text style={styles.buttonText}>
            {isPkgRunning ? "Stop Tracking" : "Start Tracking"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient colors={["#ff9966", "#ff5e62"]} style={styles.section}>
        <Text style={styles.title}>Step Tracker (Native)</Text>

        <View style={styles.circleWrapper}>
          <Svg height="240" width="240" viewBox="0 0 240 240">
            <Circle
              cx="120"
              cy="120"
              r="100"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="15"
              fill="none"
            />
            <AnimatedCircle
              cx="120"
              cy="120"
              r="100"
              stroke="#fff"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={natDashOffset}
            />
          </Svg>
          <View style={styles.centerText}>
            <Text style={styles.stepCount}>{natSteps}</Text>
            <Text style={styles.stepLabel}>Steps</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <LinearGradient colors={["#43e97b", "#38f9d7"]} style={styles.statBox}>
            <Text style={styles.statValue}>{natCalories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </LinearGradient>

          <LinearGradient colors={["#fa709a", "#fee140"]} style={styles.statBox}>
            <Text style={styles.statValue}>{natDistance} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </LinearGradient>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isNatRunning ? "#2a05fdff" : "#ffffff30" },
          ]}
          onPress={isNatRunning ? stopNatCounting : startNatCounting}
        >
          <Text style={styles.buttonText}>
            {isNatRunning ? "Stop Tracking" : "Start Tracking"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <View style={styles.routeContainer}>
        <Text style={styles.routeTitle}>Route Tracker (No Map)</Text>
        <Svg height="300" width="300" style={styles.routeBox}>
          {coords.length > 1 && (
            <Polyline
              points={pathPoints()}
              fill="none"
              stroke="#00ff90"
              strokeWidth="3"
            />
          )}
        </Svg>

        <TouchableOpacity
          onPress={isTracking ? stopTracking : startTracking}
          style={[
            styles.button,
            { backgroundColor: isTracking ? "#f44336" : "#4CAF50" },
          ]}
        >
          <Text style={styles.buttonText}>
            {isTracking ? "Stop Route" : "Start Route"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  section: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 40,
  },
  circleWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  centerText: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCount: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 18,
    color: "#d0e6ff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 40,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 16,
    color: "#f5f5f5",
    marginTop: 5,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  routeContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#111",
    borderTopWidth: 1,
    borderColor: "#222",
  },
  routeTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  routeBox: {
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default App;



// import React, { useEffect } from "react";
// import AppNavigator from "./src/navigation/AppNavigator";
// import messaging from "@react-native-firebase/messaging";

// export default function App() {
//   useEffect(() => {
//     // Background / Quit state
//     messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log("Opened by notification:", remoteMessage);
//     });

//     messaging().getInitialNotification().then(remoteMessage => {
//       if (remoteMessage) console.log("Launched from quit state:", remoteMessage);
//     });
//   }, []);
  

//   return <AppNavigator />;
// }
