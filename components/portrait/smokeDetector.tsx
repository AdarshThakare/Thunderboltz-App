import { Colors } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  smokeDetected: boolean;
};

export default function SmokeStatusIndicator({ smokeDetected }: Props) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const [open, setOpen] = useState(false);

  // ECG animation
  const dashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dashAnim.setValue(0);

    const animation = Animated.loop(
      Animated.timing(dashAnim, {
        toValue: 1,
        duration: smokeDetected ? 850 : 1400, // 🔥 faster when danger
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [smokeDetected]);

  // Auto popup when smoke becomes true
  useEffect(() => {
    if (smokeDetected) setOpen(true);
  }, [smokeDetected]);

  const text = smokeDetected ? "Smoke Detected" : "All Safe";
  const icon = smokeDetected ? "skull-outline" : "shield-check";

  const accent = smokeDetected ? "#FF3B30" : "#d0d0d0c8";
  const pillBg = smokeDetected ? "#FF3B301A" : colors.surface;

  // ECG continuous path
  const ecgPath =
    "M1 9 " +
    "L10 9 " +
    "L14 9 " +
    "L16 3 " +
    "L18 15 " +
    "L20 9 " +
    "L28 9 " +
    "L31 6 " +
    "L33 12 " +
    "L35 9 " +
    "L51 9";

  // Moving highlight dash
  const dashOffset = dashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });

  return (
    <>
      <Pressable
        onPress={() => {
          if (smokeDetected) setOpen(true);
        }}
        style={[
          styles.pill,
          {
            backgroundColor: accent,
            opacity: smokeDetected ? 1 : 0.85,
          },
        ]}
      >
        {/* Solid icon container */}
        <View style={[styles.iconBox]}>
          <MaterialCommunityIcons name={icon} size={24} color={"#000000"} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: "black" }]}>{text}</Text>
          {!smokeDetected && (
            <Text style={[styles.sub, { color: "dark-gray" }]}>
              System normal
            </Text>
          )}

          {/* Text */}
        </View>

        {/* ✅ Polished Continuous ECG */}
        <View style={styles.ecgWrap}>
          <Svg width={60} height={30} viewBox="0 0 56 18">
            {/* Base ECG (continuous line) */}
            <Path
              d={ecgPath}
              stroke={"black"}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={smokeDetected ? 0.38 : 0.22}
            />

            {/* Moving highlight scanner */}
            <AnimatedPath
              d={ecgPath}
              stroke={"black"}
              strokeWidth={2.7}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={smokeDetected ? 1 : 0.75}
              strokeDasharray="16 70"
              strokeDashoffset={dashOffset as any}
            />
          </Svg>
        </View>
      </Pressable>

      {/* ✅ Your modal (unchanged) */}
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalTop}>
              <View style={styles.iconDanger}>
                <MaterialCommunityIcons
                  name="alert"
                  size={22}
                  color="#FF3B30"
                />
              </View>

              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Smoke Detected
              </Text>
            </View>

            <Text style={[styles.modalDesc, { color: colors.icon }]}>
              Possible smoke or overheating detected near the battery/vehicle.
              Please stop safely and check immediately.
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setOpen(false)}
                style={[styles.btn, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.btnText, { color: colors.text }]}>
                  Dismiss
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setOpen(false)}
                style={[styles.btn, { backgroundColor: "#FF3B30" }]}
              >
                <Text style={[styles.btnText, { color: "#fff" }]}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 16,
    marginBottom: 16,

    borderRadius: 20,
    width: "65%",
    alignSelf: "flex-start",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    letterSpacing: 0.2,
    fontFamily: "sup-bold",
  },

  sub: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.85,
    marginTop: 1,
    fontFamily: "sup",
  },

  ecgWrap: {
    paddingLeft: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  // modal styles
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  modalCard: {
    width: "100%",
    borderRadius: 22,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  modalTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  iconDanger: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B3022",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    opacity: 0.9,
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    fontWeight: "800",
    fontSize: 13,
  },
});
