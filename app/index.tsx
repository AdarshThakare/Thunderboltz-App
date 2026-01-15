import BatteryPercentage from "@/components/portrait/batteryPercentage";
import BatteryTemperature from "@/components/portrait/batteryStats";
import P_Odometer from "@/components/portrait/odometer";
import SmokeIndicator from "@/components/portrait/smokeDetector";
import P_Speedometer from "@/components/portrait/speedometer";
import { ThemedView } from "@/components/themed-view";
import { database } from "@/constants/config";
import { Colors } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const getOrientation = () => {
  const { width, height } = Dimensions.get("window");
  return width > height ? "landscape" : "portrait";
};

export default function BikeHeroScreen() {
  const [orientation, setOrientation] = useState(getOrientation());
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [leftIndicator, setLeftIndicator] = useState(false);
  const [rightIndicator, setRightIndicator] = useState(false);
  const [headlight, setHeadlight] = useState(false);
  const [poweroff, serPowerOff] = useState(false);

  const [smoke, setSmoke] = useState(false);
  const [speed, setSpeed] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const [voltage, setVoltage] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [batteryPercentage, setBatteryPercentage] = useState<number>(0);

  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const router = useRouter();

  // FAB animation values
  const fabScale = useSharedValue(1);
  const fabRotation = useSharedValue(0);

  useEffect(() => {
    const rootRef = ref(database);

    const unsubscribe = onValue(rootRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) return;

      setSpeed(data.Speedometer ?? 0);
      setCurrent(data.Current ?? 0);
      setDistance(data.Odometer ?? 0);
      setVoltage(data.Voltage ?? 0);
      setTemperature(data.BatteryTemp ?? 0);
      setBatteryPercentage(data.Battery ?? 0);
      setSmoke(data.SmokeIndicator ?? false);

      // optional if you want to sync these too
      setLeftIndicator(data.LeftIndicator ?? false);
      setRightIndicator(data.RightIndicator ?? false);
      setHeadlight(data.Headlight ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Enable screen rotation
    ScreenOrientation.unlockAsync();

    // Listen for orientation changes
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
      setOrientation(getOrientation());
    });

    return () => {
      subscription?.remove();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  const isLandscape = orientation === "landscape";
  const { width } = dimensions;
  const leftAnim = useSharedValue(1);
  const rightAnim = useSharedValue(1);
  const headlightAnim = useSharedValue(1);

  //Popping animation
  const pop = (anim: any) => {
    anim.value = withSequence(
      withTiming(1.12, { duration: 120 }),
      withTiming(1, { duration: 120 })
    );
  };

  const pop2 = (anim: any) => {
    !headlight
      ? (anim.value = withSequence(withTiming(1.16, { duration: 120 })))
      : (anim.value = withSequence(withTiming(1, { duration: 120 })));
  };

  const handleFabPress = () => {
    // Animate FAB
    fabScale.value = withSequence(
      withSpring(0.85, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    fabRotation.value = withSequence(
      withTiming(180, { duration: 300 }),
      withTiming(360, { duration: 300 })
    );

    // Navigate to dashboard after animation starts
    setTimeout(() => {
      router.push("/dashboard");
      fabRotation.value = 0; // Reset rotation
    }, 200);
  };

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: fabScale.value },
      { rotate: `${fabRotation.value}deg` },
    ],
  }));

  return (
    <ThemedView>
      <StatusBar barStyle="default" hidden />
      {!isLandscape ? (
        <ScrollView>
          <View style={{ flex: 1 }}>
            <View
              style={[
                {
                  position: "absolute",
                  width: 900,
                  height: 900,
                  borderRadius: 400,
                  opacity: 0.5,
                },
                {
                  right: "-40%",
                  top: "20%",
                  backgroundColor: "rgba(104, 157, 242, 0.2)",
                },
              ]}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 40,
                marginHorizontal: 14,
              }}
            >
              <Animated.View style={{ marginStart: 50 }}>
                <Pressable
                  onPress={() => {
                    serPowerOff((prev) => !prev);
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 40,
                    backgroundColor: poweroff ? "#ff3c00b5" : colors.background,
                    borderWidth: 0.6,
                    borderColor: poweroff ? "#ff3c00" : colors.icon,

                    // Glow ONLY here
                    shadowColor: poweroff ? "#ff3c00" : "transparent",
                    shadowOpacity: poweroff ? 0.9 : 0,
                    shadowRadius: poweroff ? 18 : 0,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: poweroff ? 14 : 0,
                    marginTop: 5,
                  }}
                >
                  <AntDesign
                    name="poweroff"
                    size={20}
                    color={poweroff ? "#000" : colors.text}
                  />
                </Pressable>
              </Animated.View>
              <BatteryPercentage socPercent={batteryPercentage} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
                marginRight: 14,
              }}
            >
              <Image
                source={require("../assets/images/bike.png")}
                style={{
                  height: 110,
                  width: 180,
                }}
              />
            </View>
            <P_Speedometer speed={speed} />
            <P_Odometer distance={distance} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 30,
                marginTop: 60,
                marginBottom: 40,
              }}
            >
              <Animated.View style={{ transform: [{ scale: leftAnim }] }}>
                <Pressable
                  onPress={() => {
                    setLeftIndicator((prev) => !prev);
                    pop(leftAnim);
                  }}
                  style={[
                    {
                      padding: 16,
                      borderRadius: 40,
                      backgroundColor: leftIndicator
                        ? "#ff840ae3"
                        : colors.background,
                      borderWidth: 0.6,
                      borderColor: leftIndicator ? "#FF9F0A" : colors.icon,
                    },
                  ]}
                >
                  <AntDesign
                    name="caret-left"
                    size={34}
                    color={leftIndicator ? colors.background : colors.icon}
                  />
                </Pressable>
              </Animated.View>
              <Animated.View style={{ transform: [{ scale: headlightAnim }] }}>
                <Pressable
                  onPress={() => {
                    setHeadlight((prev) => !prev);
                    pop2(headlightAnim);
                  }}
                  style={{
                    padding: 18,
                    borderRadius: 40,
                    backgroundColor: headlight
                      ? "#00E0FF22"
                      : colors.background,
                    borderWidth: 0.6,
                    borderColor: headlight ? "#00E0FF" : colors.icon,

                    // Glow ONLY here
                    shadowColor: headlight ? "#00E0FF" : "transparent",
                    shadowOpacity: headlight ? 0.9 : 0,
                    shadowRadius: headlight ? 18 : 0,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: headlight ? 14 : 0,
                  }}
                >
                  <MaterialIcons
                    name="highlight"
                    size={34}
                    color={headlight ? "#05bafc" : colors.icon}
                  />
                </Pressable>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: rightAnim }] }}>
                <Pressable
                  onPress={() => {
                    setRightIndicator((prev) => !prev);
                    pop(rightAnim);
                  }}
                  style={[
                    {
                      padding: 16,
                      borderRadius: 40,
                      backgroundColor: rightIndicator
                        ? "#ff8f07c3"
                        : colors.background,
                      borderWidth: 0.6,
                      borderColor: rightIndicator ? "#FF9F0A" : colors.icon,
                    },
                  ]}
                >
                  <AntDesign
                    name="caret-right"
                    size={34}
                    color={rightIndicator ? colors.background : colors.icon}
                  />
                </Pressable>
              </Animated.View>
            </View>
            <BatteryTemperature
              temperatureC={temperature}
              currentA={current}
              voltageV={voltage}
            />
            <SmokeIndicator smokeDetected={smoke} />

            <View style={{ height: 10 }} />
          </View>
        </ScrollView>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            {/* Left Section - Controls */}
            <View style={{ marginRight: 40 }}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                  marginTop: 20,
                }}
              >
                <Animated.View>
                  <Pressable
                    onPress={() => {
                      serPowerOff((prev) => !prev);
                    }}
                    style={{
                      padding: 12,
                      borderRadius: 40,
                      backgroundColor: poweroff
                        ? "#ff3c00b5"
                        : colors.background,
                      borderWidth: 0.6,
                      borderColor: poweroff ? "#ff3c00" : colors.icon,
                      shadowColor: poweroff ? "#ff3c00" : "transparent",
                      shadowOpacity: poweroff ? 0.9 : 0,
                      shadowRadius: poweroff ? 18 : 0,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: poweroff ? 14 : 0,
                    }}
                  >
                    <AntDesign
                      name="poweroff"
                      size={20}
                      color={poweroff ? "#000" : colors.text}
                    />
                  </Pressable>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale: leftAnim }] }}>
                  <Pressable
                    onPress={() => {
                      setLeftIndicator((prev) => !prev);
                      pop(leftAnim);
                    }}
                    style={[
                      {
                        padding: 16,
                        borderRadius: 40,
                        backgroundColor: leftIndicator
                          ? "#ff840ae3"
                          : colors.background,
                        borderWidth: 0.6,
                        borderColor: leftIndicator ? "#FF9F0A" : colors.icon,
                      },
                    ]}
                  >
                    <AntDesign
                      name="caret-left"
                      size={34}
                      color={leftIndicator ? colors.background : colors.icon}
                    />
                  </Pressable>
                </Animated.View>

                <Animated.View
                  style={{ transform: [{ scale: headlightAnim }] }}
                >
                  <Pressable
                    onPress={() => {
                      setHeadlight((prev) => !prev);
                      pop2(headlightAnim);
                    }}
                    style={{
                      padding: 18,
                      borderRadius: 40,
                      backgroundColor: headlight
                        ? "#00E0FF22"
                        : colors.background,
                      borderWidth: 0.6,
                      borderColor: headlight ? "#00E0FF" : colors.icon,
                      shadowColor: headlight ? "#00E0FF" : "transparent",
                      shadowOpacity: headlight ? 0.9 : 0,
                      shadowRadius: headlight ? 18 : 0,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: headlight ? 14 : 0,
                    }}
                  >
                    <MaterialIcons
                      name="highlight"
                      size={34}
                      color={headlight ? "#05bafc" : colors.icon}
                    />
                  </Pressable>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale: rightAnim }] }}>
                  <Pressable
                    onPress={() => {
                      setRightIndicator((prev) => !prev);
                      pop(rightAnim);
                    }}
                    style={[
                      {
                        padding: 16,
                        borderRadius: 40,
                        backgroundColor: rightIndicator
                          ? "#ff8f07c3"
                          : colors.background,
                        borderWidth: 0.6,
                        borderColor: rightIndicator ? "#FF9F0A" : colors.icon,
                      },
                    ]}
                  >
                    <AntDesign
                      name="caret-right"
                      size={34}
                      color={rightIndicator ? colors.background : colors.icon}
                    />
                  </Pressable>
                </Animated.View>
              </View>
            </View>

            {/* Center Section - Speedometer & Bike */}
            <View style={{ alignItems: "center", marginRight: 40 }}>
              <View
                style={{
                  position: "absolute",
                  width: 600,
                  height: 600,
                  borderRadius: 300,
                  opacity: 0.5,
                  right: "-10%",
                  top: "-20%",
                  backgroundColor: "rgba(104, 157, 242, 0.2)",
                }}
              />

              <P_Speedometer speed={speed} />
            </View>

            {/* Right Section - Stats */}
            <View style={{ gap: 20 }}>
              <BatteryPercentage socPercent={batteryPercentage} />
              <P_Odometer distance={distance} />
              <BatteryTemperature
                temperatureC={temperature}
                currentA={current}
                voltageV={voltage}
              />
              <SmokeIndicator smokeDetected={smoke} />
            </View>
          </View>
        </ScrollView>
      )}

      {/* FAB - Floating Action Button */}
      {
        <Animated.View style={[styles.fabContainer, fabAnimatedStyle]}>
          <Pressable
            onPress={handleFabPress}
            style={[
              styles.fab,
              {
                backgroundColor: theme === "dark" ? "#3b82f6" : "#2563eb",
                shadowColor: "#3b82f6",
              },
            ]}
          >
            <Ionicons name="speedometer" size={28} color="#ffffff" />
          </Pressable>
        </Animated.View>
      }
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
