import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, StyleSheet, Text, useColorScheme, View } from "react-native";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const P_Odometer = ({ distance }: { distance: number }) => {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <AnimatedLinearGradient
      colors={["#00E0FF", "#6C5CE7", "#00E0FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientBorder]}
    >
      {/* Inner Surface */}
      <View style={[styles.inner, { backgroundColor: colors.surface }]}>
        <View style={styles.row}>
          <Text style={[styles.value, { color: colors.text }]}>{distance}</Text>
          <Text style={[styles.unit, { color: colors.icon }]}>km</Text>
        </View>
      </View>
    </AnimatedLinearGradient>
  );
};

export default P_Odometer;

const styles = StyleSheet.create({
  gradientBorder: {
    padding: 0.5, // thickness of border
    borderRadius: 26,
    alignSelf: "center",

    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  inner: {
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 2,
  },

  unit: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
});
